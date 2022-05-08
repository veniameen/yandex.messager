interface IStack {
    push(value: unknown): number;
    pop(): unknown;
    peek(): unknown;
    isEmpty(): boolean;
    getSize(): number;
    clear(): void;
}

type Node = {
    value: unknown,
    prev: Node,
} | null;

export default class Stack implements IStack {
  protected _size: number;
  protected _top: Node;

  constructor() {
    this._size = 0;
    this._top = null;
  }

  push(value: unknown): number {
    this._top = {
      value,
      prev: this._top,
    };
    this._size++;

    return this._size;
  }

  pop(): unknown {
    if (this._top === null) throw new Error('Stack is empty');

    const value = this._top.value;

    this._top = this._top.prev;
    this._size--;

    return (value);
  }

  peek(): unknown {
    if (this._top === null) throw new Error('Stack is empty');

    return (this._top.value);
  }
  isEmpty(): boolean {
    return (this._size === 0);
  }

  getSize(): number {
    return this._size;
  }

  clear(): void {
    this._top = null;
    this._size = 0;
  }
}
