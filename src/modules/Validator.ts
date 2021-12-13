export default class Validator {
  static CHECKS = {
    LENGTH(min: number, max: number | string = '') {
        return {
          exp: `^.{${min},${max}}$`,
          err: !max ? `Минимальная длина - ${min} символа` : `Длина строки - от ${min} до ${max} символов`
        }
    },
    ALPHABETIC: {
        exp: /^[A-Za-zА-Яа-яё-]*$/,
        err: 'Только буквы'
    },
    ALPHANUMERIC: {
        exp: /^[A-Za-zА-Яа-яё0-9_-]*$/,
        err: 'Недопустимые символы'
    },
    REQUIRED: {
      exp: /^.{1,}$/,
      err: "Не может быть пустым",
    },
    EMAIL: {
      exp: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
      err: "Недопустимый формат email",
    },
    PHONE: {
      exp: /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,
      err: "Недопустимый формат номера",
    },
    PASSWORD_STRENGTH: {
      exp: /(^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,40})/,
      err: "Слишком простой пароль",
    },
  };

  protected readonly _form: HTMLFormElement;
  protected readonly _rules: any;
  protected readonly _inputs: NodeListOf<HTMLInputElement>;

  constructor(form: HTMLFormElement, rules: object) {
    this._form = form;
    this._rules = rules;
    this._inputs = form.querySelectorAll("input");
    this.bindListeners();
  }

  protected bindListeners() {
    this._inputs.forEach((input: HTMLElement) =>
      input.addEventListener("blur", this._validate.bind(this))
    );
    this._inputs.forEach((input: HTMLElement) =>
      input.addEventListener("focus", this._validate.bind(this))
    );
    this._form.addEventListener("submit", this._submitHandler.bind(this));
  }

  protected _validate(event: { target: HTMLInputElement }) {
    const input = event.target;
    if (!this._rules.hasOwnProperty(input.name)) return;

    if (!input.parentNode) return;

    const errorField = input.parentNode.querySelector('.field__error');

    if (!errorField)
        return;

    let err: string | null = null;

    this._rules[input.name].forEach((rule: Record<string, string>) => {
      const regExp = new RegExp(rule.exp);
      if (!regExp.test(input.value)) err = rule.err;
    });

    if (err) {
        errorField.textContent = err;
        errorField.classList.toggle("field__error--show", true);
    } else errorField.classList.toggle("field__error--show", false);
  }

  protected _submitHandler(event: Event) {
    event.preventDefault();
    
    let formData: Object = {};
    
    this._inputs.forEach((input: HTMLInputElement) => {
        formData = {
            ...formData,
            [input.name]: input.value
        };

        const pseudoEvent: any = { target: input };
        this._validate(pseudoEvent);
    });

    console.log(formData);
  }
}
