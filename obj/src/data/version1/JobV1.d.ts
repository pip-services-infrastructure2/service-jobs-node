import { NewJobV1 } from "./NewJobV1";
export declare class JobV1 {
    id: string;
    type: string;
    ref_id: string;
    params: any;
    created: Date;
    started: Date;
    locked_until?: Date;
    execute_until?: Date;
    completed: Date;
    retries: number;
    constructor(newJob?: NewJobV1);
}
