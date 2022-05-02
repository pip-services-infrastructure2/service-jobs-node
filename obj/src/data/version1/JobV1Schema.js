"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class JobV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('ref_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('params', null);
        this.withRequiredProperty('created', null);
        this.withOptionalProperty('started', null);
        this.withOptionalProperty('locked_until', null);
        this.withOptionalProperty('execute_until', null);
        this.withOptionalProperty('completed', null);
        this.withRequiredProperty('retries', pip_services3_commons_nodex_2.TypeCode.Integer);
    }
}
exports.JobV1Schema = JobV1Schema;
//# sourceMappingURL=JobV1Schema.js.map