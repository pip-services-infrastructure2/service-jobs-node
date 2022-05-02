import { JsonFilePersister } from 'pip-services3-data-nodex';
import { JobV1 } from '../data/version1/JobV1';
import { JobsMemoryPersistence } from './JobsMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-nodex';
export declare class JobsFilePersistence extends JobsMemoryPersistence {
    protected _persister: JsonFilePersister<JobV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
