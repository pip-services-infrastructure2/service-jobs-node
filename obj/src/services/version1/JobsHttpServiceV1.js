"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsHttpServiceV1 = void 0;
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class JobsHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/jobs');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-jobs', 'controller', '*', '*', '1.0'));
    }
}
exports.JobsHttpServiceV1 = JobsHttpServiceV1;
//# sourceMappingURL=JobsHttpServiceV1.js.map