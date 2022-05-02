import { ConfigParams } from 'pip-services3-commons-nodex';

import { JobsMongoDbPersistence } from '../../src/persistence/JobsMongoDbPersistence';
import { JobsPersistenceFixture } from './JobsPersistenceFixture';

suite('JobsMongoDbPersistence', () => {
    let persistence: JobsMongoDbPersistence;
    let fixture: JobsPersistenceFixture;

    let mongoUri = process.env['MONGO_SERVICE_URI'];
    let mongoHost = process.env['MONGO_SERVICE_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_SERVICE_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_SERVICE_DB'] || 'test';

    // Exit if mongo connection is not set
    if (mongoUri == '' && mongoHost == '')
        return;

    setup(async () => {
        persistence = new JobsMongoDbPersistence();
        persistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDatabase
        ));

        fixture = new JobsPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await persistence.close(null, );
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get with Filters', async () => {
        await fixture.testGetWithFilters();
    });

});
