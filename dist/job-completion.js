"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusUpdateInterval = 3000;
exports.default = ({ api, onJobStatus, onProgress, }) => async (path, init) => {
    let jobRes = await api(path, init);
    let initialProgress = 0;
    while (['queued', 'working'].includes(jobRes.body.job_status.status)) {
        await new Promise((resolve) => setTimeout(resolve, statusUpdateInterval));
        jobRes = await api(`/job_statuses/${jobRes.body.job_status.id}.json`);
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