import { page } from '../../utils/hbs-render.js';
import Button from '../../components/Button/index.js';
import Validator from '../../modules/Validator.js';
import html from './template.js';

const data = {
  photo: '/images/temp/1.png',
  fields: [
    { name: 'oldPassword', type: 'password', title: 'Старый пароль', value: 'pochta@yandex.ru' },
    { name: 'newPassword', type: 'password', title: 'Новый пароль', value: 'pochta@yandex.ru' },
    { name: 'verifyPassword', type: 'password', title: 'Повторите новый пароль', value: 'pochta@yandex.ru' },
  ],
};

const checks = {
  oldPassword: [
    Validator.CHECKS.REQUIRED,
  ],
  newPassword: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.PASSWORD_STRENGTH,
    Validator.CHECKS.LENGTH(8, 40),
  ],
  verifyPassword: [
    Validator.CHECKS.REQUIRED,
  ],
};

const button = new Button({
  name: 'Сохранить',
});

if (button.element) {
  Handlebars.registerPartial('button', button.element.innerHTML);
}

page.render(html, data);

const form: HTMLFormElement | null = document.querySelector('.profile-form');

if (form) {
  new Validator(form, checks);
}
