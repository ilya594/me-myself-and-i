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

    private _timeout: any = null;

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

        const audio = new Audio('./images/dobkin.mp3');

        audio.oncanplaythrough = (_) => {            
            MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, () => {
                if (this._timeout) return;
                audio.onseeked = () => {
                    audio.currentTime = Math.round(Math.random() * (333 - 44));
                    console.log('[Sounds] initialize: set current time: [' + audio.currentTime + ']');
                    audio.play();    
                    this._timeout = setTimeout(() => { 
                        audio.pause();
                        this._timeout = clearTimeout(this._timeout);
                    }, SOUND_PLAY_TIME * 3);
                };
            });
        };



        /*Controls.addEventListener(Events.VOLUME_ADJUST_SPREAD, (volume: number) => {
            this._volume = volume;
            StreamProvider.adjustVolume(volume);
        });

        return this;*/
    }

    public adjustVolume = (value: number) => {
        this._volume = value;
        Controls.adjustVolume(value);
    }

  
}

export default new Sounds();