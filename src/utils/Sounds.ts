import * as Events from "./Events";    
import MotionDetector from "../motion/MotionDetector";
import Controls from "../view/Controls";
import StreamProvider from "../network/StreamProvider";

class Sounds extends Events.EventHandler {

    private _timeouts: Map<string, any> = new Map();

    private _container: HTMLAudioElement = null;

    private _volume: number = 1;

    private _restraints: Array<number> = [ 
        0.5, 0.5, 0.5, 0.5, 
        0.5, 0.5, 0.5, 0.5, 
        0.5, 1.0, 1.0, 1.0, 
        1.0, 1.0, 1.0, 1.0, 
        1.0, 1.0, 1.0, 1.0, 
        0.5, 0.5, 0.5, 0.5 
    ];

    constructor() {
        super();              

        this._timeouts.set(Events.MOTION_DETECTED, { instance: null, delay: 7777 });
    }

    public initialize = async () => {

        this._container = document.getElementById("audio-container") as HTMLAudioElement;

        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => {

            const timeout = this._timeouts.get(Events.MOTION_DETECTED);

            if (!timeout.instance) {
                (timeout.instance as any) = setTimeout(() => {
                    timeout.instance = clearTimeout(timeout.instance as any);
                }, timeout.delay);

                this._container.currentTime = Math.floor(Math.random() * 333);
                this._container.volume = this._volume;//this._restraints[Number(new Date().getHours())];
                this._container.play();

                setTimeout(() => {
                    this._container.volume = 0;
                }, 4444);
            }
        });

        Controls.addEventListener(Events.VOLUME_ADJUST_SPREAD, (volume: number) => {
            this._volume = volume;
            StreamProvider.adjustVolume(volume);
        });

        return this;
    }

  
}

export default new Sounds();