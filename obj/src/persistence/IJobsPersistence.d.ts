import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { AnyValueMap } from 'pip-services3-commons-nodex';
import { JobV1 } from '../data/version1/JobV1';
export interface IJobsPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<JobV1>>;
    getOneById(correlationId: string, id: string): Promise<JobV1>;
    create(correlationId: string, item: JobV1): Promise<JobV1>;
    update(correlationId: string, item: JobV1): Promise<JobV1>;
    updatePartially(correlationId: string, id: string, values: AnyValueMap): Promise<JobV1>;
    startJobById(correlationId: string, id: string, timeout: number): Promise<JobV1>;
    startJobByType(correlationId: string, type: string, timeout: number, maxRetries: number): Promise<JobV1>;
    deleteById(correlationId: string, id: string): Promise<JobV1>;
    deleteByFilter(correlationId: string, filter: FilterParams): Promise<void>;
}
