import EventBus from './EventBus';
import { Callback } from '../types';

interface IWebSocketTransport {
    open(): void;
    close(): void;
    send(): void;
    subscribe(event: EVENTS, callback: Callback): void;
    unsubscribe(event: EVENTS, callback: Callback): void;
}

enum EVENTS {
    OPENING = '1',
    OPENED = '2',
    CLOSING = '3',
    CLOSED = '4',
    CLOSED_CLEAN = '5',
    CLOSED_BREAK = '6',
    SENT = '7',
    RECEIVED = '8',
    ERROR = '9',
}

export default class WebSocketTransport implements IWebSocketTransport {
  static EVENTS = EVENTS;

  protected _eventBus: EventBus;
  protected _socket: WebSocket | null;
  protected _baseUrl: string;
  protected _optionalUrl: string | null;

  constructor(baseUrl: string) {
    this._eventBus = new EventBus();
    this._baseUrl = baseUrl;
    this._optionalUrl = null;
    this._socket = null;
  }

  public open(optionalUrl = '') {
    if (this._optionalUrl === optionalUrl) {
      return;
    }

    this.close();

    this._eventBus.emit(EVENTS.OPENING, optionalUrl);

    this._socket = new WebSocket(`${this._baseUrl}${optionalUrl}`);
    this._optionalUrl = optionalUrl;
    this._socket.onclose = (e) => {
      // @ts-ignore
      // this._socket = new WebSocket(`wss://ya-praktikum.tech/ws${optionalUrl}`);
      console.log('websocket disconnected:' + e.code + ' ' + e.reason + ' ' + e.wasClean);
    };

    this._socket.addEventListener('open', this._openEventHandler.bind(this));
    this._socket.addEventListener('close', this._closeEventHandler.bind(this));
    this._socket.addEventListener('message', this._messageEventHandler.bind(this));
    this._socket.addEventListener('error', this._errorEventHandler.bind(this));
  }

  public close() {
    if (this._socket === null) {
      return;
    }

    this._eventBus.emit(EVENTS.CLOSING);

    this._socket.removeEventListener('open', this._openEventHandler.bind(this));
    this._socket.removeEventListener('close', this._closeEventHandler.bind(this));
    this._socket.removeEventListener('message', this._messageEventHandler.bind(this));
    this._socket.removeEventListener('error', this._errorEventHandler.bind(this));

    this._socket.close();
    this._socket = null;
    this._optionalUrl = null;
  }

  public send(message = 'ping') {
    if (this._socket === null) {
      throw new Error(`${this.constructor.name}: Socket is closed or not opened yet.`);
    }

    this._socket.send(message);
    this._eventBus.emit(EVENTS.SENT, message);
  }

  public subscribe(event: EVENTS, callback: Callback) {
    this._eventBus.subscribe(event, callback);
  }

  public unsubscribe(event: EVENTS, callback: Callback) {
    this._eventBus.unsubscribe(event, callback);
  }

  protected _openEventHandler(event: Event) {
    this._eventBus.emit(EVENTS.OPENED, event);
  }

  protected _closeEventHandler(event: any) {
    this._eventBus.emit(EVENTS.CLOSED, event);
    if (event.wasClean) {
      this._eventBus.emit(EVENTS.CLOSED_CLEAN);
    } else {
      this._eventBus.emit(EVENTS.CLOSED_BREAK);
    }
  }

  protected _messageEventHandler(event: MessageEvent) {
    this._eventBus.emit(EVENTS.RECEIVED, event);
  }

  protected _errorEventHandler(event: ErrorEvent) {
    this._eventBus.emit(EVENTS.ERROR, event);
  }
}
