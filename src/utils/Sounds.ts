import * as Events from "./Events";    
import MotionDetector from "../motion/MotionDetector";

class Sounds extends Events.EventHandler {

    private _timeouts: Map<string, any> = new Map();

    constructor() {
        super();        

        this._timeouts.set(Events.MOTION_DETECTED, { instance: null, delay: 1000 });
    }

    public initialize = async () => {
        MotionDetector.addEventListener(Events.MOTION_DETECTED, () => {
            const timeout = this._timeouts.get(Events.MOTION_DETECTED);
            if (!timeout.instance) {
                (timeout.instance as any) = setTimeout(() => {
                    clearTimeout(timeout.instance as any);
                }, timeout.delay);
                document.querySelector("audio")?.play();
            }
        });

        return this;
    }

  
}

export default new Sounds();