import { template } from './template';
import Button from '../../components/button/index';
import Validator from '../../modules/Validator';
import Component from '../../modules/Component';
import { profileValidationRules as checks, storeMap } from '../../config';
import controller from './controller';

const validator = new Validator(checks);
validator.setDataHandler(controller.changeProfileInfo.bind(controller));

export class ProfileDataPage extends Component {
  constructor(props: any) {
    const saveButton = new Button({ caption: 'Сохранить', type: 'submit' } );
    if (saveButton.element) {
      Handlebars.registerPartial('saveButton', saveButton.element.innerHTML);
    };
    const changeButton = new Button({ caption: 'Поменять', type: 'submit' } );
    if (changeButton.element) {
      Handlebars.registerPartial('changeButton', changeButton.element.innerHTML);
    };
    super(props, storeMap.profilePageProps);
    this.element.addEventListener('click', (e) => this.clickHandler(e));
  }

  beforeCompile() {
    validator.detach();
    const avatarForm = this.element.querySelector('.avatar-form');
    if (avatarForm) avatarForm.removeEventListener('submit', this.avatarFormHandler);
  }

  async beforeMount() {
    await controller.pageMountHandler();
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }

  afterCompile() {
    if (this.element) validator.attach(this.element, '.profile-form');
    const avatarForm = this.element.querySelector('.avatar-form');
    if (avatarForm) avatarForm.addEventListener('submit', (e) => this.avatarFormHandler(e));
  }

  clickHandler(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.profile__backlink')) {
      controller.back();
    } else if (target.closest('.profile__photo')) {
      const modal = this.element.querySelector('.modal');
      if (modal) modal.classList.add('modal_active');
    } else if (target.classList.contains('modal')) target.classList.remove('modal_active');
    // @ts-ignore
    else if (target.classList.contains('field-file')) target.nextElementSibling.click();
  }

  async avatarFormHandler(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const response = await controller.changeProfileAvatar(formData);
    const modal = this.element.querySelector('.modal');
    if (modal) modal.classList.remove('modal_active');
    (this.element.querySelector('.profile__photo__change img') as HTMLImageElement).src = controller.updateAvatar(response.response.avatar);
  }
}
