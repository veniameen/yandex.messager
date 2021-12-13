export default `
    <div class="grid profile">
        <div class="profile__sidebar"><a class="grid grid-column grid-middle profile__backlink" href="profile.html">
                <div class="grid grid-column grid-middle profile__backlink-btn"><svg width="13" height="12"
                        viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="5.19995" width="11" height="1.6" fill="#161719"></rect>
                        <path d="M7 1L11 6L7 11" stroke="#161719" stroke-width="1.6"></path>
                    </svg></div>
            </a></div>
        <div class="profile__content">
            <div class="grid grid-column profile__container">
                <div class="profile__photo">
                    <img src={{photo}}>
                    <span class="profile__photo-action">Поменять аватар</span>
                </div>
                <div class="profile__info">
                    <form class="profile-form">
                        <div class="profile-form__list">
                            {{#each fields}}
                                <div class="profile-form__field">
                                    <label class="profile-form__label" for={{name}}>{{title}}</label>
                                    <input class="profile-form__text-input" id={{name}} name={{name}} type={{type}} value={{value}} required>
                                    <span class="field__error"></span>
                                </div>
                            {{/each}}
                        </div>
                        <div class="profile__action">
                            <div class="profile__save">
                                {{> button}}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;
