import { template } from './template';
import Component from '../../modules/Component';
import { chatNameValidationRules, loginValidationRules, storeMap, chatIDValidationRules } from '../../config';
import controller from './controller';
import { Routes } from '../../index';
import Button from '../../components/Button/index';
import Validator from '../../modules/Validator';
import xssEscape from '../../utils/xssEscape';

const newChatValidator = new Validator(chatNameValidationRules);
const addUserValidator = new Validator(loginValidationRules);
const removeUserValidator = new Validator(loginValidationRules);
const removeChatValidator = new Validator(chatIDValidationRules);

newChatValidator.setDataHandler(controller.createChat.bind(controller));
addUserValidator.setDataHandler(controller.addUser.bind(controller));
removeUserValidator.setDataHandler(controller.removeUser.bind(controller));
removeChatValidator.setDataHandler(controller.deleteChat.bind(controller));

export class ChatSelectPage extends Component {
  constructor(props: any) {
    const addChatButton = new Button({ caption: 'Создать чат', type: 'submit', classList: ['add-chat-button'] });
    const submitNewChatButton = new Button({ caption: 'Создать', type: 'submit', classList: ['submit-chat-button'] });
    const addUserButton = new Button({ caption: 'Добавить', type: 'submit' });
    const removeUserButton = new Button({ caption: 'Удалить', type: 'submit' });

    const removeChatButton = new Button({ caption: 'Удалить', type: 'submit', classList: ['btn-mb', 'remove-chat-link'] });
    const closeChatModalButton = new Button({ caption: 'Отмена', type: 'submit', classList: ['btn-default', 'remove-chat-close'] });

    if (addChatButton.element) {
      Handlebars.registerPartial('addChatButton', addChatButton.element.innerHTML);
    }
    if (submitNewChatButton.element) {
      Handlebars.registerPartial('submitNewChatButton', submitNewChatButton.element.innerHTML);
    }
    if (addUserButton.element) {
      Handlebars.registerPartial('addUserButton', addUserButton.element.innerHTML);
    }
    if (removeUserButton.element) {
      Handlebars.registerPartial('removeUserButton', removeUserButton.element.innerHTML);
    }
    if (removeChatButton.element) {
      Handlebars.registerPartial('removeChatButton', removeChatButton.element.innerHTML);
    }
    if (closeChatModalButton.element) {
      Handlebars.registerPartial('closeChatModalButton', closeChatModalButton.element.innerHTML);
    }

    Handlebars.registerHelper('activeChat', (value) => {
      const activeChatID = controller.storeGet(storeMap.activeChatID);
      return value === activeChatID;
    });

    super(props, storeMap.chatPageProps);
    this.element.addEventListener('click', (e) => this.clickHandler(e));
  }

  beforeCompile() {
    newChatValidator.detach();
    addUserValidator.detach();
    removeUserValidator.detach();
    removeChatValidator.detach();
  }

  async beforeMount() {
    await controller.pageMountHandler();
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }

  afterCompile() {
    if (this.element) {
      newChatValidator.attach(this.element, '.new-chat-form');
      addUserValidator.attach(this.element, '.add-user-form');
      removeUserValidator.attach(this.element, '.remove-user-form');
      removeChatValidator.attach(this.element, '.remove-chat-form');
    }
  }

  afterUnmount() {
    controller.pageUnmountHandler();
  }

  clickHandler(event: Event) {
    const target = event.target as HTMLElement;
    const chatListItem = target.closest('.user');

    if (chatListItem) {
      this.chatSelectHandler(chatListItem as HTMLElement);
      return;
    };

    if (target.closest('.go-profile-link')) {
      controller.go(Routes.profile);
      return;
    };

    if (target.closest('.add-chat-button')) {
      this._showModal('.new-chat-modal');
      return;
    }

    if (target.classList.contains('modal')) {
      this._hideCurrentModal(target);
      return;
    }

    if (target.classList.contains('add-user-link')) {
      this._hideModal('.modal');
      this._showModal('.add-user-modal');
      return;
    }

    if (target.classList.contains('remove-user-link')) {
      this._hideModal('.modal');
      this._showModal('.remove-user-modal');
      return;
    }

    if (target.classList.contains('remove-chat-modal-link')) {
      const getIdChat = controller.storeGet(storeMap.activeChatID);
      const setModalInput = this.element.querySelector('.remove-chat-modal input');

      if (setModalInput) (setModalInput as HTMLInputElement).value = getIdChat;
      this._hideModal('.modal');
      this._showModal('.remove-chat-modal');
    }

    if (target.classList.contains('remove-chat-close')) {
      event.preventDefault();
      this._hideModal('.modal');
    }

    if (target.classList.contains('chat__user-option')) {
      const chatMenu = this.element.querySelector('.chat__user-option-dropdown');
      if (chatMenu) chatMenu.classList.toggle('chat__user-option-dropdown-active');
    }

    if (target.classList.contains('chat__media')) {
      const chatMedia = this.element.querySelector('.chat__media-dropdown');
      if (chatMedia) chatMedia.classList.toggle('chat__media-dropdown-active');
    }

    if (target.classList.contains('chat__send')) {
      event.preventDefault();
      this._sendMessage();
    }

    if (!target.classList.contains('dropdown__list') && !target.classList.contains('chat__media') && !target.classList.contains('chat__user-option')) {
      const dropdown = this.element.querySelector('.chat__user-option-dropdown');
      const chatMedia = this.element.querySelector('.chat__media-dropdown');
      if (chatMedia) chatMedia.classList.remove('chat__media-dropdown-active');
      if (dropdown) dropdown.classList.remove('chat__user-option-dropdown-active');
    }
  }

  private async chatSelectHandler(chatListItem: HTMLElement) {
    if (chatListItem.classList.contains('user__active')) return;

    const chatID = chatListItem.dataset.id;

    if (!chatID) {
      throw new Error(`${this.constructor.name}: Chat-list item chatID not defined`);
    }

    await controller.chatSelectHandler(parseInt(chatID));
    await controller.getUsers(parseInt(chatID));

    controller.storeSet(storeMap.chatPageProps + '.chatSelected', true);
  }

  private _hideCurrentModal(target: Element) {
    target.classList.remove('modal_active');
  }

  private _showModal(selector: string) {
    const modal = this.element.querySelector(selector);
    if (modal) modal.classList.add('modal_active');
  }

  private _hideModal(selector: string) {
    const modal = this.element.querySelectorAll(selector);

    if (modal) {
      modal.forEach((item) => item.classList.remove('modal_active'));
    }
  }

  private _sendMessage() {
    const messageInput = this.element.querySelector('.chat__text-input') as HTMLInputElement;
    const message = messageInput?.value;

    if (!message) {
      return;
    }

    messageInput.value = '';
    controller.sendMessage(xssEscape(message));
  }
}
