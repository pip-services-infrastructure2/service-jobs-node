"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewJobV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class NewJobV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('ref_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('ttl', pip_services3_commons_nodex_2.TypeCode.Integer);
        this.withOptionalProperty('params', null);
    }
}
exports.NewJobV1Schema = NewJobV1Schema;
//# sourceMappingURL=NewJobV1Schema.js.map