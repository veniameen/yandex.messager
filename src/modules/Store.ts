import EventBus from './EventBus';
import { set } from '../utils/objectHandlers';
import cloneDeep from '../utils/cloneDeep';
import { PlainObject } from '../types';

interface IStore {
  set(path: string, data: PlainObject): void | never;
  get(path: string): unknown | never;
  rewrite(path: string, data: PlainObject): void | never;
  delete(path: string): void | never;
  subscribe(path: string, callback: () => void): void;
  unsubscribe(path: string, callback: () => void): void;
  enableStrictMode(): void;
  disableStrictMode(): void;
  forceEmit(path: string): void;
}

type Host = {
  host: PlainObject,
  key: string
}

export default class Store implements IStore {
  static _instance: Store;
  protected eventBus: EventBus;
  protected _store: Record<string, unknown>;
  protected _isStrictMode: boolean;

  constructor() {
    if (Store._instance) return Store._instance;
    Store._instance = this;
    this.eventBus = new EventBus();
    this._store = {};
    this._isStrictMode = false;
  }

  public flush() {
    this._store = {};
  }

  public set(path: string, data: any) {
    this._raiseErrorIfPathNotString(path);

    set(this._store, path, cloneDeep(data));

    this._emit(path);
  }

  public get(path: string): any {
    this._raiseErrorIfPathNotString(path);

    const data = this._getByPathOrRaiseError(path);

    return cloneDeep(data);
  }

  public rewrite(path: string, data: any) {
    this._raiseErrorIfPathNotString(path);

    const target = this._getHost(path);

    set(this._store, path, null);
    target.host[target.key] = cloneDeep(data);
    this._emit(path);
  }

  public delete(path: string) {
    this._raiseErrorIfPathNotString(path);

    const target = this._getHost(path);

    this._raiseErrorIfHasNoProperty(target.host, target.key, path);

    delete target.host[target.key];
  }

  public enableStrictMode(): void {
    this._isStrictMode = true;
  }

  public disableStrictMode(): void {
    this._isStrictMode = true;
  }

  protected _getHost(path: string): Host | never {
    const pathKeys = path.split('.');

    if (pathKeys.length === 0) throw new Error(`${this.constructor.name}: Root operations is prohibited`);

    const targetKey = pathKeys.pop() as string;
    const reducedPath = pathKeys.join('.');

    const targetObject = this._getByPathOrRaiseError(reducedPath) as PlainObject;

    return {
      host: targetObject,
      key: targetKey,
    };
  }

  protected _getByPathOrRaiseError(path: string) {
    const pathKeys = path.split('.');

    return pathKeys.reduce((target, key) => {
      this._raiseErrorIfHasNoProperty(target, key, path);
      if (!target && !this._isStrictMode) return undefined;

      return target[key];
    }, this._store);
  }

  protected _raiseErrorIfHasNoProperty(target: PlainObject, key: string, fullPath: string) {
    if (!this._isStrictMode) return;
    if (!target.hasOwnProperty(key)) {
      throw new Error(`${this.constructor.name}: Key '${key}' of path '${fullPath}' doesn't exist in store`);
    }
  }

  forceEmit(path: string) {
    this.eventBus.emit(path);
  }

  public subscribe(path: string, callback: () => void) {
    this.eventBus.subscribe(path, callback);
  }

  public unsubscribe(path: string, callback: () => void) {
    this.eventBus.unsubscribe(path, callback);
  }

  protected _emit(path: string) {
    const pathKeys = path.split('.');
    pathKeys.reduce((partial, current) => {
      partial = [partial, current].filter(Boolean).join('.');

      this.eventBus.emit(partial);

      return partial;
    }, '');
  }

  protected _raiseErrorIfPathNotString(path: unknown) {
    if (typeof path !== 'string') throw new Error(`${this.constructor.name}: Type of 'path' must be string`);
  }
}
