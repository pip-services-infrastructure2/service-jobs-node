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
exports.JobsCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
const NewJobV1Schema_1 = require("../../src/data/version1/NewJobV1Schema");
class JobsCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeAddJob());
        this.addCommand(this.makeAddUniqJob());
        this.addCommand(this.makeGetJobs());
        this.addCommand(this.makeGetJobById());
        this.addCommand(this.makeStartJobById());
        this.addCommand(this.makeExtendJob());
        this.addCommand(this.makeAbortJob());
        this.addCommand(this.makeCompleteJob());
        this.addCommand(this.makeDeleteJob());
        this.addCommand(this.makeDeleteJobs());
        //this.addCommand(this.makeCleanJobs());
        this.addCommand(this.makeStartJobByType());
    }
    makeAddJob() {
        return new pip_services3_commons_nodex_4.Command('add_job', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('new_job', new NewJobV1Schema_1.NewJobV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let newJob = args.getAsObject('new_job');
            return yield this._controller.addJob(correlationId, newJob);
        }));
    }
    makeAddUniqJob() {
        return new pip_services3_commons_nodex_4.Command('add_uniq_job', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('new_job', new NewJobV1Schema_1.NewJobV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let newJob = args.getAsObject('new_job');
            return yield this._controller.addUniqJob(correlationId, newJob);
        }));
    }
    makeGetJobs() {
        return new pip_services3_commons_nodex_4.Command('get_jobs', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_6.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_7.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_2.FilterParams.fromValue(args.get('filter'));
            let paging = pip_services3_commons_nodex_3.PagingParams.fromValue(args.get('paging'));
            return yield this._controller.getJobs(correlationId, filter, paging);
        }));
    }
    makeGetJobById() {
        return new pip_services3_commons_nodex_4.Command('get_job_by_id', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let jobId = args.getAsString('job_id');
            return yield this._controller.getJobById(correlationId, jobId);
        }));
    }
    makeStartJobById() {
        return new pip_services3_commons_nodex_4.Command('start_job_by_id', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_nodex_8.TypeCode.String)
            .withRequiredProperty('timeout', pip_services3_commons_nodex_8.TypeCode.Integer), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let jobId = args.getAsString('job_id');
            let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
            return yield this._controller.startJobById(correlationId, jobId, timeout);
        }));
    }
    // Start fist free job by type
    makeStartJobByType() {
        return new pip_services3_commons_nodex_4.Command('start_job_by_type', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('type', pip_services3_commons_nodex_8.TypeCode.String)
            .withRequiredProperty('timeout', pip_services3_commons_nodex_8.TypeCode.Integer), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
            let type = args.getAsString('type');
            return yield this._controller.startJobByType(correlationId, type, timeout);
        }));
    }
    makeExtendJob() {
        return new pip_services3_commons_nodex_4.Command('extend_job', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_nodex_8.TypeCode.String)
            .withRequiredProperty('timeout', pip_services3_commons_nodex_8.TypeCode.Integer), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let jobId = args.getAsString('job_id');
            let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
            return yield this._controller.extendJob(correlationId, jobId, timeout);
        }));
    }
    makeAbortJob() {
        return new pip_services3_commons_nodex_4.Command('abort_job', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let jobId = args.getAsString('job_id');
            return yield this._controller.abortJob(correlationId, jobId);
        }));
    }
    makeCompleteJob() {
        return new pip_services3_commons_nodex_4.Command('complete_job', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let jobId = args.getAsString('job_id');
            return yield this._controller.completeJob(correlationId, jobId);
        }));
    }
    makeDeleteJob() {
        return new pip_services3_commons_nodex_4.Command('delete_job_by_id', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let jobId = args.getAsString('job_id');
            return yield this._controller.deleteJobById(correlationId, jobId);
        }));
    }
    makeDeleteJobs() {
        return new pip_services3_commons_nodex_4.Command('delete_jobs', new pip_services3_commons_nodex_5.ObjectSchema(true), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            yield this._controller.deleteJobs(correlationId);
        }));
    }
}
exports.JobsCommandSet = JobsCommandSet;
//# sourceMappingURL=JobsCommandSet.js.map