export const template =`
    <div class="content grid grid-column--reverse grid-middle">
        <div class="box">
            <div class="box__content">
                <h2>Вход</h2>
                <form class="auth-form grid grid-column" action="/index.html">
                    <div class="auth-form__container">
                        {{#each fields}}
                            <div class="auth-form__field">
                                <input class="auth-form__text-input" id={{name}} type={{type}} name={{name}} tabindex={{index}} autocorrect="off" autocapitalize="off" value="War123123;"required>
                                <label class="auth-form__label" for={{name}}>{{title}}</label>
                                <span class="field__error"></span>
                            </div>
                        {{/each}}
                    </div>
                    <div class="auth-form__action">
                        {{> button}}
                    </div>
                    <div class="auth-form__callout">
                        <a class="link link-register">Нет аккаунта?</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

export const data = {
  fields: {
    login: {
      name: 'login',
      type: 'text',
      title: 'Логин',
      index: 1,
    },
    password: {
      name: 'password',
      type: 'password',
      title: 'Пароль',
      index: 2,
    },
  },
};
