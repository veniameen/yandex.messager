import { Block } from "../../modules/Block.js";
import template from "./template.js";

export default class Button extends Block {
    constructor(props: object) {
        super('button', props);
    }

    render() {
        return template;
    }
}