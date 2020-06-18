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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = __importDefault(require("p-queue"));
const defaultConcurrency = 5;
exports.default = ({ api, concurrency, onPage, startPage, }) => (path, init) => __awaiter(void 0, void 0, void 0, function* () {
    const concurrencyWithFallback = concurrency || defaultConcurrency;
    const pQueue = new p_queue_1.default({ concurrency: concurrencyWithFallback });
    let keepLooping = true;
    let page = startPage || 1;
    while (keepLooping) {
        for (const [i] of Array.from(Array(concurrencyWithFallback)).entries()) {
            // don't allow the queue size to explode
            while (pQueue.size >= 100)
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            // make sure to cache the value of page outside of the async worker function
            const currentPage = page + i;
            pQueue.add(() => __awaiter(void 0, void 0, void 0, function* () {
                if (!keepLooping)
                    return;
                const pathWithPage = path.includes('?') ? `${path}&page=${currentPage}` : `${path}?page=${currentPage}`;
                const res = yield api(pathWithPage, init);
                // return false in onPage to stop looping
                keepLooping = yield onPage(res);
            }));
        }
        page += concurrencyWithFallback;
    }
    yield pQueue.onIdle();
});
