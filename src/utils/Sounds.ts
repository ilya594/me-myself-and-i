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

        //@ts-ignore
        const context: AudioContext | any = new (window.AudioContext || window.webkitAudioContext)();

        const fetchAudio = (url: string) => {
            return new Promise((resolve, reject) => {
              const request = new XMLHttpRequest();
              request.open("GET", url, true);
              request.responseType = "arraybuffer";
              request.onload = () => resolve(request.response);
              request.onerror = (e) => reject(e);
              request.send();
            });
          }

        const setAudio = async () => {
            source.buffer = await context.decodeAudioData(blob.slice(0));
            source.connect(context.destination);
            return source;
        }

        let source: any = null;
        let audio: any = null;  
        let blob: any = await fetchAudio("./images/dobkin.mp3");
      
        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, async () => {
            if (this._timeout) return;
            source = context.createBufferSource();
            audio = await setAudio();
            const duration: number = SOUND_PLAY_TIME;
            const start: number = Math.random() * (audio.buffer.duration - Number(duration));  
            audio.start(0, start, duration);
            this._timeout = setTimeout(() => this._timeout = clearTimeout(this._timeout), duration * 1111);
        });
    }

    public adjustVolume = (value: number) => {
        this._volume = value;
        Controls.adjustVolume(value);
    }
  
}

export default new Sounds();