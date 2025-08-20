import * as Events from "./Events";    
import MotionDetector from "../motion/MotionDetector";
import Controls from "../view/Controls";
import {
    SOUND_PLAY_TIME, MAYBE
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

    private _youtubes = [
        { url: 'https://www.youtube.com/embed/7wedjXUereU?&autoplay=1&start=', start: 3, length: 3 },
        { url: 'https://www.youtube.com/embed/KySOirxBfsM?&autoplay=1&start=', start: 3, length: 11 },
    ];

    private list: Array<any> = [];

    constructor() {
        super();              
        this._timeouts.set(Events.MOTION_DETECTED, { instance: null, delay: 7777 });
    }

    public initialize = async () => {

        //@ts-ignore
        const context: AudioContext | any = new (window.AudioContext || window.webkitAudioContext)();

        const getAudioList = (url: string) => {
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open("GET", url, true);
              //  request.responseType = "arraybuffer";
                request.onload = () => resolve(request.response);
                request.onerror = (e) => reject(e);
                request.send();
              }); 
        }

        let audios;

        try {
            audios =  JSON.parse(await getAudioList('./audios.json') as string).list;
        } catch (e: any) {
            console.log('[Viewer] Sounds.initialize. error while handling config.');
        }



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

        const buildAudio = async (blob: any) => {
            source.buffer = await context.decodeAudioData(blob.slice(0));
            source.connect(context.destination);
            return source;
        }

        audios.forEach(async (name: string) => {
            this.list.push(await loadAudio("./images/" + name + ".mp3"));
        });

        let source: any = null;
        let audio: any = null;  
      //  let blob: any = await loadAudio("./images/les-podervanskij-kazka-pro-repku_(mufm.me).mp3");
      
        MotionDetector.addEventListener(Events.MOTION_DETECTION_STARTED, async () => {
            //if (this._timeout) return console.log('[Sounds] Motion detect handler. Sound not played cuz of timeout');

            //source = context.createBufferSource();
            //audio = await buildAudio(this.list[Math.floor(Math.random() * this.list.length)]);
           // if (!audio?.buffer) return console.log('[Sounds] Motion detect handler. Sound not played because of no audio buffer');
            //this._timeout = setTimeout(() => this._timeout = clearTimeout(this._timeout), audio.buffer.duration * (Math.exp(Math.PI * Math.PI / Math.E + Math.PI * Math.PI / Math.E + Math.E / Math.PI)));
            //const start: number = Math.random() * (audio.buffer.duration - Number(duration));  
           // audio.start(0, 0, audio.buffer.duration);

           this.playYoutube();
        });
    }

    public playStream = (stream: any): void => {
        console.log('[Sounds] playStream try to remove node for remote stream.');
        try {
            this._container.removeChild(document.getElementById("remote-audio"));
        } catch (e: any) {
            console.log('[Sounds] playStream node doesnt exist. creating instance..');
        }
        const node: any = document.createElement("audio");
        node.id = "remote-audio";
        node.autoplay = true;
        document.getElementById("view-page").appendChild(node);
       // node.src = (URL || webkitURL).createObjectURL(stream);
        node.srcObject = stream;
        
    }

    public playYoutube = () => {

        const container = document.getElementById('player_youtube') as any;
        const item = this._youtubes[Math.floor(Math.random() * this._youtubes.length)];

        container.src = item.url + item.start;
        setTimeout(() => container.src = 0, item.length * 1000);
    }

    public adjustVolume = (value: number) => {
        this._volume = value;
        Controls.adjustVolume(value);
    }
  
}

export default new Sounds();