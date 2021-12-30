"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const retry_1 = __importDefault(require("./retry"));
const statusUpdateInterval = 3000;
exports.default = ({ api, onJobStatus, onProgress, retryRateLimitErrors, }) => async (path, init) => {
    // allow for retrying rate limits indefinitely.
    // maxNumAttempts = 1 is the same thing as not retrying at all
    const retryArgs = {
        maxNumAttempts: retryRateLimitErrors ? undefined : 1,
    };
    let jobRes = await (0, retry_1.default)(() => api(path, init), retryArgs);
    let initialProgress = 0;
    while (['queued', 'working'].includes(jobRes.body.job_status.status)) {
        await new Promise((resolve) => setTimeout(resolve, statusUpdateInterval));
        jobRes = await (0, retry_1.default)(() => api(`/job_statuses/${jobRes.body.job_status.id}.json`), retryArgs);
        if (onJobStatus)
            onJobStatus(jobRes.body.job_status);
        const progressDelta = jobRes.body.job_status.progress - initialProgress;
        if (onProgress && progressDelta)
            onProgress(progressDelta);
        initialProgress = jobRes.body.job_status.progress;
    }
    return jobRes;
};
//# sourceMappingURL=job-completion.js.map