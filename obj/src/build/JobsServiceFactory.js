"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const JobsMemoryPersistence_1 = require("../../src/persistence/JobsMemoryPersistence");
const JobsFilePersistence_1 = require("../../src/persistence/JobsFilePersistence");
const JobsMongoDbPersistence_1 = require("../../src/persistence/JobsMongoDbPersistence");
const JobsController_1 = require("../../src/logic/JobsController");
const JobsCommandableHttpServiceV1_1 = require("../services/version1/JobsCommandableHttpServiceV1");
class JobsServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(JobsServiceFactory.MemoryPersistenceDescriptor, JobsMemoryPersistence_1.JobsMemoryPersistence);
        this.registerAsType(JobsServiceFactory.FilePersistenceDescriptor, JobsFilePersistence_1.JobsFilePersistence);
        this.registerAsType(JobsServiceFactory.MongoDbPersistenceDescriptor, JobsMongoDbPersistence_1.JobsMongoDbPersistence);
        this.registerAsType(JobsServiceFactory.ControllerDescriptor, JobsController_1.JobsController);
        this.registerAsType(JobsServiceFactory.HttpServiceV1Descriptor, JobsCommandableHttpServiceV1_1.JobsCommandableHttpServiceV1);
    }
}
exports.JobsServiceFactory = JobsServiceFactory;
JobsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-jobs', 'persistence', 'memory', '*', '1.0');
JobsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-jobs', 'persistence', 'file', '*', '1.0');
JobsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-jobs', 'persistence', 'mongodb', '*', '1.0');
JobsServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-jobs', 'controller', 'default', '*', '1.0');
JobsServiceFactory.HttpServiceV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-jobs', 'service', 'commandable-http', '*', '1.0');
//# sourceMappingURL=JobsServiceFactory.js.map