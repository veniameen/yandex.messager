export const template = `
    <div class='content grid grid-column--reverse grid-middle'>
        <div class='box'>
            <div class='box__content'>
                <h2>Регистрация</h2>
                <form class='auth-form grid grid-column' action='/index.html'>
                    <div class='auth-form__container'>
                        {{#each fields}}
                            <div class='auth-form__field'>
                                <input class='auth-form__text-input' id={{name}} type={{type}} name={{name}} value={{value}} autocorrect='off' autocapitalize='off' value='' required>
                                <label class='auth-form__label' for={{name}}>{{title}}</label>
                                <span class='field__error'></span>
                            </div>
                        {{/each}}
                    </div>
                    <div class='auth-form__action'>
                        {{> button}}
                    </div>
                    <div class='auth-form__callout'>
                        <a class='link link-signup'>Войти</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

export const data = {
  fields: {
    email: {
      name: 'email',
      type: 'email',
      title: 'Почта',
      value: 'test10000007@mail.ru',
    },
    login: {
      name: 'login',
      type: 'text',
      title: 'Логин',
      value: 'veniamin2',
    },
    first: {
      name: 'first_name',
      type: 'text',
      title: 'Имя',
      value: 'Вениамин',
    },
    second: {
      name: 'second_name',
      type: 'text',
      title: 'Фамилия',
      value: 'Ряднов',
    },
    phone: {
      name: 'phone',
      type: 'tel',
      title: 'Телефон',
      value: '88000000000',
    },
    password: {
      name: 'password',
      type: 'password',
      title: 'Пароль',
      value: 'War123123;',
    },
  },
};
