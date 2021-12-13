type Callback = (...args: any[]) => void;
type ListenersList = Record<string, Callback[]>;

export class EventBus {
    protected listeners: ListenersList = {};

    constructor() {
        this.listeners = {};
    }
   
    on(event: string, callback: Callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
    
        this.listeners[event].push(callback);
    }
   
    off(event: string, callback: Callback) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
    
        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }
   
    emit(event: string, ...args: any) {
        if (!this.listeners[event]) {
          throw new Error(`Нет события: ${event}`);
        }
      
        this.listeners[event].forEach(function(listener) {
            listener(...args);
        });
    }
}