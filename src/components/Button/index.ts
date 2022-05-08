import template from './template';
import Component from '../../modules/Component';

export default class Button extends Component {
  constructor(props: object) {
    super(props);
  }

  compile(context: any) {
    return Handlebars.compile(template)(context);
  }
}
