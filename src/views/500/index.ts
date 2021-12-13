import { page } from '../../utils/hbs-render.js';
import html from './template.js';

const data = {
  status: '500',
  caption: 'Мы уже фиксим',
  backlink: {
      href: '/',
      text: 'Назад к чатам'
  }
};

page.render(html, data);