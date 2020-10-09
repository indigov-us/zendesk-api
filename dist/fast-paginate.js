"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = __importDefault(require("p-queue"));
const defaultConcurrency = 5;
exports.default = ({ api, concurrency, onPage, startPage, }) => async (path, init) => {
    const concurrencyWithFallback = concurrency || defaultConcurrency;
    const pQueue = new p_queue_1.default({ concurrency: concurrencyWithFallback });
    let keepLooping = true;
    let page = startPage || 1;
    while (keepLooping) {
        for (const [i] of Array.from(Array(concurrencyWithFallback)).entries()) {
            // don't allow the queue size to explode
            while (pQueue.size >= 100)
                await new Promise((resolve) => setTimeout(resolve, 1000));
            // make sure to cache the value of page outside of the async worker function
            const currentPage = page + i;
            pQueue.add(async () => {
                if (!keepLooping)
                    return;
                const pathWithPage = path.includes('?') ? `${path}&page=${currentPage}` : `${path}?page=${currentPage}`;
                const res = await api(pathWithPage, init);
                // return false in onPage to stop looping
                keepLooping = await onPage(res);
            });
        }
        page += concurrencyWithFallback;
    }
    await pQueue.onIdle();
};
