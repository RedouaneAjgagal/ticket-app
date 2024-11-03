import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
    private _stan?: Stan;

    connect(clusterID: string, clientID: string, url: string) {
        this._stan = nats.connect(clusterID, clientID, {
            url
        });

        return new Promise<void>((resolve, reject) => {
            this._stan!.on("connect", () => {
                console.log("Connected to NATS");
                resolve();
            });

            // if error
            this._stan!.on("error", (err) => {
                reject(err);
            })
        });
    }
}

const natsWrapper = new NatsWrapper();
export default natsWrapper;