import { template } from './template';
import Button from './../../components/button/index';
import Component from '../../modules/Component';
import Validator from '../../modules/Validator';
import { passwordValidationRules as checks } from '../../config';
import controller from './controller';

const validator = new Validator(checks);
validator.setDataHandler(controller.changeProfilePassword.bind(controller));

export class ProfilePasswordPage extends Component {
  constructor(props: any) {
    const button = new Button({ caption: 'Сохранить', type: 'submit' });
    if (button.element) Handlebars.registerPartial('button', button.element.innerHTML);
    super(props);
    this.element.addEventListener('click', (e) => this.clickHandler(e));
  }

  beforeCompile() {
    validator.detach();
  }

  async beforeMount() {
    const userInfo = await controller.updateUserInfo();

    if (!userInfo) return;

    (this.element.querySelector('.profile__fullname') as Element).textContent = userInfo.first_name;
    (this.element.querySelector('.profile__photo__img') as HTMLImageElement).src = userInfo.avatar;
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }

  afterCompile() {
    if (this.element) validator.attach(this.element, '.profile-form');
  }

  clickHandler(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.profile__backlink')) controller.back();
  }
};
