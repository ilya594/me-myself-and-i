import * as Events from "./Events";    
import MotionDetector from "../motion/MotionDetector";

class Sounds extends Events.EventHandler {

    private _timeouts: Map<string, any> = new Map();

    private _container: HTMLAudioElement = null;

    private _restraints: Array<number> = [ 
        0.5, 0.5, 0.5, 0.5, 
        0.5, 0.5, 0.5, 0.5, 
        0.5, 0.0, 0.0, 0.0, 
        0.0, 0.0, 0.0, 0.0, 
        0.0, 0.0, 0.0, 0.0, 
        0.5, 0.5, 0.5, 0.5 
    ];

    constructor() {
        super();              

        this._timeouts.set(Events.MOTION_DETECTED, { instance: null, delay: 1111 });
    }

    public initialize = async () => {

        this._container = document.getElementById("audio-container") as HTMLAudioElement;

        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => {

            const timeout = this._timeouts.get(Events.MOTION_DETECTED);

            if (!timeout.instance) {
                (timeout.instance as any) = setTimeout(() => {
                    clearTimeout(timeout.instance as any);
                }, timeout.delay);

                this._container.currentTime = Math.floor(Math.random() * 333);
                this._container.volume = this._restraints[new Date().getHours()] || 0;
                this._container.play();

                setTimeout(() => {
                    this._container.volume = 0;
                }, 4444);
            }
        });

        return this;
    }

  
}

export default new Sounds();