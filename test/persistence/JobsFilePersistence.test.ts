import { ConfigParams } from 'pip-services3-commons-nodex';

import { JobsFilePersistence } from '../../src/persistence/JobsFilePersistence';
import { JobsPersistenceFixture } from './JobsPersistenceFixture';

suite('JobsFilePersistence', () => {
    let persistence: JobsFilePersistence;
    let fixture: JobsPersistenceFixture;

    setup(async () => {
        persistence = new JobsFilePersistence('data/jobs.test.json');
        persistence.configure(new ConfigParams());

        fixture = new JobsPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get with Filters', async () => {
        await fixture.testGetWithFilters();
    });

});