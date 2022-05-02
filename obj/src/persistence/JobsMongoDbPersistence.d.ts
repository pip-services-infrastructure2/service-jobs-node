import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';
import { JobV1 } from '../data/version1/JobV1';
import { IJobsPersistence } from './IJobsPersistence';
export declare class JobsMongoDbPersistence extends IdentifiableMongoDbPersistence<JobV1, string> implements IJobsPersistence {
    constructor();
    private composeFilter;
    startJobById(correlationId: string, id: string, timeout: number): Promise<JobV1>;
    startJobByType(correlationId: string, type: string, timeout: number, maxRetries: number): Promise<JobV1>;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<JobV1>>;
    deleteByFilter(correlationId: string, filter: FilterParams): Promise<void>;
}
