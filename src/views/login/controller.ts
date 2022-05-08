import Controller from '../../modules/Controller';
import { authAPI, LoginFormData } from '../../api/AuthAPI';
import { Routes } from '../../index';
import { storeMap } from '../../config';

class LoginController extends Controller {
  constructor() {
    super();
  }

  async signIn(data: LoginFormData) {
    try {
      await authAPI.signIn(data);
      this.go(Routes.chatSelect);
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  async checkAuth() {
    try {
      const response = await authAPI.getUserInfo();
      this.storeSet(storeMap.currentUserID, response.response['id']);
      this.go(Routes.chatSelect);
      return response.response['id'];
    } catch (e) {
      return;
    }
  }
}

const loginController = new LoginController();
export default loginController;
