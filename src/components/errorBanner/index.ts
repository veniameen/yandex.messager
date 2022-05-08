import { template } from './template';
import Component from '../../modules/Component';

export default class ErrorBanner extends Component {
  constructor(props: any, storePath: string | null = null) {
    super(props, storePath);
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }
}
