import { API } from './API';

export interface RegisterFormData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginFormData {
  login: string;
  password: string;
}

export interface UserInfoData {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

class AuthAPI extends API {
  constructor() {
    super();
  }

  signUp(data: RegisterFormData) {
    return this.post('/auth/signup', { data });
  }

  signIn(data: LoginFormData) {
    return this.post('/auth/signin', { data });
  }

  getUserInfo() {
    return this.get('/auth/user');
  }

  logout() {
    return this.post('/auth/logout');
  }
}

export const authAPI = new AuthAPI();
