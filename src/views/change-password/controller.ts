import Controller from '../../modules/Controller';
import { UserPasswordData, usersAPI } from '../../api/UsersAPI';
import { authAPI, UserInfoData } from '../../api/AuthAPI';
import { SETTINGS } from '../../config';

class ProfilePasswordController extends Controller {
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

    return userInfo;
  }

  async changeProfilePassword(data: UserPasswordData) {
    try {
      await usersAPI.changePassword(data);
      this.back();
    } catch (e) {
      this.statusHandler(e.status);
    }
  }
}

const profilePasswordController = new ProfilePasswordController();
export default profilePasswordController;
