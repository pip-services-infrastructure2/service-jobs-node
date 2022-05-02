import { FilterParams, IOpenable, AnyValueMap } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';

import { JobV1 } from '../../src/data/version1/JobV1';
import { IJobsPersistence } from '../../src/persistence/IJobsPersistence';
import { IJobsController } from './IJobsController';
import { JobsCommandSet } from './JobsCommandSet';
import { NewJobV1 } from '../data/version1/NewJobV1';
import { FixedRateTimer } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';

export class JobsController implements IJobsController, IConfigurable, IReferenceable, ICommandable, IOpenable {
    private _persistence: IJobsPersistence;
    private _commandSet: JobsCommandSet;
    private _opened: boolean = false;
    private _timer: FixedRateTimer = new FixedRateTimer(() => null);
    private _config: ConfigParams;
    private _cleanInterval: number = 1000 * 60 * 5;
    private _maxRetries = 10;
    private _logger: CompositeLogger = new CompositeLogger();

    public constructor() {
    }

    public configure(config: ConfigParams): void {
        this._config = config;
        this._logger.configure(config);
        this._cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this._maxRetries = config.getAsLongWithDefault('options.max_retries', 10);
    }

    public async open(correlationId: string): Promise<void> {
        this._timer.setCallback(() => {
            this.cleanJobs(correlationId);
        });
        if (this._cleanInterval > 0) {
            this._timer.setInterval(this._cleanInterval);
            this._timer.start();
        }
        this._opened = true;
        this._logger.trace(correlationId, "Jobs controller is opened");
    }

    public isOpen(): boolean {
        return this._opened;
    }

    public async close(correlationId: string): Promise<void> {
        if (this._timer.isStarted) {
            this._timer.stop();
        }
        this._opened = false;
        this._logger.trace(correlationId, "Jobs controller is closed");
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IJobsPersistence>(
            new Descriptor('service-jobs', 'persistence', '*', '*', '1.0')
        );
        this._logger.setReferences(references);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new JobsCommandSet(this);
        }
        return this._commandSet;
    }

    // Add new job
    public async addJob(correlationId: string, newJob: NewJobV1): Promise<JobV1> {
        let job = new JobV1(newJob);
        return await this._persistence.create(correlationId, job);
    }

    // Add new job if not exist with same type and ref_id
    public async addUniqJob(correlationId: string, newJob: NewJobV1): Promise<JobV1> {
        let filter = FilterParams.fromTuples(
            'type', newJob.type,
            'ref_id', newJob.ref_id
        );
        let paging = new PagingParams();
        let page = await this._persistence.getPageByFilter(correlationId, filter, paging);
        if (page.data.length > 0) {
            return page.data[0];
        } else {
            let job = new JobV1(newJob);
            return await this._persistence.create(correlationId, job);
        }
    }

    // Get list of all jobs
    public async getJobs(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<JobV1>> {
        return await this._persistence.getPageByFilter(correlationId, filter, paging);
    }

    // Get job by Id
    public async getJobById(correlationId: string, jobId: string): Promise<JobV1> {
        return await this._persistence.getOneById(correlationId, jobId);
    }

    // Start job
    public async startJobById(correlationId: string, jobId: string, timeout: number): Promise<JobV1> {
        return await this._persistence.startJobById(correlationId, jobId, timeout);
    }

    // Start job by type
    public async startJobByType(correlationId: string, jobType: string, timeout: number): Promise<JobV1> {
        return await this._persistence.startJobByType(correlationId, jobType, timeout, this._maxRetries);
    }

    // Extend job execution limit on timeout value
    public async extendJob(correlationId: string, jobId: string, timeout: number): Promise<JobV1> {
        let now = new Date();
        let update = AnyValueMap.fromTuples(
            'locked_until', new Date(now.getTime() + timeout)
        );
        return await this._persistence.updatePartially(correlationId, jobId, update);
    }

    // Abort job
    public async abortJob(correlationId: string, jobId: string): Promise<JobV1> {
        let update = AnyValueMap.fromTuples(
            'started', null,
            'locked_until', null,
        );
        return await this._persistence.updatePartially(correlationId, jobId, update);
    }

    // Complete job
    public async completeJob(correlationId: string, jobId: string): Promise<JobV1> {
        let update = AnyValueMap.fromTuples(
            'started', null,
            'locked_until', null,
            'completed', new Date()
        );
        return await this._persistence.updatePartially(correlationId, jobId, update);
    }

    // Delete job by Id
    public async deleteJobById(correlationId: string, jobId: string): Promise<JobV1> {
        return await this._persistence.deleteById(correlationId, jobId);
    }

    // Remove all jobs
    public async deleteJobs(correlationId: string, callback?: (err: any) => void): Promise<void> {
        await this._persistence.deleteByFilter(correlationId, new FilterParams);
    }

    // Clean completed and expiration jobs
    public async cleanJobs(correlationId: string): Promise<void> {
        let now = new Date();

        this._logger.trace(correlationId, "Starting jobs cleaning...");

        try {
            await this._persistence.deleteByFilter(
                correlationId,
                FilterParams.fromTuples(
                    'min_retries', this._maxRetries
                )
            );

            await this._persistence.deleteByFilter(
                correlationId,
                FilterParams.fromTuples(
                    'execute_to', now
                )
            );

            await this._persistence.deleteByFilter(
                correlationId,
                FilterParams.fromTuples(
                    'completed_to', now
                )
            );
        } catch(err) {
            this._logger.error(correlationId, err, "Failed to clean up jobs.");
        }
        
        this._logger.trace(correlationId, "Jobs cleaning ended.");
    }
}
