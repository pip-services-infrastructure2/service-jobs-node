import { JsonFilePersister } from 'pip-services3-data-nodex';

import { JobV1 } from '../data/version1/JobV1';
import { JobsMemoryPersistence } from './JobsMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-nodex';

export class JobsFilePersistence extends JobsMemoryPersistence {
    protected _persister: JsonFilePersister<JobV1>;

    constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<JobV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams) {
        super.configure(config);
        this._persister.configure(config);
    }
    
}