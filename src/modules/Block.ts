import { EventBus } from './EventBus.js';

type Element = null | HTMLElement;
type Property = Record<string, any>;

interface Meta {
    tagName: string;
    props: Property;
}

export class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  private readonly _meta: Meta;
  private _element: Element = null;

  public eventBus: EventBus;
  public props: object;

  constructor(tagName = 'div', props = {}) {
    const eventBus = new EventBus();
    this._meta = { tagName, props };
    this.props = this._makePropsProxy(props);
    this.eventBus = eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    this._element = this._createDocumentElement(this._meta.tagName);
  }

  init() {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidMount() {
    this.componentDidMount();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  componentDidMount(/* oldProps?: object*/) {}

  _componentDidUpdate(oldProps?: object, newProps?: object) {
    const response = this.componentDidUpdate(oldProps, newProps);
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    return response;
  }

  componentDidUpdate(oldProps?: object, newProps?: object) {
    if (oldProps || newProps) {}
    return true;
  }

  setProps = (nextProps: object) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  _render() {
    const block = this.render();
    if (this._element) {
      this._element.innerHTML = Handlebars.compile(block)(this.props);
    }
  }

  render() {}

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: object) {
    const self = this;
    return new Proxy(props, {
      set(target: any, prop: any, val) {
        target[prop] = val;
        self.eventBus.emit(Block.EVENTS.FLOW_CDU);
        return true;
      },
      deleteProperty() {
        throw new Error('нет доступа');
      },
    });
  }

  _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  show() {
    if (this.element) {
      this.element.style.display = 'block';
    }
  }

  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }
}
