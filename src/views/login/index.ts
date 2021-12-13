import { page } from '../../utils/hbs-render.js';
import Button from '../../components/Button/index.js';
import Validator from '../../modules/Validator.js';
import html from './template.js';

export const data = {
  fields: {
      login: {
          name: 'login',
          type: 'text',
          title: 'Логин',
          index: 1
      },
      password: {
          name: 'password',
          type: 'password',
          title: 'Пароль',
          index: 2
      }
  }
};

const checks = {
  login: [
    Validator.CHECKS.ALPHANUMERIC,
    Validator.CHECKS.LENGTH(3, 20)
  ],
  password: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.PASSWORD_STRENGTH,
    Validator.CHECKS.LENGTH(8, 40)
  ]
}

const button = new Button({
  name: 'Авторизоваться'
});

if (button.element)
    Handlebars.registerPartial('button', button.element.innerHTML);

page.render(html, data);

const form: HTMLFormElement | null = document.querySelector('.auth-form');

if (form)
    new Validator(form, checks);