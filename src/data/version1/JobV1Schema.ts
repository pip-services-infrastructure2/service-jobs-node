import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';

export class JobV1Schema extends ObjectSchema {
    constructor() {
        super();

        this.withRequiredProperty('id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('ref_id', TypeCode.String);
        this.withOptionalProperty('params', null);

        this.withRequiredProperty('created', null);
        this.withOptionalProperty('started', null);
        this.withOptionalProperty('locked_until', null);
        this.withOptionalProperty('execute_until', null);
        this.withOptionalProperty('completed', null);
        this.withRequiredProperty('retries', TypeCode.Integer);

    }
}