export default `
    <div class="chat grid">
        <div class="chat__sidebar">
            <div class="chat__nav">
                <a class="chat__nav-link" href="profile.html">
                    Профиль&nbsp;&nbsp;<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="#999999"></path></svg>
                </a>
                <div class="chat__nav-search">
                    <div class="search-form">
                        <input class="search-form__input" type="text" name="search" placeholder="Поиск">
                    </div>
                </div>
            </div>
            <div class="chat__user-list">
                {{#each chats}}
                    <div class="user">
                        <a class="grid user__link" href="chat.html">
                            <div class="user__photo">
                                <img class="user__photo-img" src={{photo}}>
                            </div>
                            <div class="user__content">
                                <div class="user__name">{{name}}</div>
                                <div class="user__message">{{last_message}}</div>
                            </div>
                            <div class="grid grid-between grid-column user__info">
                                <time class="user__message-time">{{time}}</time>
                                {{#if unreads}}
                                    <div class="grid grid-right">
                                        <span class="user__message-count">{{unreads}}</span>
                                    </div>
                                {{/if}}
                            </div>
                        </a>
                    </div>
                {{/each}}
            </div>
        </div>
        <div class="chat__content">
            <div class="chat__default-message">Выберите чат чтобы отправить сообщение </div>
        </div>
    </div>
`;