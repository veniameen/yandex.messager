import Route from './Route';
import Component from './Component';

export default class Router {
  static _instance: Router | null = null;

  private _rootSelector: string | null = null;
  private _routes: Route[] = [];
  private _history = window.history;
  private _currentRoute: Route | null = null;
  private _defaultRoutePathname: string | null = null;
  public _badRouteHandler?: () => void;

  constructor(rootSelector: string | null = null) {
    if (Router._instance) {
      if (rootSelector && !Router._instance._rootSelector) {
        Router._instance._rootSelector = rootSelector;
      }
      return Router._instance;
    }
    this._rootSelector = rootSelector;
    Router._instance = this;
  }

  _rootCheck() {
    if (!this._rootSelector) {
      throw new Error(`${this.constructor.name}: Instance exist, but root node selector not defined yet`);
    }
  }

  _checkRouteDuplicate(pathname: string) {
    const pathExist = this.getRoute(pathname);
    if (pathExist) throw new Error(`${this.constructor.name}: Route on path "${pathname}" already exists`);
  }

  _getExistingRoute(pathname: string): Route | never {
    const route = this.getRoute(pathname);
    if (!route) throw new Error(`${this.constructor.name}: Route on path "${pathname}" doesn't exist`);
    return route;
  }

  use(pathname: string, block: typeof Component, context: any) {
    this._rootCheck();
    this._checkRouteDuplicate(pathname);
    const route = new Route(pathname, block, {
      rootQuery: this._rootSelector,
      ...context,
    });
    this._routes.push(route);
    return this;
  }

  setDefaultRoute(pathname: string): Router | never {
    this._getExistingRoute(pathname);
    this._defaultRoutePathname = pathname;
    return this;
  }

  setBadRouteHandler(handler: () => void): Router {
    this._badRouteHandler = handler;
    return this;
  }

  start() {
    window.onpopstate = (event: any) => this._onRoute(event.currentTarget.location.pathname);
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string): void {
    if (this._defaultRoutePathname && pathname.match(/^\/?$/)) {
      console.log(this._defaultRoutePathname);
      this.go(this._defaultRoutePathname);
      return;
    }

    const route = this.getRoute(pathname);

    if (!route) {
      if (this._badRouteHandler) this._badRouteHandler();
      else if (this._defaultRoutePathname) this.go(this._defaultRoutePathname);
      return;
    }

    if (this._currentRoute) this._currentRoute.leave();

    this._currentRoute = route;
    route.render();
  }

  go(path: string) {
    this._history.pushState(null, '', path);
    this._onRoute(path);
  }

  back() {
    this._history.back();
  }

  forward() {
    this._history.forward();
  }

  getRoute(path: string): Route | undefined {
    return this._routes.find((route) => route.match(path));
  }
}
