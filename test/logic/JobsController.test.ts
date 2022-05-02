const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { JobV1 } from '../../src/data/version1/JobV1';
import { JobsMemoryPersistence } from '../../src/persistence/JobsMemoryPersistence';
import { JobsController } from '../../src/logic/JobsController';
import { NewJobV1 } from '../../src/data/version1/NewJobV1';

const JOB1: NewJobV1 = {
    //id: "Job1_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    //timeout: 1000*60*30, // 30 min
    ttl: 1000 * 60 * 60 * 3, // 3 hour
    //retries: 5
};
const JOB2: NewJobV1 = {
    //id: "Job2_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    //timeout: new Date(1000*60*15), // 15 min
    ttl: 1000 * 60 * 60, // 1 hour
    //retries: 3
};
const JOB3: NewJobV1 = {
    //id: "Job3_t2_3fsd",
    type: "t2",
    ref_id: "obj_3fsd",
    params: null,
    //timeout: new Date(1000*60*10), // 10 minutes
    ttl: 1000 * 60 * 30, // 30 minutes
    //retries: 2
};

suite('JobsController', () => {
    let persistence: JobsMemoryPersistence;
    let controller: JobsController;

    setup(async () => {
        persistence = new JobsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new JobsController();
        controller.configure(new ConfigParams());

        let references = References.fromTuples(
            new Descriptor('service-jobs', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-jobs', 'controller', 'default', 'default', '1.0'), controller
        );

        controller.setReferences(references);

        await persistence.open(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('CRUD Operations', async () => {
        let job1: JobV1;

        // Create the first job
        let job = await controller.addJob(null, JOB1);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);
        job1 = job;

        // Create the second job
        job = await controller.addUniqJob(null, JOB2);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);

        // Create the third job
        job = await controller.addJob(null, JOB3);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB3.type, job.type);
        assert.equal(JOB3.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB3.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);

        // Get one job
        job = await controller.getJobById(null, job1.id);

        assert.isObject(job);
        assert.equal(job1.id, job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);
        assert.equal(job1.retries, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);

        // Get all jobs
        let page = await controller.getJobs(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        job1 = page.data[0];

        // Delete the job
        job = await controller.deleteJobById(null, job1.id);

        assert.isObject(job);
        assert.equal(job1.id, job.id);

        // Try to get deleted job
        job = await controller.getJobById(null, job1.id);

        assert.isNull(job);

        // Delete all jobs
        await controller.deleteJobs(null);

        // Try to get jobs after delete
        page = await controller.getJobs(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 0);
    });


    test('Control operations', async () => {
        let job1: JobV1;
        let job2: JobV1;

        // Create the first job
        let job = await controller.addJob(null, JOB1);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);
        job1 = job;

        // Create the second job
        job = await controller.addUniqJob(null, JOB2);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);

        // Create the third job
        job = await controller.addJob(null, JOB3);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB3.type, job.type);
        assert.equal(JOB3.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB3.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);

        // Get one job
        job = await controller.getJobById(null, job1.id);

        assert.isObject(job);
        assert.equal(job1.id, job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);
        assert.equal(job1.retries, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);

        // Get all jobs
        let page = await controller.getJobs(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        job1 = page.data[0];
        job2 = page.data[1];

        // Test start job by id
        job = await controller.startJobByType(null, job1.type, 1000 * 60 * 10);

        assert.isObject(job);
        assert.isNotNull(job.locked_until);
        assert.isNotNull(job.started);
        job1 = job;

        // Test extend job
        let timeout = 1000 * 60 * 5;
        let newExeUntil = new Date(job1.execute_until.valueOf() + timeout);

        job = await controller.extendJob(null, job1.id, timeout);

        assert.isObject(job);

        assert.equal(newExeUntil.getUTCMilliseconds(), job.execute_until.getUTCMilliseconds());
        job1 = job;

        // Test compleate job
        job = await controller.completeJob(null, job1.id);

        assert.isObject(job);
        assert.isNotNull(job.completed);
        job1 = job;

        // Test start job
        timeout = 1000 * 60; // set timeout 1 min
        job = await controller.startJobById(null, job2.id, timeout);

        assert.isObject(job);
        assert.isNotNull(job.locked_until);
        assert.isNotNull(job.started);
        job2 = job;

        // Test abort job
        job = await controller.abortJob(null, job2.id);

        assert.isObject(job);
        assert.isNull(job.locked_until);
        assert.isNull(job.started);
    });

    test('Test clean expired jobs', async () => {
        let job1: JobV1;
        let job2: JobV1;
        let job3: JobV1;

        // Create the first job
        let job = await controller.addJob(null, JOB1);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB1.type, job.type);
        assert.equal(JOB1.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB1.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);
        job1 = job;

        // Create the second job
        job = await controller.addJob(null, JOB2);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB2.type, job.type);
        assert.equal(JOB2.ref_id, job.ref_id);

        assert.equal(0, job.retries);
        assert.equal(JOB2.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);
        job2 = job;

        // Create the third job
        job = await controller.addJob(null, JOB3);

        assert.isObject(job);
        assert.isNotNull(job.id);
        assert.equal(JOB3.type, job.type);
        assert.equal(JOB3.ref_id, job.ref_id);
        assert.equal(0, job.retries);
        assert.equal(JOB3.params, job.params);
        assert.isNotNull(job.created);
        assert.isNotNull(job.execute_until);
        assert.isNull(job.started);
        assert.isNull(job.completed);
        assert.isNull(job.locked_until);
        job3 = job;

        // Get all jobs
        let page = await controller.getJobs(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Test start job by id
        job = await controller.startJobByType(null, job1.type, 1000 * 60 * 10);

        assert.isObject(job);
        assert.isNotNull(job.locked_until);
        assert.isNotNull(job.started);
        job1 = job;

        // Test compleate job
        job = await controller.completeJob(null, job1.id);

        assert.isObject(job);
        assert.isNotNull(job.completed);
        job1 = job;

        // Test clean jobs
        await controller.cleanJobs(null);

        // Get all jobs after clean
        page = await controller.getJobs(null, new FilterParams(), new PagingParams());

        assert.isObject(page);
        assert.lengthOf(page.data, 2);
    });
});