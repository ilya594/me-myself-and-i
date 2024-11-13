import * as Events from "./Events";    
import MotionDetector from "../motion/MotionDetector";
import Controls from "../view/Controls";
import {
    SOUND_PLAY_TIME
} from './Constants';

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

        console.log('[Viewer] Sounds.initialize. context here.')
        const loadAudio = (url: string) => {
            return new Promise((resolve, reject) => {
              const request = new XMLHttpRequest();
              request.open("GET", url, true);
              request.responseType = "arraybuffer";
              request.onload = () => resolve(request.response);
              request.onerror = (e) => reject(e);
              request.send();
            });
          }

        const buildAudio = async () => {
            source.buffer = await context.decodeAudioData(blob.slice(0));
            source.connect(context.destination);
            return source;
        }

        let source: any = null;
        let audio: any = null;  
        let blob: any = await loadAudio("./images/les-podervanskij-kazka-pro-repku_(mufm.me).mp3");
      
        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, async () => {
            if (this._timeout) return console.log('[Sounds] Motion detect handler. Sound not played cuz of timeout');
            this._timeout = setTimeout(() => this._timeout = clearTimeout(this._timeout), SOUND_PLAY_TIME * 1111);
            source = context.createBufferSource();
            audio = await buildAudio();
            if (!audio?.buffer) return console.log('[Sounds] Motion detect handler. Sound not played because of no audio buffer');
            const duration: number = SOUND_PLAY_TIME * 4;
            const start: number = Math.random() * (audio.buffer.duration - Number(duration));  
            audio.start(0, start, duration);
        });
    }

    public adjustVolume = (value: number) => {
        this._volume = value;
        Controls.adjustVolume(value);
    }
  
}

export default new Sounds();