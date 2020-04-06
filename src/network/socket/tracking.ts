import {Map} from "immutable";
import {Observable, Subscription} from "rxjs";
import {finalize} from "rxjs/operators";
import {Maybe} from "monet";


let activeRequests = Map<string, Map<string, Subscription>>();

export function subscribeWithTracking(clientId: string, opId: string, obs: Observable<any>) {
    const subscription = obs.pipe(
        finalize(() => {
            remove(clientId, opId)
        })
    )
        .subscribe();

    const client = activeRequests.get(clientId) || Map();
    activeRequests = activeRequests.set(clientId, client.set(opId, subscription))
}

function remove(clientId: string, opId: string) {
    console.debug(`Removing subscription ${clientId} ${opId}`);

    const client = Maybe.fromNull(activeRequests.get(clientId));

    client
        .flatMap(_ => Maybe.fromNull(_.get(opId)))
        .forEach(_ => _.unsubscribe());

    client.map(_ => _.remove(opId)).forEach(_ => activeRequests = activeRequests.set(clientId, _))
}

export function unsubscribleAll(clientId: string) {
    console.debug(`Removing all subscriptions for client ${clientId}`);

    const requests = activeRequests.get(clientId);
    if (requests) {
        requests.valueSeq().forEach(s => s.unsubscribe());
        activeRequests = activeRequests.delete(clientId)
    }
}
