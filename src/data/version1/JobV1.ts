import { NewJobV1 } from "./NewJobV1";

export class JobV1 {
    // Job description
    id: string;
    type: string;
    ref_id: string;
    params: any;

    // Job control
    created: Date;
    started: Date;
    locked_until?: Date;
    execute_until?: Date;
    completed: Date;
    retries: number;

    constructor(newJob?: NewJobV1) {
        let now = new Date();
        this.created = now;
        this.retries = 0;
        
        this.completed = null;
        this.started = null;
        this.locked_until = null;
        this.execute_until = null;
        
        if (newJob) {
            this.type = newJob.type;
            this.ref_id = newJob.ref_id;
            this.params = newJob.params;
            if (newJob.ttl != null && newJob.ttl > 0) {
                this.execute_until = new Date(now.getTime() + newJob.ttl);
            }
        }
    }
}