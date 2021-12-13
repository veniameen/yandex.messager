import { page } from '../../utils/hbs-render.js';
import Button from '../../components/Button/index.js';
import Validator from '../../modules/Validator.js';
import html from './template.js';

const data = {
  fields: {
    email: {
      name: 'email',
      type: 'email',
      title: 'Почта',
    },
    login: {
      name: 'login',
      type: 'text',
      title: 'Логин',
    },
    first: {
      name: 'first_name',
      type: 'text',
      title: 'Имя',
    },
    second: {
      name: 'second_name',
      type: 'text',
      title: 'Фамилия',
    },
    phone: {
      name: 'phone',
      type: 'tel',
      title: 'Телефон',
    },
    password: {
      name: 'password',
      type: 'password',
      title: 'Пароль',
    },
    verify: {
      name: 'verify_password',
      type: 'password',
      title: 'Пароль (ещё раз)',
    },
  },
};

const checks = {
  login: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.ALPHANUMERIC,
    Validator.CHECKS.LENGTH(3, 20),
  ],
  password: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.PASSWORD_STRENGTH,
    Validator.CHECKS.LENGTH(8, 40),
  ],
  verify_password: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.PASSWORD_STRENGTH,
  ],
  email: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.EMAIL,
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
  phone: [
    Validator.CHECKS.REQUIRED,
    Validator.CHECKS.PHONE,
  ],
};

const button = new Button({
  name: 'Зарегистрироваться',
});

if (button.element) {
  Handlebars.registerPartial('button', button.element.innerHTML);
}

page.render(html, data);

const form: HTMLFormElement | null = document.querySelector('.auth-form');

if (form) {
  new Validator(form, checks);
}
