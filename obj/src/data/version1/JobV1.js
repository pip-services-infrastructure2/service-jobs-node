"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobV1 = void 0;
class JobV1 {
    constructor(newJob) {
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
exports.JobV1 = JobV1;
//# sourceMappingURL=JobV1.js.map