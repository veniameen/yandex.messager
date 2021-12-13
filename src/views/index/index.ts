import { page } from '../../utils/hbs-render.js';
import html from './template.js';

const data = {
  chats: [
    {
      photo: '/images/temp/1.png',
      name: 'Андрей',
      last_message: 'Изображение',
      time: '10:49',
      unreads: 2
    },
    {
      photo: '/images/temp/5.png',
      name: 'Вадим',
      last_message: 'Вы: стикер',
      time: '12:00',
      unreads: undefined
    },
    {
      photo: '/images/temp/4.png',
      name: 'Илья',
      last_message: 'Друзья, у меня для вас особенный выпуск новостей!...',
      time: '15:12',
      unreads: 4
    }
  ]
};

page.render(html, data);