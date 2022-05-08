import { assert } from 'chai';
import Component from './Component';
import EventBus from './EventBus';
import Store from './Store';

describe('Component.ts: Инициализация', () => {
  // @ts-ignore
  Component.prototype.compile = () => 'string';

  it('Инициализация по умолчанию (без входных аргументов)', () => {
    const component = new Component();
    // @ts-ignore
    assert.equal(component._meta.tagName, 'div', 'Тег по молчанию: div');
    // @ts-ignore
    assert.equal(typeof component._meta.props, 'object', 'Свойства по умолчанию');
    // @ts-ignore
    assert.equal(component._meta.storePath, null, 'Селектор хранилища по умолчанию: null');
    assert.equal(component.eventBus instanceof EventBus, true, 'Шина событий');
  });

  it('Инициализация с входными аргументами', () => {
    const storePath = 'storePath';
    const store = new Store();
    store.set(storePath, { key: 'value' });

    let component = new Component({ p: 'property' }, null, 'button');
    // @ts-ignore
    assert.equal(component._meta.tagName, 'button', 'Инициализация тега');
    // @ts-ignore
    assert.equal(component._meta.props.p, 'property', 'Инициализация свойств');

    component = new Component({ p: 'property' }, storePath, 'button');
    // @ts-ignore
    assert.equal(component._meta.storePath, storePath, 'Инициализация селектора хранилища');
    assert.equal(component.eventBus instanceof EventBus, true, 'Шина событий');
  });
});

describe('Component.ts: События жизненного цикла', () => {
  it('Обновление свойств', () => {
    const component = new Component({ prop: 'value' });
    // @ts-ignore
    component._parentNode = 'testPath';
    const events: string[] = [];

    component.eventBus.subscribe(Component.EVENTS.UPDATED, (() => events.push('CDU')));
    component.eventBus.subscribe(Component.EVENTS.COMPILED, (() => events.push('CDC')));
    component.setProps({ prop: 'newValue' });

    assert.equal(events[0], 'CDC');
    assert.equal(events[1], 'CDU');
  });

  it('Монтирование в DOM', () => {
    const component = new Component({ prop: 'value' });
    const events: string[] = [];
    const parent = document.querySelector('.app');

    component.eventBus.subscribe(Component.EVENTS.MOUNTED, (() => events.push('CDM')));
    component.eventBus.subscribe(Component.EVENTS.UNMOUNTED, (() => events.push('CDU')));

    if (parent) {
      // @ts-ignore
      component.mount(parent as HTMLElement);
    }

    assert.equal(events.length, 1, 'Счётчик событий: 1');
    assert.equal(events.pop(), 'CDM', 'Тип события: CDM');

    component.unmount();

    assert.equal(events.length, 1, 'Счётчик событий: 1');
    assert.equal(events.pop(), 'CDU', 'Тип события: CDU');
  });
});

describe('Component.ts: Работа с элементом', () => {
  const component = new Component();

  it('Получение элемента', () => {
    const element = component.element;
    assert.equal(element instanceof HTMLElement, true, 'Возвращён DOM-объект');
  });

  it('Скрытие элемента', () => {
    component.show();
    component.hide();
    assert.equal(component.element.style.display, 'none');
  });

  it('Отображение элемента', () => {
    component.hide();
    component.show();
    assert.equal(component.element.style.display, 'block');
  });
});
