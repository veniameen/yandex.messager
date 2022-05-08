import { API } from './API';

export interface UserProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface UserPasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface UserSearchData {
  login: string;
}

class UsersAPI extends API {
  changeProfile(data: UserProfileData) {
    return this.put('/user/profile', { data });
  }

  changeAvatar(data: FormData) {
    return this.put('/user/profile/avatar', { data });
  }

  changePassword(data: UserPasswordData) {
    return this.put('/user/password', { data });
  }

  getByID(id: number) {
    return this.get(`/user/${id}`);
  }

  searchByLogin(data: UserSearchData) {
    return this.post('/user/search', { data });
  }
}

export const usersAPI = new UsersAPI();
