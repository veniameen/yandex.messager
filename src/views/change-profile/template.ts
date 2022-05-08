export const template =`
    <div class="grid profile">
        <div class="profile__sidebar">
            <span class="grid grid-column grid-middle profile__backlink">
                <div class="grid grid-column grid-middle profile__backlink-btn">
                    <svg width="13" height="12"
                        viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="5.19995" width="11" height="1.6" fill="#161719"></rect>
                        <path d="M7 1L11 6L7 11" stroke="#161719" stroke-width="1.6"></path>
                    </svg>
                </div>
            </span>
        </div>
        <div class="profile__content">
            <div class="grid grid-column profile__container">
                <div class="profile__photo profile__photo__change">
                    <img src={{avatar}}>
                    <span class="profile__photo-action">Поменять аватар</span>
                </div>
                <div class="profile__fullname">{{first_name}}</div>
                <div class="profile__info">
                    <form class="profile-form">
                        <div class="profile-form__list">
                            {{#each fields}}
                                <div class="profile-form__field">
                                    <label class="profile-form__label" for={{name}}>{{title}}</label>
                                    <input class="profile-form__text-input" id={{name}} name={{name}} type={{type}} value={{value}}>
                                    <span class="field__error"></span>
                                </div>
                            {{/each}}
                        </div>
                        <div class="profile__action">
                            <div class="profile__save">
                                {{> saveButton}}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <section class="modal">
      <form class="form modal-form avatar-form" enctype="multipart/form-data">
        <h1 class="modal__header">Загрузите файл</h1>
        <div class="modal-form__field-container">
          <div class="modal-form__field">
            <div class="field-file">Выбрать файл на компьютере</div>
            <input class="field-file__input" id="avatar" type="file" name="avatar" accept="image/*">
            <span class="field__error"></span>
          </div>
        </div>
        <section class="settings-section modal-btn">
          {{> changeButton}}
        </section>
      </form>
    </section>
`;
export const data = {
  avatar: '',
  first_name: '',
  fields: [
    { name: 'display_name', title: 'Имя в чате', type: 'text', value: '' },
    { name: 'email', title: 'Почта', type: 'text', value: '' },
    { name: 'first_name', title: 'Имя', type: 'text', value: '' },
    { name: 'login', title: 'Логин', type: 'text', value: '' },
    { name: 'phone', title: 'Телефон', type: 'text', value: '' },
    { name: 'second_name', title: 'Фамилия', type: 'text', value: '' },
  ],
};
