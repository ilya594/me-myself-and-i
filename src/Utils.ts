import * as moment from "moment";

export function drawCanvasFromVideo(canvas:HTMLCanvasElement, video:any, options:any = { timestamp: true }):HTMLCanvasElement {
    const w:number = canvas.width = video.getBoundingClientRect().width;
    const h:number = canvas.height = video.getBoundingClientRect().height;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, w, h);
    context.drawImage(video, 0, 0, w, h);
    if (options.timestamp) {
        addTimeStamp(canvas);
    }
    if (options.source) {
        addSourceStamp(canvas, options.source);
    }
    return canvas;
};

export function addTimeStamp(canvas:HTMLCanvasElement):HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '20px Courier New';
    context.fillStyle = "green";
    context.fillText(moment().format('DD.MM.YYYY HH:mm:ss.SSS'), 30, 30);
    return canvas;
}

export function addSourceStamp(canvas:HTMLCanvasElement, source:string):HTMLCanvasElement {
    const context = canvas.getContext('2d');
    context.font = '20px Courier New';
    context.fillStyle = "green";
    context.fillText('[source] : ' + source, 25, 50);
    return canvas;
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
        return drawCanvasFromVideo(canvas, this._template);
    }
    public reset = ():void => {
      this._free.push(...this._busy.splice(0));
    }
  }