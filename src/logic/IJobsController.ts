import { FilterParams } from "pip-services3-commons-nodex";
import { PagingParams } from "pip-services3-commons-nodex";
import { DataPage } from "pip-services3-commons-nodex";

import { NewJobV1 } from "../data/version1/NewJobV1";
import { JobV1 } from "../data/version1";

export interface IJobsController {
    // Add new job
    addJob(correlationId: string, newJob: NewJobV1): Promise<JobV1>;
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId: string, newJob: NewJobV1): Promise<JobV1>;
    // Get list of all jobs
    getJobs(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<JobV1>>;
    // Get job by Id
    getJobById(correlationId: string, jobId: string): Promise<JobV1>;
    // Start job
    startJobById(correlationId: string, jobId: string, timeout: number): Promise<JobV1>;
    // Start fist free job by type
    startJobByType(correlationId: string, jobType: string, timeout: number): Promise<JobV1>;
    // Extend job execution limit on timeout value
    extendJob(correlationId: string, jobId: string, timeout: number): Promise<JobV1>;
    // Abort job
    abortJob(correlationId: string, jobId: string): Promise<JobV1>;
    // Compleate job
    completeJob(correlationId: string, jobId: string): Promise<JobV1>;
    // Delete job by Id
    deleteJobById(correlationId: string, jobId: string): Promise<JobV1>;
    // Remove all jobs
    deleteJobs(correlationId: string): Promise<void>;
    // Clean completed and expiration jobs
    cleanJobs(correlationId: string): Promise<void>;
}