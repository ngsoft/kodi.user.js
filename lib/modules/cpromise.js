/**
 * cpromise.js
 * @require https://unpkg.com/browse/uuid@8.3.2/dist/umd/uuid.min.js
 */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'cpromise', deps = ['utils'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils){

    "use strict";

    const {uniqid} = utils;

    class ConcurrentPromiseQueue {
        constructor(options){
            this.maxNumberOfConcurrentPromises = options.maxNumberOfConcurrentPromises || 1000;
            this.unitOfTimeMillis = options.unitOfTimeMillis || 100;
            this.maxThroughputPerUnitTime = options.maxThroughputPerUnitTime || 1000;
            this.promisesToExecute = [];
            this.promisesBeingExecuted = {};
            this.promiseExecutedCallbacks = {};
            this.promiseCompletedTimesLog = [];
            this.reattemptTimeoutId = null;
        }
        numberOfQueuedPromises(){
            return this.promisesToExecute.length;
        }
        numberOfExecutingPromises(){
            return Object.keys(this.promisesBeingExecuted).length;
        }
        /**
         * The queue takes a function that returns a promise.
         * This function will be called at the point where the promise is going to be executed.
         *
         * @param promiseSupplier - A function that returns a promise.
         */
        addPromise(promiseSupplier){
            // return a promise that will complete when the promise from the promise supplier has been run.
            return new Promise(((resolve, reject) => {
                // add the promise to list of promises to be executed and also register a callback with the same id
                // so that when this promise has been executed, we can call the callback and resolve the promise to return to the caller
                const id = uniqid();
                this.promisesToExecute.push({
                    id,
                    promiseSupplier
                });
                this.promiseExecutedCallbacks[id] = (result) => {
                    if (result.isSuccess) {
                        resolve(result.result);
                    } else {
                        reject(result.error);
                    }
                };
                // call execute to kick off the processing of promises if it hasn't already started.
                this.execute();
            }));
        }
        execute(){
            // check to see if we have anything to execute
            if (this.promisesToExecute.length === 0) {
                return;
            }
            // check to see how many promises have been run in the last unit of time
            const now = new Date();
            const startOfTimeUnit = new Date(now.getTime() - this.unitOfTimeMillis);
            const promisesFinishedInLastUnitTime = this.promiseCompletedTimesLog.filter(time => {
                return time.getTime() >= startOfTimeUnit.getTime();
            });
            const numberOfPromisesFinishedInLastUnitTime = promisesFinishedInLastUnitTime.length;
            const numberOfPromisesBeingExecuted = Object.keys(this.promisesBeingExecuted).length;
            const numberOfPromisesLeftInConcurrencyLimit = this.maxNumberOfConcurrentPromises - numberOfPromisesBeingExecuted;
            const numberOfPromisesLeftInRateLimit = this.maxThroughputPerUnitTime - numberOfPromisesFinishedInLastUnitTime;
            const numberOfPromisesToStart = Math.min(numberOfPromisesLeftInConcurrencyLimit, numberOfPromisesLeftInRateLimit);
            if (numberOfPromisesToStart <= 0) {
                // if we are not starting any more promises, we should check to see if we are going to start more later
                if (!this.reattemptTimeoutId) {
                    // given we are in the situation where no more promises are being started, we need to decide how long to wait
                    const periodToWaitToReattemptPromisesMillis = numberOfPromisesFinishedInLastUnitTime > 0
                            ? now.getTime() - promisesFinishedInLastUnitTime[0].getTime()
                            : this.unitOfTimeMillis;
                    this.reattemptTimeoutId = setTimeout(() => {
                        this.reattemptTimeoutId = null;
                        this.execute();
                    }, periodToWaitToReattemptPromisesMillis);
                }
                return;
            }
            // if we can run more promises, run more promises until we hit the max or run out of promises
            for (let count = 0; count < numberOfPromisesToStart; count++) {
                const nextPromiseToStart = this.promisesToExecute.shift();
                if (!nextPromiseToStart) {
                    return;
                }
                const id = nextPromiseToStart.id;
                const promiseExecutionListener = this.promiseExecutedCallbacks[id];
                if (!promiseExecutionListener) {
                    continue;
                }
                this.promisesBeingExecuted[id] = nextPromiseToStart;
                // run the promise and pass the result back to the callback associated with this promise
                nextPromiseToStart.promiseSupplier()
                        .then(res => {
                            delete this.promiseExecutedCallbacks[id];
                            delete this.promisesBeingExecuted[id];
                            promiseExecutionListener({
                                isSuccess: true,
                                result: res,
                                error: null
                            });
                        })
                        .catch(err => {
                            delete this.promiseExecutedCallbacks[id];
                            delete this.promisesBeingExecuted[id];
                            promiseExecutionListener({
                                isSuccess: false,
                                result: null,
                                error: err
                            });
                        })
                        .finally(() => {
                            // eslint-disable-next-line no-shadow
                            const now = new Date();
                            // eslint-disable-next-line no-shadow
                            const startOfTimeUnit = new Date(now.getTime() - this.unitOfTimeMillis);
                            this.promiseCompletedTimesLog.push(now);
                            this.promiseCompletedTimesLog = this.promiseCompletedTimesLog.filter(time => {
                                return time.getTime() >= startOfTimeUnit.getTime();
                            });
                            this.execute();
                        });
            }
        }
    }
    exports.ConcurrentPromiseQueue = ConcurrentPromiseQueue;

}));

