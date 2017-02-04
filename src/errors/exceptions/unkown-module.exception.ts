import { RuntimeException } from "./runtime.exception";

export class UnkownModuleException extends RuntimeException {

    constructor() {
        super(`Not recognized module - runtime error!`);
    }

}