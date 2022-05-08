import Controller from '../../modules/Controller';
import { UserProfileData, usersAPI } from '../../api/UsersAPI';
import { authAPI, UserInfoData } from '../../api/AuthAPI';
import { SETTINGS, storeMap } from '../../config';

class ProfileDataController extends Controller {
  constructor() {
    super();
  }

  async getUserInfo() {
    try {
      const response = await authAPI.getUserInfo();
      return response.response;
    } catch (e) {
      this.statusHandler(e.status);
    }
    return null;
  }

  async updateUserInfo() {
    const userInfo: UserInfoData = await this.getUserInfo();
    if (!userInfo) {
      return;
    }
    if (!userInfo.avatar) {
      userInfo.avatar = SETTINGS.avatarDummy;
    } else {
      userInfo.avatar = `${SETTINGS.baseURL}/resources${userInfo.avatar}`;
    }

    const data = {
      avatar: userInfo.avatar,
      first_name: userInfo.first_name,
      fields: [
        { name: 'display_name', title: 'Имя в чате', type: 'text', value: userInfo.display_name },
        { name: 'email', title: 'Почта', type: 'text', value: userInfo.email },
        { name: 'first_name', title: 'Имя', type: 'text', value: userInfo.first_name },
        { name: 'login', title: 'Логин', type: 'text', value: userInfo.login },
        { name: 'phone', title: 'Телефон', type: 'text', value: userInfo.phone },
        { name: 'second_name', title: 'Фамилия', type: 'text', value: userInfo.second_name },
      ],
    };
    this.storeSet(storeMap.profilePageProps, data);
  }

  async changeProfileInfo(data: UserProfileData) {
    try {
      await usersAPI.changeProfile(data);
      this.back();
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  async changeProfileAvatar(data: FormData) {
    try {
      const response = await usersAPI.changeAvatar(data);
      return response;
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  public async pageMountHandler() {
    this.updateUserInfo();
  }

  public updateAvatar(url: string) {
    return `${SETTINGS.baseURL}/resources${url}`;
  }
}

const profileDataController = new ProfileDataController();
export default profileDataController;
