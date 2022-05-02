import { ProcessContainer } from 'pip-services3-container-nodex';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import { JobsServiceFactory } from '../build/JobsServiceFactory';

export class JobsProcess extends ProcessContainer{
    public constructor(){
        super('jobs', 'Jobs orchestration microservice');

        this._factories.add(new JobsServiceFactory());
        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new DefaultSwaggerFactory());
    }
}