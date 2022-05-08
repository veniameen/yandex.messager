import { assert, expect } from 'chai';
import Store from './Store';
import { PlainObject } from '../types';

describe('Store: Grey Box Testing', () => {
  const store = new Store;
  store.enableStrictMode();

  describe('Black Box Tests', () => {
    describe('Инициализация. Singleton', () => {
      it('Повторный вызов конструктора. Ожидается: сущности идентичны', () => {
        assert.strictEqual(new Store(), new Store());
      });
    });

    describe('Методы set(path, data) и get(path)', () => {
      beforeEach(() => {
        store.flush();
      });

      it('Запись/чтение примитива по несуществующему пути', () => {
        store.set('a.b.c', 123);
        assert.strictEqual(store.get('a.b.c'), 123);
      });

      it('Запись/чтение объекта по несуществующему пути', () => {
        store.set('a.b.c', { d: 123, e: 456 });
        assert.strictEqual(store.get('a.b.c.d'), 123);
        assert.strictEqual(store.get('a.b.c.e'), 456);
      });

      it('Запись/чтение объекта по существующему пути', () => {
        store.set('a.b.c', { d: 123, e: 456 });
        store.set('a.b.c', { f: 789 });
        assert.strictEqual(store.get('a.b.c.d'), 123);
        assert.strictEqual(store.get('a.b.c.e'), 456);
        assert.strictEqual(store.get('a.b.c.f'), 789);
      });
    });

    describe('Метод rewrite(path)', () => {
      beforeEach(() => {
        store.flush();
        store.set('a.b.c', { d: 123, e: 456 });
      });

      it('Перезапись объекта по несуществующему пути', () => {
        store.rewrite('a.b.c.f', { g: 789 });
        assert.strictEqual(store.get('a.b.c.d'), 123);
        assert.strictEqual(store.get('a.b.c.e'), 456);
        assert.strictEqual(store.get('a.b.c.f.g'), 789);
      });

      it('Перезапись объекта по существующему пути', () => {
        store.rewrite('a.b.c.d', { f: 789 });
        assert.strictEqual(store.get('a.b.c.d.f'), 789);
        assert.strictEqual(store.get('a.b.c.e'), 456);
      });
    });

    describe('Метод delete(path)', () => {
      beforeEach(() => {
        store.flush();
      });

      it('Удаление объекта по несуществующему пути. Ожидается исключение', () => {
        store.set('a.b.c', { d: 123, e: 456 });
        expect(() => store.delete('a.b.c.f.g')).to.throw(`${store.constructor.name}: Key 'f' of path 'a.b.c.f' doesn't exist in store`);
      });

      it('Удаление объекта по существующему пути', () => {
        store.set('a.b.c', { d: 123, e: 456 });
        let data = store.get('a.b.c') as PlainObject;

        expect(data.hasOwnProperty('d')).to.be.true;
        expect(data.hasOwnProperty('e')).to.be.true;

        store.delete('a.b.c.e');
        data = store.get('a.b.c') as PlainObject;

        expect(data.hasOwnProperty('d')).to.be.true;
        expect(data.hasOwnProperty('e')).to.be.false;
      });
    });
  });

  describe('White Box Tests', () => {
    const dummyContent = {
      key1: {
        key2: 'value',
        key3: {
          internal1: 'test',
          internal2: { key: 123 },
          internal3: ['test'],
        },
      },
    };

    describe('Метод set(path, data) и get(path)', () => {
      const data = { key: 'test' };
      const path = 'a.b.c';

      beforeEach(() => {
        // @ts-ignore
        store._store = dummyContent;
      });

      it('В хранилище помещается глубокая копия', () => {
        store.set(path, data);
        // @ts-ignore
        assert.strictEqual(store._store.a.b.c.key, data.key);
        // @ts-ignore
        assert.notStrictEqual(store._store.a.b.c, data);
      });

      it('Из хранилища возвращается глубокая копия', () => {
        store.set(path, data);
        const copy = store.get(path);
        // @ts-ignore
        assert.strictEqual(store._store.a.b.c.key, data.key);
        // @ts-ignore
        assert.notStrictEqual(store._store.a.b.c, copy);
      });
    });

    describe('Метод _getByPathOrRaiseError(path)', () => {
      function getByPathOrRaiseError(path: string) {
        // @ts-ignore
        return store._getByPathOrRaiseError(path);
      }

      beforeEach(() => {
        // @ts-ignore
        store._store = dummyContent;
      });

      it('Получение значения по существующему ключу. Значение - примитив', () => {
        assert.strictEqual(getByPathOrRaiseError('key1.key3.internal1'), 'test');
      });

      it('Получение значения по существующему ключу. Значение - объект', () => {
        assert.strictEqual(getByPathOrRaiseError('key1.key3.internal2'), dummyContent.key1.key3.internal2);
        assert.strictEqual(getByPathOrRaiseError('key1.key3.internal3'), dummyContent.key1.key3.internal3);
      });

      it('Выброс исключения при получении значения по несуществующему пути', () => {
        expect(() => getByPathOrRaiseError('non.existed.path')).to.throw(`${store.constructor.name}: Key 'non' of path 'non.existed.path' doesn't exist in store`);
      });
    });

    describe('Метод flush()', () => {
      it('Очистка хранилища', () => {
        // @ts-ignore
        store._store = dummyContent;
        // @ts-ignore
        assert.strictEqual(store._store, dummyContent);
        store.flush();
        // @ts-ignore
        assert.strictEqual(Object.keys(store._store).length, 0);
      });
    });
  });
});
