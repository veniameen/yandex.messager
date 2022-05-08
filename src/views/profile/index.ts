import Component from '../../modules/Component';
import { storeMap } from '../../config';
import controller from './controller';
import { Routes } from '../../index';
import { template } from './template';

export class ProfilePage extends Component {
  constructor(props: any) {
    super(props, storeMap.profilePageProps);
    this.element.addEventListener('click', (e) => this.clickHandler(e));
  }

  beforeMount() {
    controller.updateUserInfo();
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }

  clickHandler(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.profile__backlink')) {
      controller.back();
    } else if (target.closest('.edit-profile-link')) {
      controller.go(Routes.profileData);
    } else if (target.closest('.edit-password-link')) {
      controller.go(Routes.profilePassword);
    } else if (target.closest('.logout-link')) {
      controller.logout();
    }
  }
};
