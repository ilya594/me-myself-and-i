import * as Events from "./Events";    
import MotionDetector from "../motion/MotionDetector";
import Controls from "../view/Controls";
import {
    SOUND_PLAY_TIME
} from './Constants';
import StreamProvider from "../network/StreamProvider";

class Sounds extends Events.EventHandler {

    private _timeouts: Map<string, any> = new Map();

    private _container: HTMLAudioElement = null;

    private _volume: number = 1.0;

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

        this._container = document.createElement("audio");
        this._container.src = "https://html-peer-viewer.onrender.com/images/yanikovich.mp3";

        this._container.oncanplaythrough = (_) => {
            
            MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => {

                let timeout = this._timeouts.get(Events.MOTION_DETECTED);
    
                if (!timeout.instance) {
                    
                    timeout.instance = setTimeout(() => timeout.instance = clearTimeout(timeout.instance), timeout.delay);
    
                    this._container.volume = this._volume;
                    this._container.currentTime = 0;//Math.floor(Math.random() * 144);
                    this._container.play();
    
                   // setTimeout(() => this._container.pause(), SOUND_PLAY_TIME * 3);
                }
            });
        };



        Controls.addEventListener(Events.VOLUME_ADJUST_SPREAD, (volume: number) => {
            this._volume = volume;
            StreamProvider.adjustVolume(volume);
        });

        return this;
    }

    public adjustVolume = (value: number) => {
        this._volume = value;
        Controls.adjustVolume(value);
    }

  
}

export default new Sounds();