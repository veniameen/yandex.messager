import { template } from './template';
import Button from '../../components/button/index';
import FormValidator from '../../modules/Validator';
import Component from '../../modules/Component';
import controller from './controller';
import { Routes } from '../../index';
import { profileValidationRules as checks } from '../../config';

const validator = new FormValidator(checks);
validator.setDataHandler(controller.signUp.bind(controller));

export class SignupPage extends Component {
  constructor(props: any) {
    const button = new Button({
      caption: 'Зарегистрироваться',
      type: 'submit',
    });
    if (button.element) {
      Handlebars.registerPartial('button', button.element.innerHTML);
    }
    super(props);
    this.element.addEventListener('click', (e) => this.clickHandler(e));
  }

  afterCompile() {
    if (this.element) validator.attach(this.element, '.auth-form');
  }

  beforeCompile() {
    validator.detach();
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }

  clickHandler(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('link-signup')) controller.go(Routes.login);
  }
}
