import { CommandableHttpService } from 'pip-services3-rpc-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

export class JobsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/jobs');
        this._dependencyResolver.put('controller', new Descriptor('service-jobs', 'controller', '*', '*', '1.0'));
    }
}