import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { JobsMemoryPersistence } from '../../src/persistence/JobsMemoryPersistence';
import { JobsFilePersistence } from '../../src/persistence/JobsFilePersistence';
import { JobsMongoDbPersistence } from '../../src/persistence/JobsMongoDbPersistence';
import { JobsController } from '../../src/logic/JobsController';
import { JobsHttpServiceV1 } from '../../src/services/version1/JobsHttpServiceV1';

export class JobsServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('service-jobs', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('service-jobs', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('service-jobs', 'persistence', 'mongodb', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('service-jobs', 'controller', 'default', '*', '1.0');
    public static HttpServiceV1Descriptor = new Descriptor('service-jobs', 'service', 'http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(JobsServiceFactory.MemoryPersistenceDescriptor, JobsMemoryPersistence);
        this.registerAsType(JobsServiceFactory.FilePersistenceDescriptor, JobsFilePersistence);
        this.registerAsType(JobsServiceFactory.MongoDbPersistenceDescriptor, JobsMongoDbPersistence);
        this.registerAsType(JobsServiceFactory.ControllerDescriptor, JobsController);
        this.registerAsType(JobsServiceFactory.HttpServiceV1Descriptor, JobsHttpServiceV1);
    }
}