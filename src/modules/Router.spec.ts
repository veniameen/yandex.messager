import { assert } from 'chai';
import Router from './Router';
import Route from './Route';
import Component from './Component';

class ComponentLike extends Component {
  constructor(props?: any) {
    super(props);
  }
}

describe('Router.ts: Инициализация', () => {
  it('Синглтон', () => {
    const router1 = new Router();
    const router2 = new Router();
    assert.equal(router1 instanceof Router, true, 'Экземпляр создан');
    assert.equal(router1, router2, 'Возвращён существующий экземпляр');
  });

  it('Пост-инициализация', () => {
    const router = new Router();
    // @ts-ignore
    assert.equal(router._rootSelector, null, 'Экземпляр создан, селектор не проинициализирован');
    new Router('.application');
    // @ts-ignore
    assert.equal(router._rootSelector, '.application', 'Экземпляр проинициализирован');
    new Router('.app');
    // @ts-ignore
    assert.equal(router._rootSelector, '.application', 'Повторная инициализация проигнорирована');
  });
});

describe('Router.ts: Роутинг', () => {
  before(() => {
    const router = new Router('.application');
    router.use('/path', ComponentLike, {});
    router.use('/another/path', ComponentLike, {});
  });

  it('Чейнинг в методе use()', () => {
    const router = new Router();
    const chainLink = router.use('/default/path', ComponentLike, {});
    assert.equal(router, chainLink, 'Возвращается экземпляр роутера');
  });

  it('Метод getRoute()', () => {
    const router = new Router();
    const existedRoute = router.getRoute('/path');
    const undefinedRoute = router.getRoute('/undefined/path');
    assert.equal(existedRoute instanceof Route, true, 'Метод возвращает существующий роут');
    assert.equal(undefinedRoute, undefined, 'Метод возвращает undefined');
  });
});
