"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const JobV1_1 = require("../../src/data/version1/JobV1");
const JobsCommandSet_1 = require("./JobsCommandSet");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
class JobsController {
    constructor() {
        this._opened = false;
        this._timer = new pip_services3_commons_nodex_4.FixedRateTimer(() => null);
        this._cleanInterval = 1000 * 60 * 5;
        this._maxRetries = 10;
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
    }
    configure(config) {
        this._config = config;
        this._logger.configure(config);
        this._cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this._maxRetries = config.getAsLongWithDefault('options.max_retries', 10);
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.setCallback(() => {
                this.cleanJobs(correlationId);
            });
            if (this._cleanInterval > 0) {
                this._timer.setInterval(this._cleanInterval);
                this._timer.start();
            }
            this._opened = true;
            this._logger.trace(correlationId, "Jobs controller is opened");
        });
    }
    isOpen() {
        return this._opened;
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._timer.isStarted) {
                this._timer.stop();
            }
            this._opened = false;
            this._logger.trace(correlationId, "Jobs controller is closed");
        });
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_nodex_3.Descriptor('service-jobs', 'persistence', '*', '*', '1.0'));
        this._logger.setReferences(references);
    }
    getCommandSet() {
        if (this._commandSet == null) {
            this._commandSet = new JobsCommandSet_1.JobsCommandSet(this);
        }
        return this._commandSet;
    }
    // Add new job
    addJob(correlationId, newJob) {
        return __awaiter(this, void 0, void 0, function* () {
            let job = new JobV1_1.JobV1(newJob);
            return yield this._persistence.create(correlationId, job);
        });
    }
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId, newJob) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_1.FilterParams.fromTuples('type', newJob.type, 'ref_id', newJob.ref_id);
            let paging = new pip_services3_commons_nodex_2.PagingParams();
            let page = yield this._persistence.getPageByFilter(correlationId, filter, paging);
            if (page.data.length > 0) {
                return page.data[0];
            }
            else {
                let job = new JobV1_1.JobV1(newJob);
                return yield this._persistence.create(correlationId, job);
            }
        });
    }
    // Get list of all jobs
    getJobs(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    // Get job by Id
    getJobById(correlationId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getOneById(correlationId, jobId);
        });
    }
    // Start job
    startJobById(correlationId, jobId, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.startJobById(correlationId, jobId, timeout);
        });
    }
    // Start job by type
    startJobByType(correlationId, jobType, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.startJobByType(correlationId, jobType, timeout, this._maxRetries);
        });
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, jobId, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let update = pip_services3_commons_nodex_1.AnyValueMap.fromTuples('locked_until', new Date(now.getTime() + timeout));
            return yield this._persistence.updatePartially(correlationId, jobId, update);
        });
    }
    // Abort job
    abortJob(correlationId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let update = pip_services3_commons_nodex_1.AnyValueMap.fromTuples('started', null, 'locked_until', null);
            return yield this._persistence.updatePartially(correlationId, jobId, update);
        });
    }
    // Complete job
    completeJob(correlationId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let update = pip_services3_commons_nodex_1.AnyValueMap.fromTuples('started', null, 'locked_until', null, 'completed', new Date());
            return yield this._persistence.updatePartially(correlationId, jobId, update);
        });
    }
    // Delete job by Id
    deleteJobById(correlationId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.deleteById(correlationId, jobId);
        });
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._persistence.deleteByFilter(correlationId, new pip_services3_commons_nodex_1.FilterParams);
        });
    }
    // Clean completed and expiration jobs
    cleanJobs(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            this._logger.trace(correlationId, "Starting jobs cleaning...");
            try {
                yield this._persistence.deleteByFilter(correlationId, pip_services3_commons_nodex_1.FilterParams.fromTuples('min_retries', this._maxRetries));
                yield this._persistence.deleteByFilter(correlationId, pip_services3_commons_nodex_1.FilterParams.fromTuples('execute_to', now));
                yield this._persistence.deleteByFilter(correlationId, pip_services3_commons_nodex_1.FilterParams.fromTuples('completed_to', now));
            }
            catch (err) {
                this._logger.error(correlationId, err, "Failed to clean up jobs.");
            }
            this._logger.trace(correlationId, "Jobs cleaning ended.");
        });
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map