import BaseType from './baseType'

export default class Set extends BaseType {
    constructor() {
        super()
        this.type = 'set'
    }

    testType(exp) {
        return exp[1] === '['
    }

    parseType(state) {}
}
