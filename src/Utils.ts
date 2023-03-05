import * as moment from "moment";
import * as Events from "./Events";


export function signCanvas(data:Events.DetectionData):HTMLCanvasElement {
    addTimeStamp(data.canvas);  //@ts-ignore
    addSourceStamp(data.canvas, Events.FACE_DETECTED + (data.person.identified ? (',' + Events.FACE_RECOGNIZED) : ''));  //@ts-ignore
    addIdentifierStamp(data.canvas, '[' + data.person.name + '] ' + data.person.age + '.' + data.person.sex);
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

export function log(str:string) {
    document.querySelector("textarea").value += '<' + moment().format('HH:mm:ss.SSS') + '> ' + str + '\r\n';
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