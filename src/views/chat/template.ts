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
        <div class="chat__content grid grid-column">
            <div class="chat__header grid">
                <div class="chat__user-thumb">
                    <img class="user__photo-img" src={{chat.photo}}>
                </div>
                <div class="chat__user-name grid grid-column grid-middle">{{chat.name}}</div>
                <div class="chat__user-option grid grid-column grid-middle">
                    <svg width="3" height="16" viewBox="0 0 3 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="1.5" cy="2" r="1.5" fill="white"></circle><circle cx="1.5" cy="8" r="1.5" fill="white"></circle><circle cx="1.5" cy="14" r="1.5" fill="white"></circle></svg>
                    <div class="chat__user-option-dropdown">
                        <div class="dropdown">
                            <ul class="dropdown__list">
                                <li class="dropdown__item upload-media">
                                    <img src="/images/option-1.svg">Добавить пользователя
                                </li>
                                <li class="dropdown__item upload-file">
                                    <img src="/images/option-2.svg">Удалить пользователя
                                </li>
                                <li class="dropdown__item share-location">
                                    <img src="/images/option-3.svg">Удалить чат
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat__body grid grid-column">
                {{#each chat.feed}}
                    <p class="chat__message
                        {{#if attachmentType}}
                            chat__message_type_other
                        {{else}}
                            chat__message_type_text
                        {{/if}}
                        
                        {{#if isOwner}}
                            chat__message_owner
                            {{#if isRead}}
                                chat__message_status_viewed
                            {{/if}}
                        {{/if}}
                    ">
                        {{text}}
                        {{#if attachmentType}}
                            <img src={{attachmentSource}} />
                        {{/if}}    
                        <time class="timestamp user__message-time">{{time}}</time>
                    </p>
                {{/each}}
            </div>
            <div class="chat__footer">
                <form class="chat__form grid">
                    <div class="chat__media">
                        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.68216 9.99564L10.2583 2.4195L11.2011 3.3623L3.62497 10.9384L2.68216 9.99564Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.19622 12.5097L12.7724 4.93353L13.7152 5.87634L6.13902 13.4525L5.19622 12.5097Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5389 17.8523L18.115 10.2762L19.0578 11.219L11.4817 18.7951L10.5389 17.8523Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13.0529 20.3664L20.6291 12.7902L21.5719 13.733L13.9957 21.3092L13.0529 20.3664Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13.053 20.3665C10.4379 22.9816 6.20735 22.991 3.60385 20.3875C1.00036 17.7841 1.00978 13.5535 3.6249 10.9384L2.68209 9.99561C-0.456055 13.1337 -0.467361 18.2104 2.65683 21.3346C5.78103 24.4588 10.8577 24.4475 13.9958 21.3093L13.053 20.3665Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18.115 10.2762L19.0578 11.219C21.4986 8.77819 21.5074 4.8297 19.0774 2.39978C16.6475 -0.0301534 12.699 -0.0213595 10.2583 2.41942L11.2011 3.36223C13.1188 1.44447 16.2212 1.43756 18.1304 3.34679C20.0397 5.25602 20.0327 8.35841 18.115 10.2762Z" fill="#999999"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.19646 12.51C3.45305 14.2534 3.44677 17.0738 5.18243 18.8094C6.91809 20.5451 9.73844 20.5388 11.4819 18.7954L10.539 17.8526C9.31866 19.073 7.34441 19.0774 6.12945 17.8624C4.91448 16.6475 4.91888 14.6732 6.13927 13.4528L5.19646 12.51Z" fill="#999999"></path></svg>
                        <div class="chat__media-dropdown">
                            <div class="dropdown">
                                <ul class="dropdown__list">
                                    <li class="dropdown__item upload-media">
                                        <img src="images/media-1.svg">Фото или Видео
                                    </li>
                                    <li class="dropdown__item upload-file">
                                        <img src="images/media-2.svg">Файл
                                    </li>
                                    <li class="dropdown__item share-location">
                                        <img src="images/media-3.svg">Локация
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="chat__text">
                        <input class="chat__text-input" type="text" name="message" placeholder="Сообщение" required>
                    </div>
                    <button class="chat__send">
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="5.19995" width="11" height="1.6" fill="#161719"></rect><path d="M7 1L11 6L7 11" stroke="#161719" stroke-width="1.6"></path></svg>
                    </button>
                </form>
            </div>
        </div>
    </div>
`;