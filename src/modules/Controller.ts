import Router from './Router';
import { Routes } from '../index';
import Store from './Store';
import { storeMap, httpErrorCodes } from '../config';
import { ErrorStatus } from '../components/errorBanner/types';

const router = new Router();
const store = new Store();
const errorProps = storeMap.errorPageProps;

type ErrorsDescription = { [key: string]: string } | null;

export default class Controller {
  constructor() {}

  go(path: string) {
    router.go(path);
  }

  back() {
    router.back();
  }

  storeSet(path: string, data: any) {
    store.set(path, data);
  }

  storeGet(path: string) {
    return store.get(path);
  }

  storeDelete(path: string) {
    store.delete(path);
  }

  storeRewrite(path: string, data: unknown) {
    store.rewrite(path, data);
  }

  storeForceEmit(path: string) {
    store.forceEmit(path);
  }

  public statusHandler( status: number, descriptions: ErrorsDescription = null ): boolean {
    if (status < 400) return false;

    let description = '';

    if (descriptions && descriptions.hasOwnProperty(status)) {
      description = descriptions[status];
    } else if (httpErrorCodes.hasOwnProperty(status)) {
      description = httpErrorCodes[status];
    } else {
      description = httpErrorCodes.default;
    }

    const props: ErrorStatus = { type: status, description: description };
    store.set(errorProps, props);
    this.go(Routes.error);
    return true;
  }
}
