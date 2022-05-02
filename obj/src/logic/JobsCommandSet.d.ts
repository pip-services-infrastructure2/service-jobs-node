import { CommandSet } from 'pip-services3-commons-nodex';
import { IJobsController } from '../../src/logic/IJobsController';
export declare class JobsCommandSet extends CommandSet {
    private _controller;
    constructor(controller: IJobsController);
    private makeAddJob;
    private makeAddUniqJob;
    private makeGetJobs;
    private makeGetJobById;
    private makeStartJobById;
    private makeStartJobByType;
    private makeExtendJob;
    private makeAbortJob;
    private makeCompleteJob;
    private makeDeleteJob;
    private makeDeleteJobs;
}
