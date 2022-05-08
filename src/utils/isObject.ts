export default function isObject(instance: any): boolean {
  return Object.prototype.toString.call(instance).match(/\[object\s(\w+)]/)[1] === 'Object';
}
