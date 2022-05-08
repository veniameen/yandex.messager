import Stack from '../modules/Stack';
import isObject from './isObject';
import isComplexObject from './isComplexObject';

type StackItem = {
    source: unknown[] | {},
    destination: unknown[] | {},
}

export default function cloneDeep(source: unknown): unknown {
  if (!isObject(source) && !Array.isArray(source)) return source;

  _raiseErrorIfNotPlain(source);

  const stack = new Stack();
  const copy = Array.isArray(source) ? [] : {};

  stack.push({
    source: source,
    destination: copy,
  });

  while (!stack.isEmpty()) {
    _cloner(stack);
  }

  return copy;
}

function _cloner(stack: Stack): void | never {
  const pair: StackItem = stack.pop() as StackItem;
  const source = pair.source;
  const copy: any = pair.destination;

  if (Array.isArray(source)) {
    for (const value of source) {
      copy.push(_valueHandler(value, stack));
    }
  } else if (isObject(source)) {
    for (const [key, value] of Object.entries(source)) {
      copy[key] = _valueHandler(value, stack);
    }
  } else {
    throw new Error('cloneDeep: Unexpected behavior');
  }
}

function _valueHandler(value: unknown, stack: Stack): unknown {
  _raiseErrorIfNotPlain(value);

  let result = value;

  if (Array.isArray(value)) {
    result = [];
    stack.push({ source: value, destination: result });
  } else if (isObject(value)) {
    result = {};
    stack.push({ source: value, destination: result });
  }

  return result;
}

function _raiseErrorIfNotPlain(value: unknown): void | never {
  if (isComplexObject(value)) throw new Error('cloneDeep: Complex object detected');
}
