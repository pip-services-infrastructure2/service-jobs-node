"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const JobsServiceFactory_1 = require("../build/JobsServiceFactory");
class JobsProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super('jobs', 'Jobs orchestration microservice');
        this._factories.add(new JobsServiceFactory_1.JobsServiceFactory());
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory());
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory());
    }
}
exports.JobsProcess = JobsProcess;
//# sourceMappingURL=JobsProcess.js.map