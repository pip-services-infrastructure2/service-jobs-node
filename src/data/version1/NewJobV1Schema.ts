import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';

export class NewJobV1Schema extends ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('ref_id', TypeCode.String);
        this.withRequiredProperty('ttl', TypeCode.Integer);
        this.withOptionalProperty('params', null);
    }
}