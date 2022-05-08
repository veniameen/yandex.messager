import EventBus from './EventBus';
import Store from './Store';
import { PlainObject } from '../types';

type Property = Record<string, any>;

interface Meta {
  tagName: string;
  props: Property;
  storePath: string | null;
}

const store = new Store();

export default class Component {
  static EVENTS = {
    CONSTRUCTED: 'construction-done',
    INITIALISED: 'flow:component-did-init',
    UPDATED: 'flow:component-did-update',
    COMPILED: 'flow:component-did-compile',
    MOUNTED: 'status:component-did-mount',
    UNMOUNTED: 'status:component-did-unmount',
  };

  private readonly _meta: Meta;
  private readonly _props: object;
  private _element: HTMLElement;
  protected _parentNode: HTMLElement | null = null;
  public eventBus: EventBus;

  constructor(props = {}, storePath: string | null = null, tagName = 'div') {
    this._meta = { tagName, props, storePath };
    this._props = this._makePropsProxy(props);
    this.eventBus = new EventBus();
    this._registerEvents();
    this.eventBus.emit(Component.EVENTS.CONSTRUCTED);
  }

  _registerEvents() {
    this.eventBus.subscribe(Component.EVENTS.CONSTRUCTED, this._init.bind(this));
    this.eventBus.subscribe(Component.EVENTS.INITIALISED, this._compile.bind(this, true));
    this.eventBus.subscribe(Component.EVENTS.UPDATED, this._compile.bind(this));
  }

  _init() {
    this._element = document.createElement(this._meta.tagName);
    if (this._meta.props.hasOwnProperty('classList')) {
      this._meta.props.classList.forEach((className: string) => this._element.classList.add(className));
    }

    this._element.setAttribute('style', 'all: inherit');
    if (this._meta.storePath) {
      store.subscribe(this._meta.storePath, () => this.eventBus.emit(Component.EVENTS.UPDATED));
    }
    this.eventBus.emit(Component.EVENTS.INITIALISED);
  }

  protected _compile(force = false) {
    force;

    this.beforeCompile();

    if (this._meta.storePath) {
      this._meta.props = (store.get(this._meta.storePath) as Property) || this._meta.props;
    }

    const block = this.compile(this._meta.props);

    if (this._element) {
      this._element.innerHTML = block;
    }

    this.afterCompile();

    this.eventBus.emit(Component.EVENTS.COMPILED);
  }

  protected compile(context: PlainObject): string | never {
    console.log(context);
    throw new Error(`${this.constructor.name}: Method 'compile' must be redefined`);
  }

  protected mount(parentNode: HTMLElement): void {
    this.beforeMount();

    if (this._parentNode) throw new Error(`${this.constructor.name}: Component is already mounted`);
    parentNode.appendChild(this._element);
    this._parentNode = parentNode;

    this.afterMount();

    this.eventBus.emit(Component.EVENTS.MOUNTED);
  }

  unmount(): void {
    if (!this._parentNode) return;

    this.beforeUnmount();

    this._parentNode.removeChild(this._element);
    this._parentNode = null;

    this.afterUnmount();

    this.eventBus.emit(Component.EVENTS.UNMOUNTED);
  }

  bindParent(parent: Component) {
    if (this._meta.storePath) store.subscribe(this._meta.storePath, () => parent.eventBus.emit(Component.EVENTS.UPDATED));
  }

  public setProps = (nextProps: object) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this._props, nextProps);
  };

  public get element() {
    return this._element;
  }

  public show() {
    const element = this.element;
    if (element) element.style.display = 'block';
  }

  public hide() {
    const element = this.element;
    if (element) element.style.display = 'none';
  }

  protected beforeCompile() {}

  protected afterCompile() {}

  protected beforeMount() {}

  protected afterMount() {}

  protected beforeUnmount() {}

  protected afterUnmount() {}

  protected _makePropsProxy(props: object) {
    const self = this;
    return new Proxy(props, {
      set(target: any, prop: any, val) {
        target[prop] = val;
        self.eventBus.emit(Component.EVENTS.UPDATED);
        return true;
      },
      deleteProperty() {
        throw new Error(`${this.constructor.name}: Proxy. Component property deletion is prohibited`);
      },
    });
  }
}
