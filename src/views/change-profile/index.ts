import { page } from '../../utils/hbs-render.js';
import Button from '../../components/Button/index.js';
import Validator from '../../modules/Validator.js';
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

const checks = {
  email: [
        Validator.CHECKS.REQUIRED,
        Validator.CHECKS.EMAIL
  ],
  login: [
        Validator.CHECKS.REQUIRED,
        Validator.CHECKS.LENGTH(3, 20),
        Validator.CHECKS.ALPHANUMERIC
  ],
  first_name: [
        Validator.CHECKS.REQUIRED,
        Validator.CHECKS.ALPHABETIC,
        Validator.CHECKS.LENGTH(3, 28),
  ],
  second_name: [
        Validator.CHECKS.REQUIRED,
        Validator.CHECKS.ALPHABETIC,
        Validator.CHECKS.LENGTH(3, 28),
  ],
  display_name: [
        Validator.CHECKS.REQUIRED,
        Validator.CHECKS.ALPHABETIC,
        Validator.CHECKS.LENGTH(3, 28),
    ],
    phone: [
        Validator.CHECKS.REQUIRED,
        Validator.CHECKS.PHONE,
        Validator.CHECKS.LENGTH(10, 15),
  ]
}

const button = new Button({
  name: 'Сохранить'
});

if (button.element)
    Handlebars.registerPartial('button', button.element.innerHTML);

page.render(html, data);

const form: HTMLFormElement | null = document.querySelector('.profile-form');

if (form)
    new Validator(form, checks);