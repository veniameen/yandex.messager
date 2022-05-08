export const template =`
    <div class="grid profile">
        <div class="profile__sidebar">
            <span class="grid grid-column grid-middle profile__backlink">
                <div class="grid grid-column grid-middle profile__backlink-btn">
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="5.19995" width="11" height="1.6" fill="#161719"></rect><path d="M7 1L11 6L7 11" stroke="#161719" stroke-width="1.6"></path></svg>
                </div>
            </span>
        </div>
        <div class="profile__content">
            <div class="grid grid-column profile__container">
                <div class="profile__photo">
                    <img src={{avatar}} alt="Аватар профиля">
                </div>
                <div class="profile__fullname">{{first_name}}</div>
                <div class="profile__info">
                    <div class="profile-form">
                        <div class="profile-form__list">
                            {{#each fields}}
                                <div class="profile-form__field">
                                    <label class="profile-form__label" for={{name}}>{{title}}</label>
                                    <input class="profile-form__text-input" readonly="readonly" id={{name}} name={{name}} type={{type}} value={{value}}>
                                    <span class="field__error"></span>
                                </div>
                            {{/each}}
                        </div>
                    </div>
                </div>
                <div class="profile__action">
                    <ul class="profile__action-list">
                        <li class="profile__action-item">
                            <a class="link edit-profile-link">Изменить данные</a>
                        </li>
                        <li class="profile__action-item">
                            <a class="link edit-password-link">Изменить пароль</a>
                        </li>
                        <li class="profile__action-item">
                            <a class="link link-danger logout-link">Выйти</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
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
