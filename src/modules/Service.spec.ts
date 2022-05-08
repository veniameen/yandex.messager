// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiAsPromised from 'chai-as-promised';
import { HTTPTransport } from './Service';
import { SETTINGS } from '../config';

chai.use(chaiAsPromised);
chai.should();

const http = new HTTPTransport(SETTINGS.baseURL);

describe('GET /auth/user', () => {
  it('Проверка запроса', () => {
    const promise = http.request( '/auth/user', { method: 'GET' });
    // @ts-ignore
    promise.should.eventually.be.fulfilled;
  });
});
