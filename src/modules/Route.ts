import Component from './Component';

export default class Route {
  private _pathname: string;
  private readonly _constructor: typeof Component;
  private readonly _props: any;
  private _block: any = null;

  constructor(path: string, constructor: typeof Component, props: any) {
    this._pathname = path;
    this._constructor = constructor;
    this._block = null;
    this._props = props;
  }

  pathname() {
    return this._pathname;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.unmount();
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  render(): void {
    if (!this._block) this._block = new this._constructor(this._props);
    this.mount();
  }

  mount(): void {
    const root = document.querySelector(this._props.rootQuery);
    if (!root) {
      throw new Error(`${this.constructor.name}: selector "${this._props.rootQuery}" not found`);
    }
    this._block.mount(root);
  }
}
