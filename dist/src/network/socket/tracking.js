"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const operators_1 = require("rxjs/operators");
const monet_1 = require("monet");
let activeRequests = immutable_1.Map();
function subscribeWithTracking(clientId, opId, obs) {
    const subscription = obs.pipe(operators_1.finalize(() => {
        remove(clientId, opId);
    }))
        .subscribe();
    const client = activeRequests.get(clientId) || immutable_1.Map();
    activeRequests = activeRequests.set(clientId, client.set(opId, subscription));
}
exports.subscribeWithTracking = subscribeWithTracking;
function remove(clientId, opId) {
    console.debug(`Removing subscription ${clientId} ${opId}`);
    const client = monet_1.Maybe.fromNull(activeRequests.get(clientId));
    client
        .flatMap(_ => monet_1.Maybe.fromNull(_.get(opId)))
        .forEach(_ => _.unsubscribe());
    client.map(_ => _.remove(opId)).forEach(_ => activeRequests = activeRequests.set(clientId, _));
}
function unsubscribleAll(clientId) {
    console.debug(`Removing all subscriptions for client ${clientId}`);
    const requests = activeRequests.get(clientId);
    if (requests) {
        requests.valueSeq().forEach(s => s.unsubscribe());
        activeRequests = activeRequests.delete(clientId);
    }
}
exports.unsubscribleAll = unsubscribleAll;
