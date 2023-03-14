import moment from "moment";
import * as Events from "./Events";

export function signCanvas(data:Events.DetectionData):HTMLCanvasElement {
    addTimeStamp(data.canvas);  //@ts-ignore
    addSourceStamp(data.canvas, Events.FACE_DETECTED + (data.person.identified ? (',' + Events.FACE_RECOGNIZED) : ''));  //@ts-ignore
    addIdentifierStamp(data.canvas, data.person.name + ', ~' + data.person.age + ' y/o, probably ' + data.person.sex);
    if (data.box) addFaceBox(data.canvas, data.box);
    return data.canvas;
};

export function addFaceBox(canvas:HTMLCanvasElement, box:any):HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "#00ff30";
    context.rect(box.x - 15, box.y - 15, box.width + 30, box.height + 30);
    context.stroke();
    return canvas;
}

export function addTimeStamp(canvas:HTMLCanvasElement):HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '20px Courier New';
    context.fillStyle = "#00ff30";
    context.fillText(moment().format('DD.MM.YYYY HH:mm:ss.SSS'), 30, 30);

    const watermark = document.getElementById("police_watermark") as HTMLCanvasElement;
    context.drawImage(watermark, 966, 0, 100, 100);
    return canvas;
}

export function addSourceStamp(canvas:HTMLCanvasElement, source:string):HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '20px Courier New';
    context.fillStyle = "#00ff30";
    context.fillText('[source] : ' + source, 25, 50);
    return canvas;
}

export function addIdentifierStamp(canvas:HTMLCanvasElement, identifier:string):HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '20px Courier New';
    context.fillStyle = "#00ff30";
    context.fillText('[target] : ' + identifier, 25, 70);
    return canvas;
}

export function rbgToHsv(r:number, g:number, b:number) {
    r /= 255;
    g /= 255;
    b /= 255;
    let maxc = Math.max(r, g, b)
    let minc = Math.min(r, g, b)
    let v = maxc;
    if (minc === maxc) {
        return {h: 0.0, s: 0.0, v: v};
    } 

    let s = (maxc-minc) / maxc
    let rc = (maxc-r) / (maxc-minc)
    let gc = (maxc-g) / (maxc-minc)
    let bc = (maxc-b) / (maxc-minc)
    let h;
    if (r == maxc)
        h = 0.0+bc-gc
    else if (g == maxc)
        h = 2.0+rc-bc
    else h = 4.0+gc-rc;

    h = (h/6.0) % 1.0
    return {h: h * 360, s: s * 100, v: v * 100};
};

export class Logger {

    private static str:any = [];
    private static t:any = null;
    //@ts-ignore
    private static type = async () => { 
        await new Promise(resolve => this.t = setTimeout(resolve, 20));
        document.querySelector("textarea").value += this.str.shift();
        return this.str.length ? await this.type() : false;
    }

    public static log = async (record:string) => {
        if (this.str.length)  {
            clearTimeout(this.t);
            this.str = [this.str.join('')];
            await this.type();
        }
        this.str = ('<' + moment().format('HH:mm:ss.SSS') + '> ' + record).split('');
        this.str.push('\r\n');
        await this.type();        
    }
}



export class Pool {
    private _free:Array<any>;
    private _busy:Array<any>;
    private _template:any;

    constructor(template:any) {
        this._template = template;
        this._free = [this.createNewCanvas()];
        this._busy = [];
    }
    public get = ():HTMLCanvasElement =>  {
        const canvas = this._free.length ? this._free.pop() : this.createNewCanvas();
        return this._busy.push(canvas) && canvas;
    }
    public vex = ():HTMLCanvasElement => {
        return this._busy[this._busy.length - 1];
    }
    public put = (canvas:any):HTMLCanvasElement => {
        this._busy.splice(this._busy.indexOf(canvas), 1);
        return this._free.push(canvas) && canvas;
    }
    private createNewCanvas = ():HTMLCanvasElement => {
        const canvas = document.createElement("canvas");
        const init = canvas.getContext('2d', { willReadFrequently: true });
        return canvas;
    }
    public reset = ():void => {
      this._free.push(...this._busy.splice(0));
    }
  }




  export class Speaker {

    static AUDIO_MOTION_DETECTION:HTMLAudioElement;

    public static initialize = async () => {
        Speaker.AUDIO_MOTION_DETECTION = document.getElementById("motion_detection") as HTMLAudioElement;
    };    

    public static playMotionDetectionSound = (audio = Speaker.AUDIO_MOTION_DETECTION) => {
        audio.volume = 0.3;
        audio.loop = true;
        audio.play();
        setTimeout(() => audio.pause(), 1500);
    }

    public static playOnce = (source: string) => {
        const audio = window.document.querySelector("audio") ||
            window.document.createElement("audio");
        audio.setAttribute("src", source);
        audio.currentTime = 0;
        audio.play();
      }
  }
