import { PlainObject } from '../types';

export default function isComplexObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && value.constructor !== Object && Object.prototype.toString.call(value) === '[object Object]';
}
