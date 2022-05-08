import Router from './modules/Router';
import { LoginPage } from './views/login/index';
import { ChatSelectPage } from './views/chat-select/index';
import { ErrorPage } from './views/error/index';
import { ProfilePage } from './views/profile/index';
import { ProfileDataPage } from './views/change-profile/index';
import { ProfilePasswordPage } from './views/change-password/index';
import { SignupPage } from './views/signup/index';
import { data as loginContext } from './views/login/template';
import { data as signupContext } from './views/signup/template';
import { data as profileDataContext } from './views/change-profile/template';
import { data as profilePasswordContext } from './views/change-password/template';
import Store from './modules/Store';
import { storeMap } from './config';

const router = new Router('.app');

export enum Routes {
  login = '/login',
  chatSelect = '/messenger',
  error = '/error',
  profile = '/settings',
  profileData = '/change-settings',
  profilePassword = '/change-password',
  signup = '/signup',
}

const App = async () => {
  const badRouteHandler = () => {
    new Store().set(storeMap.errorPageProps, { type: '404', description: 'Не туда попали' });
    router.go(Routes.error);
  };

  router
      .use(Routes.login, LoginPage, loginContext)
      .use(Routes.chatSelect, ChatSelectPage, {})
      .use(Routes.error, ErrorPage, {})
      .use(Routes.profile, ProfilePage, {})
      .use(Routes.profileData, ProfileDataPage, profileDataContext)
      .use(Routes.profilePassword, ProfilePasswordPage, profilePasswordContext)
      .use(Routes.signup, SignupPage, signupContext)
      .setDefaultRoute(Routes.login)
      .setBadRouteHandler(badRouteHandler)
      .start();
};

App();
