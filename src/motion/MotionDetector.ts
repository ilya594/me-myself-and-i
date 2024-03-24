import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_PIXEL_COEF,
    MOTION_DETECT_DELAY,
    //VIDEO_WIDTH,
    //VIDEO_HEIGHT, 
    FACE_DETECT_INTERVAL_LAZY,
    FACE_DETECT_INTERVAL_ACTIVE} from "../utils/Constants";
import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

export class MotionDetector extends Events.EventHandler {

    private _frame: HTMLCanvasElement | any;
    private _viewport: HTMLVideoElement | any;
    private _container: any;

    private _label: any;
    private _graphic: any;

    private _values: DeltaValues;

    private get _w() { return this._viewport.getBoundingClientRect().width; }
    private get _h() { return this._viewport.getBoundingClientRect().height; }
    private get _ctx() { return this._frame.getContext('2d', { willReadFrequently: true })}


    public initialize = async () => {

        this._values = new DeltaValues();

        this._container = document.getElementById("view-page");

        this._viewport = document.querySelector("video");     

        this._frame = document.createElement("canvas");        

        this._label = document.createElement("label"); this._container.appendChild(this._label);       
        this._label.style.setProperty('position', 'absolute');
        this._label.style.setProperty('top', '3%');
        this._label.style.setProperty('left', '3%');
        this._label.style.setProperty('font-size', '34px');
        this._label.style.setProperty('font-family', 'Courier New');
        this._label.style.setProperty('font-weight', 'bold');
        this._label.style.setProperty('color', '#00ff30');

        this._graphic = document.createElement("canvas"); this._container.appendChild(this._graphic);
        this._graphic.style.setProperty('position', 'absolute');
        this._graphic.style.setProperty('bottom', '0%');
        this._graphic.style.setProperty('left', '0%');
        this._graphic.style.setProperty('width', '100%');
        this._graphic.style.setProperty('height', '30%');
   
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);

        return true;
    };

    private onVideoEnterFrame = (...args: any) => {  

        this.drawVideoToCanvas(); 

        this.analyzeVideoFrame();

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame)
    };

    private drawVideoToCanvas = () => {
        this._ctx.drawImage(this._viewport, 0, 0, this._w, this._h);       
    }

    private clearVideoCanvas = () => {
        this._frame.width = this._w;
        this._frame.height = this._h;  
        this._ctx.globalCompositeOperation = 'difference';
        this._ctx.clearRect(0, 0, this._w, this._h); 
    }

    private analyzeVideoFrame = (): number => {

        const image: ImageData = this._ctx.getImageData(0, 0, this._w, this._h);

        const rgb: {r: number, g: number, b: number}  = Utils.getRgb(image);

        const hsv: {h: number, s: number, v: number} = Utils.rbgToHsv(rgb);

        
        const delta_h = Math.abs(hsv.h);
        const delta_s = Math.abs(hsv.s);
        const delta_v = Math.abs(hsv.v);


        this.analyzeDeltaValues(delta_h); 

        this.drawDeltaGraphics();

        this.clearVideoCanvas();

        this.trace_t(hsv);

        return hsv.h;
    }

    private analyzeDeltaValues = (value: number) => {     

        this._values.add(value);    
    }

    private drawDeltaGraphics = () => {

       const ctx = this._graphic.getContext('2d', { willReadFrequently: true });

       const values = this._values.cached;

       ctx.clearRect(0, 0, this._w, this._h);

       ctx.lineWidth = 1;
       ctx.strokeStyle = "white";

       ctx.beginPath();

        for (let i = 1; i < values.length; i++) {

            ctx.moveTo(i - 1, values[i - 1] - 50);
            ctx.lineTo(i, values[i] - 50);
            ctx.stroke();
        }

       ctx.closePath();



        
    }

    private trace_t = ({h, s, v}: any) => {
        this._label.textContent = 'Δ ' +
        '[' + h.toFixed(1) + '] ' + 
        '[' + s.toFixed(1) + '] ' + 
        '[' + v.toFixed(1) + ']';
    }
}

class DeltaValues {

    private _values: any = {
        deltas: [] = [],
        cached: [] = [],
        average: Number,
    }

    public size: number = 300;//document.querySelector("video").getBoundingClientRect().width;

    constructor() {

    }

    public get average(): number {
        return this._values.average;
    }

    public get cached(): any {
        return this._values.cached;
    }

    public get length(): number {
        return this._values.cached.length;
    }

    public add = (value: number): void => {
        this._values.cached.push(value);
        this.updateCached();
        this.calculateAverage();
    }

    private calculateAverage = (): void => {
        this._values.average = this._values.cached.length ? this._values.cached.reduce(
            (previous: number, current: number) => previous + current) / this._values.cached.length : 0;
    }

    private updateCached = (): void => {
        if (this._values.cached.length >= this.size) {
            this._values.cached = this._values.cached.slice(1);
        }
    }
}

export default new MotionDetector();