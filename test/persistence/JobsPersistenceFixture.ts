const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { JobV1 } from '../../src/data/version1/JobV1';
import { IJobsPersistence } from '../../src/persistence/IJobsPersistence';

let now = new Date();

const JOB1: JobV1 = {
    id: "Job_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    created: new Date("2019-11-07T17:30:00"),
    started: new Date("2019-11-07T17:30:20"),
    locked_until: new Date("2019-11-07T18:00:20"),
    execute_until: new Date(now.getTime() + 1000 * 60 * 5),
    completed: null,  
    retries: 5
};
const JOB2: JobV1 = {
    id: "Job_t1_1fsd",
    type: "t1",
    ref_id: "obj_1fsd",
    params: null,
    created: new Date("2019-11-07T17:35:00"),
    started: new Date("2019-11-07T17:35:20"),
    locked_until: new Date("2019-11-07T17:50:20"),
    execute_until: new Date(now.getTime() + 1000 * 60 * 10),
    completed: null,  
    retries: 3
};
const JOB3: JobV1 = {
    id: "Job_t2_3fsd",
    type: "t2",
    ref_id: "obj_3fsd",
    params: null,
    created: new Date("2019-11-07T17:40:00"),
    started: new Date("2019-11-07T17:40:20"),
    locked_until: new Date("2019-11-07T17:50:20"),
    execute_until: new Date(now.getTime() + 1000 * 60 * 15),
    completed: null,
    retries: 2
};

export class JobsPersistenceFixture {
    private _persistence: IJobsPersistence;

    public constructor(persistence: IJobsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private async testCreateJobs() {
        // Create the first job
        let job = await this._persistence.create(null, JOB1);

        assert.isObject(job);
        assert.equal(JOB1.id, job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);
        assert.equal(JOB1.created.valueOf(), job.created.valueOf());
        assert.equal(JOB1.started.valueOf(), job.started.valueOf());
        assert.equal(JOB1.locked_until.valueOf(), job.locked_until.valueOf());
        assert.equal(JOB1.retries, job.retries);

        // Create the second job
        job = await this._persistence.create(null, JOB2);

        assert.isObject(job);
        assert.equal(JOB2.id, job.id);
        assert.equal(JOB2.type, job.type);
        assert.equal(JOB2.ref_id, job.ref_id);
        assert.equal(JOB2.created.valueOf(), job.created.valueOf());
        assert.equal(JOB2.started.valueOf(), job.started.valueOf());
        assert.equal(JOB2.locked_until.valueOf(), job.locked_until.valueOf());
        assert.equal(JOB2.retries, job.retries);

        // Create the third job
        job = await this._persistence.create(null, JOB3);

        assert.isObject(job);
        assert.equal(JOB3.id, job.id);
        assert.equal(JOB3.type, job.type);
        assert.equal(JOB3.ref_id, job.ref_id);
        assert.equal(JOB3.created.valueOf(), job.created.valueOf());
        assert.equal(JOB3.started.valueOf(), job.started.valueOf());
        assert.equal(JOB3.locked_until.valueOf(), job.locked_until.valueOf());
        assert.equal(JOB3.retries, job.retries);
    }

    public async testCrudOperations() {
        let job1: JobV1;

        // Create items
        await this.testCreateJobs();

        // Get all jobs
        let page = await this._persistence.getPageByFilter(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        job1 = page.data[0];

        // Update the job
        job1.retries = 4;

        let job = await this._persistence.update(null, job1);

        assert.isObject(job);
        assert.equal(job1.id, job.id);
        assert.equal(4, job.retries);

        // Get job by id
        job = await this._persistence.getOneById(null, job1.id);

        assert.isObject(job);
        assert.equal(job1.id, job.id);

        assert.equal(job1.type, job.type);
        assert.equal(job1.ref_id, job.ref_id);
        assert.equal(job1.created.valueOf(), job.created.valueOf());
        assert.equal(job1.started.valueOf(), job.started.valueOf());
        assert.equal(job1.locked_until.valueOf(), job.locked_until.valueOf());
        assert.equal(job1.retries, job.retries);

        // Delete the job
        job = await this._persistence.deleteById(null, job1.id);

        assert.isObject(job);
        assert.equal(job1.id, job.id);

        // Try to get deleted job
        job = await this._persistence.getOneById(null, job1.id);

        assert.isNull(job || null);

        // Delete all jobs
        await this._persistence.deleteByFilter(null, new FilterParams());

        // Try to get jobs after delete
        page = await this._persistence.getPageByFilter(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 0);
    }

    public async testGetWithFilters() {
        // Create items
        await this.testCreateJobs();

        // Filter by id
        let page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'id', 'Job_t1_0fsd'
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 1);

        // Filter by type
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'type', 't1'
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 2);

        // Filter by retries
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'retries', '2'
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 1);

        // Filter by retries_max
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'min_retries', '0'
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 3);

        // Filter by created
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'created', new Date("2019-11-07T17:40:00")
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 1);

        // Filter by locked_to
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'locked_to', new Date("2019-11-07T18:10:00")
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 3);

        // Filter by execute_from
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'execute_from', new Date(now.getTime() + 1000 * 60 * 8)
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 2);

        // Test updateJobForStart
        let job = await this._persistence.startJobByType(null, 't2', 1000, 6);

        assert.isObject(job);
        assert.equal(JOB3.retries + 1, job.retries);
        assert.isNotNull(job.started.valueOf());
        assert.isNotNull(job.locked_until);
    }
}
