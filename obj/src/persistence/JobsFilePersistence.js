"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsFilePersistence = void 0;
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
const JobsMemoryPersistence_1 = require("./JobsMemoryPersistence");
class JobsFilePersistence extends JobsMemoryPersistence_1.JobsMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_nodex_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.JobsFilePersistence = JobsFilePersistence;
//# sourceMappingURL=JobsFilePersistence.js.map