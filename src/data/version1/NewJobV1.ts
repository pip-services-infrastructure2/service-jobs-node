export class NewJobV1 {
    type: string;
    ref_id: string;
    ttl: number; // time to live job in ms
    params: any;
}