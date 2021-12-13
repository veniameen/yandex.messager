export default `
    <div class="content grid grid-column--reverse grid-middle">
        <div class="box">
            <div class="box__content">
                <h2>Регистрация</h2>
                <form class="auth-form grid grid-column" action="/index.html">
                    <div class="auth-form__container">
                        {{#each fields}}
                            <div class="auth-form__field">
                                <input class="auth-form__text-input" id={{name}} type={{type}} name={{name}} autocorrect="off" autocapitalize="off" value="" required>
                                <label class="auth-form__label" for={{name}}>{{title}}</label>
                                <span class="field__error"></span>
                            </div>
                        {{/each}}
                    </div>
                    <div class="auth-form__action">
                        {{> button}}
                    </div>
                    <div class="auth-form__callout">
                        <a class="link" href="login.html">Войти</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;
