import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
    private _stan?: Stan;

    get stan() {
        if (!this._stan) {
            throw new Error("Cannot access NATS client before connecting");
        }

        return this._stan;
    };

    connect(clusterID: string, clientID: string, url: string) {
        this._stan = nats.connect(clusterID, clientID, {
            url
        });

        return new Promise<void>((resolve, reject) => {
            this.stan.on("connect", () => {
                console.log("Connected to NATS");
                resolve();
            });

            // if error
            this.stan.on("error", (err) => {
                reject(err);
            })
        });
    }
}

const natsWrapper = new NatsWrapper();
export default natsWrapper;