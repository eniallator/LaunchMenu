import BaseType from './baseType'

export default class Set extends BaseType {
    testType(exp) {
        return exp[1] === '['
    }

    parseType(state) {}
}
