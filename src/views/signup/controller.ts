import Controller from '../../modules/Controller';
import { authAPI, RegisterFormData } from '../../api/AuthAPI';
import { Routes } from '../../index';

class SignUpController extends Controller {
  constructor() {
    super();
  }

  async signUp(data: RegisterFormData) {
    try {
      await authAPI.signUp(data);
      this.go(Routes.chatSelect);
    } catch (e) {
      this.statusHandler(e.status, errorDescriptions);
    }
  }
}

const errorDescriptions = {
  409: 'Пользователь с такими параметрами (login, email) уже существует',
};

const signUpController = new SignUpController();
export default signUpController;
