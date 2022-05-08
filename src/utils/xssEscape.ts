import { StringObject } from '../types';

const htmlEscapes: StringObject = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // eslint-disable-next-line
  "'": '&#39;',
};

const findEx = /[&<>"']/g;

export default function xssEscape(markup: string) {
  return markup.replace(findEx, (match) => htmlEscapes[match]);
}
