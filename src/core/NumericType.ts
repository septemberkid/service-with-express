import {Platform, Type} from '@mikro-orm/core';

export default class NumericType extends Type<Number, string> {

    convertToJSValue(value: Number | string, _: Platform): Number {
        return parseFloat(String(value))
    }
}