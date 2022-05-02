import { ConfigParams } from 'pip-services3-commons-nodex';

import { JobsMemoryPersistence } from '../../src/persistence/JobsMemoryPersistence';
import { JobsPersistenceFixture } from './JobsPersistenceFixture';

suite('JobsMemoryPersistence', () => {
    let persistence: JobsMemoryPersistence;
    let fixture: JobsPersistenceFixture;

    setup(async () => {
        persistence = new JobsMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new JobsPersistenceFixture(persistence);

        await persistence.open(null);
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