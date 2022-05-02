import { CommandSet } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';

import { NewJobV1Schema } from '../../src/data/version1/NewJobV1Schema';
import { IJobsController } from '../../src/logic/IJobsController';
import { NewJobV1 } from '../data/version1/NewJobV1';

export class JobsCommandSet extends CommandSet {
    private _controller: IJobsController;

    constructor(controller: IJobsController) {
        super();

        this._controller = controller;

        this.addCommand(this.makeAddJob());
        this.addCommand(this.makeAddUniqJob());
        this.addCommand(this.makeGetJobs());
        this.addCommand(this.makeGetJobById());
        this.addCommand(this.makeStartJobById());
        this.addCommand(this.makeExtendJob());
        this.addCommand(this.makeAbortJob());
        this.addCommand(this.makeCompleteJob());
        this.addCommand(this.makeDeleteJob());
        this.addCommand(this.makeDeleteJobs());
        //this.addCommand(this.makeCleanJobs());
        this.addCommand(this.makeStartJobByType());
    }

    private makeAddJob(): ICommand {
        return new Command(
            'add_job',
            new ObjectSchema(false)
                .withRequiredProperty('new_job', new NewJobV1Schema()),
            async (correlationId: string, args: Parameters) => {
                let newJob: NewJobV1 = args.getAsObject('new_job');
                return await this._controller.addJob(correlationId, newJob);
            }
        );
    }

    private makeAddUniqJob(): ICommand {
        return new Command(
            'add_uniq_job',
            new ObjectSchema(false)
                .withRequiredProperty('new_job', new NewJobV1Schema()),
            async (correlationId: string, args: Parameters) => {
                let newJob: NewJobV1 = args.getAsObject('new_job');
                return await this._controller.addUniqJob(correlationId, newJob);
            }
        );
    }

    private makeGetJobs(): ICommand {
        return new Command(
            'get_jobs',
            new ObjectSchema(false)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            async (correlationId: string, args: Parameters) => {
                let filter = FilterParams.fromValue(args.get('filter'));
                let paging = PagingParams.fromValue(args.get('paging'));
                return await this._controller.getJobs(correlationId, filter, paging);
            }
        );
    }

    private makeGetJobById(): ICommand {
        return new Command(
            'get_job_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let jobId = args.getAsString('job_id');
                return await this._controller.getJobById(correlationId, jobId);
            }
        );
    }

    private makeStartJobById(): ICommand {
        return new Command(
            'start_job_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String)
                .withRequiredProperty('timeout', TypeCode.Integer),
            async (correlationId: string, args: Parameters) => {
                let jobId = args.getAsString('job_id');
                let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
                return await this._controller.startJobById(correlationId, jobId, timeout);
            }
        );
    }

    // Start fist free job by type
    private makeStartJobByType(): ICommand {
        return new Command(
            'start_job_by_type',
            new ObjectSchema(false)
                .withRequiredProperty('type', TypeCode.String)
                .withRequiredProperty('timeout', TypeCode.Integer),
            async (correlationId: string, args: Parameters) => {
                let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
                let type = args.getAsString('type');
                return await this._controller.startJobByType(correlationId, type, timeout);
            }
        );
    }

    private makeExtendJob(): ICommand {
        return new Command(
            'extend_job',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String)
                .withRequiredProperty('timeout', TypeCode.Integer),
            async (correlationId: string, args: Parameters) => {
                let jobId = args.getAsString('job_id');
                let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
                return await this._controller.extendJob(correlationId, jobId, timeout);
            }
        );
    }

    private makeAbortJob(): ICommand {
        return new Command(
            'abort_job',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let jobId = args.getAsString('job_id');
                return await this._controller.abortJob(correlationId, jobId);
            }
        );
    }

    private makeCompleteJob(): ICommand {
        return new Command(
            'complete_job',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let jobId = args.getAsString('job_id');
                return await this._controller.completeJob(correlationId, jobId);
            }
        );
    }

    private makeDeleteJob(): ICommand {
        return new Command(
            'delete_job_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let jobId: string = args.getAsString('job_id');
                return await this._controller.deleteJobById(correlationId, jobId);
            }
        );
    }

    private makeDeleteJobs(): ICommand {
        return new Command(
            'delete_jobs',
            new ObjectSchema(true),
            async (correlationId: string, args: Parameters) => {
                await this._controller.deleteJobs(correlationId);
            }
        );
    }

    // private makeCleanJobs(): ICommand {
    //     return new Command(
    //         'clean_jobs',
    //         new ObjectSchema(true),
    //         (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
    //             this._controller.cleanJobs(correlationId, (err) => {
    //                 callback(err, null);
    //             });
    //         }
    //     );
    // }
}