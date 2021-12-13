import { page } from '../../utils/hbs-render.js';
import html from './template.js';

const data = {
  photo: '/images/temp/1.png',
  name: 'Иван Иванов',
  fields: [
      { name: 'email', type: 'text', title: 'Почта', value: 'pochta@yandex.ru' },
      { name: 'login', type: 'text', title: 'Логин', value: 'ivanivanov' },
      { name: 'first_name', type: 'text', title: 'Имя', value: 'Иван' },
      { name: 'second_name', type: 'text', title: 'Фамилия', value: 'Иванов' },
      { name: 'display_name', type: 'text', title: 'Имя в чате', value: 'ivanivanov' },
      { name: 'phone', type: 'tel', title: 'Телефон', value: '+7192471842' }
  ]
};

page.render(html, data);