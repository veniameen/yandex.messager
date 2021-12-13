import { page } from '../../utils/hbs-render.js';
import html from './template.js';

const data = {
  status: '404',
  caption: 'Не туда попали',
  backlink: {
      href: '/',
      text: 'Назад к чатам'
  }
};

page.render(html, data);