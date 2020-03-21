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
const statusUpdateInterval = 3000;
exports.default = ({ api, onProgress }) => (path, init) => __awaiter(void 0, void 0, void 0, function* () {
    let jobRes = yield api(path, init);
    let initialProgress = 0;
    while (['queued', 'working'].includes(jobRes.body.job_status.status)) {
        yield new Promise(resolve => setTimeout(resolve, statusUpdateInterval));
        jobRes = yield api(`/job_statuses/${jobRes.body.job_status.id}.json`);
        const progressDelta = jobRes.body.job_status.progress - initialProgress;
        if (onProgress && progressDelta)
            onProgress(progressDelta);
        initialProgress = jobRes.body.job_status.progress;
    }
    return jobRes;
});
