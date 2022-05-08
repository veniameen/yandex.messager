import Controller from '../../modules/Controller';
import { chatsAPI, CreateChatData, QueryOptions, DeleteChatData, ChatUsers } from '../../api/ChatsAPI';
import { usersAPI, UserSearchData } from '../../api/UsersAPI';
import { SETTINGS, storeMap } from '../../config';
import splitTimestamp from '../../utils/splitTimestamp';
import { PlainObject } from '../../types';
import { authAPI } from '../../api/AuthAPI';
import WebSocketTransport from '../../modules/WebSocketTransport';

class ChatsController extends Controller {
  protected _socket: WebSocketTransport;
  constructor() {
    super();
    this._socket = new WebSocketTransport(SETTINGS.wssURL);
    this._socket.subscribe(WebSocketTransport.EVENTS.RECEIVED, this._socketMessageHandler.bind(this));
    this._socket.subscribe(WebSocketTransport.EVENTS.OPENED, this._socketOpenedHandler.bind(this));
  }

  async getChats(data?: QueryOptions) {
    try {
      const response = await chatsAPI.getChat(data);
      return response.response;
    } catch (e) {
      this.statusHandler(e.status);
    }
    return null;
  }

  public async createChat(data: CreateChatData) {
    try {
      const response = await chatsAPI.createChat(data);
      const getActiveChat = this.storeGet(storeMap.activeChatID);
      await this.updateChatList();

      if ( getActiveChat ) {
        await this.getUsers(getActiveChat);
        this.storeSet(storeMap.chatPageProps + '.chatSelected', true);
      } else {
        this.storeSet(storeMap.activeChatID, null);
        this.storeSet(storeMap.chatPageProps + '.chatSelected', false);
      }
      return response.response;
    } catch (e) {
      this.statusHandler(e.status);
    }
    return null;
  }

  async deleteChat(data: DeleteChatData) {
    try {
      const response = await chatsAPI.deleteChat(data);
      await this.updateChatList();
      this.storeSet(storeMap.chatPageProps + '.chatSelected', false);
      this.storeSet(storeMap.activeChatID, null);
      return response.response;
    } catch (e) {
      this.statusHandler(e.status);
    }
    return null;
  }

  private async _getUnread(chatID: number) {
    try {
      const response = await chatsAPI.getNewMessagesCount(chatID);
      return response.response;
    } catch (e) {
      this.statusHandler(e.status);
    }
    return null;
  }

  public async chatSelectHandler(chatID: number) {
    const chatToken = await this._getChatToken(chatID);
    const userID = this.storeGet(storeMap.currentUserID);

    this.storeRewrite(storeMap.activeChatFeed, []);
    this.storeSet(storeMap.activeChatID, chatID);
    this.storeSet(storeMap.chatPageProps + '.activeChatID', true);
    this._socket.open(`/chats/${userID}/${chatID}/${chatToken}`);
  }

  public async sendMessage(text: string) {
    const message = JSON.stringify({
      type: 'message',
      content: text,
    });

    this._socket.send(message);
  }

  private _requestOldMessages(offset = 0) {
    this._socket.send(JSON.stringify({
      content: offset,
      type: 'get old',
    }));
  }

  private _socketOpenedHandler() {
    this._requestOldMessages();
  }

  private _parseMessage(message: any, userID: number) {
    const time = splitTimestamp(message.time).hhmm;

    return {
      text: message.content,
      attachmentType: false,
      attachmentSource: false,
      datetime: message.time,
      time: time,
      isOwner: message.user_id === userID,
      isRead: true,
    };
  }

  private async _getUserIdByLogin(data: UserSearchData) {
    try {
      const userData = await usersAPI.searchByLogin(data);
      const user = userData.response.filter((user: { [key: string]: any }) => user.login === data.login);
      if (!user.length) {
        alert(`Пользователь ${data.login} не найден`);
        return null;
      }
      return user[0].id;
    } catch (e) {
      this.statusHandler(e.status);
    }
    return null;
  }

  public pageUnmountHandler() {
    this._socket.close();
    this.storeSet(storeMap.activeChatID, null);
    this.storeSet(storeMap.chatPageProps + '.chatSelected', false);
    this.storeRewrite(storeMap.activeChatFeed, []);
    this.storeRewrite(storeMap.chatPageProps, null);
  }

  private async _getChatToken(chatID: number) {
    try {
      const response = await chatsAPI.getToken(chatID);
      return response.response['token'];
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  public async pageMountHandler() {
    try {
      const response = await authAPI.getUserInfo();
      this.storeSet(storeMap.currentUserID, response.response['id']);
    } catch (e) {
      return;
    }
    await this.updateChatList();
  }

  public async updateChatList(data?: QueryOptions) {
    const chats = await this.getChats(data);
    if (!chats) {
      return;
    }

    for (const chat of chats) {
      if (chat.avatar === null) {
        chat.avatar = SETTINGS.avatarDummy;
      }

      const lastMessage = chat.last_message;

      if (lastMessage) {
        if (lastMessage.content.length > 25) {
          chat.last = lastMessage.content.slice(0, 25) + '...';
        } else {
          chat.last = lastMessage.content;
        }
        chat.time = splitTimestamp(lastMessage.time).hhmm;
      } else {
        chat.last = '';
        chat.time = '';
      }

      const unread = await this._getUnread(chat.id);

      if (unread) {
        chat.unreads = unread.unread_count;
      } else {
        chat.unreads = 0;
      }
    }

    this.storeRewrite(storeMap.chatPageProps, { chats: chats });
  }

  public async addUser(data: UserSearchData) {
    const userId = await this._getUserIdByLogin(data);
    const chatId = this.storeGet(storeMap.activeChatID) as number;
    try {
      const response = await chatsAPI.addUser({
        users: [userId],
        chatId: chatId,
      });
      await this.updateChatList();
      await this.getUsers(chatId);
      this.storeSet(storeMap.chatPageProps + '.chatSelected', true);
      return response.response;
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  public async removeUser(data: UserSearchData) {
    const userId = await this._getUserIdByLogin(data);
    const chatId = this.storeGet(storeMap.activeChatID);
    try {
      await chatsAPI.deleteUser({ users: [userId], chatId: chatId });
      await this.updateChatList();
      await this.getUsers(chatId);
      this.storeSet(storeMap.chatPageProps + '.chatSelected', true);
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  async getUsers(chatId: number) {
    try {
      const response = await chatsAPI.getUsers(chatId);

      const props = this.storeGet(storeMap.chatPageProps) as any;

      props.chatUsers = [];

      response.response.map((user: ChatUsers) => {
        if (user.avatar === null) {
          user.avatar = SETTINGS.avatarDummy;
        } else {
          user.avatar = `${SETTINGS.baseURL}/resources${user.avatar}`;
        }

        props.chatUsers.push({
          avatar: user.avatar,
          login: user.login,
        });
      });

      this.storeRewrite(storeMap.chatPageProps, props);
    } catch (e) {
      this.statusHandler(e.status);
    }
  }

  private _socketMessageHandler(event: MessageEvent) {
    const userID = this.storeGet(storeMap.currentUserID);
    let messagesData = JSON.parse(event.data);

    if (messagesData.type === 'user connected') {
      return;
    }

    const props = this.storeGet(storeMap.chatPageProps) as PlainObject;

    if (!Array.isArray(messagesData)) {
      messagesData = [messagesData];
    }

    messagesData.reduceRight((messageList: unknown[], message: PlainObject) => {
      const parsedMessage = this._parseMessage(message, userID as number);
      messageList.unshift(parsedMessage);
      return messageList;
    }, props.feed);

    this.storeRewrite(storeMap.chatPageProps, props);
  }
}

const chatsController = new ChatsController();
export default chatsController;
