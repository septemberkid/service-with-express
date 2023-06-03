import { mapEnumToConst } from '@util/helpers';

export enum ACTION_ENUM {
    ELIGIBLE = 'ELIGIBLE',
    NOT_ELIGIBLE = 'NOT_ELIGIBLE',
}
const ACTION = mapEnumToConst(ACTION_ENUM);
export default ACTION;