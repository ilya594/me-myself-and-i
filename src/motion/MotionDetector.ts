import Console from "../utils/Console";
import { MOTION_DETECT_CHECKPOINT_SIZE, MOTION_DETECT_DELAY, MOTION_DETECT_HEAP_SIZE, MOTION_DETECT_PIXEL_COEF } from "../utils/Constants";
import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

export class MotionDetector extends Events.EventHandler {
  
    private _viewport: HTMLVideoElement | any;
    private _container: any;

    private _label: any;
    private _graphic: any;

    private _showTrace: Boolean = false;

    private _points: any = {
        size: MOTION_DETECT_CHECKPOINT_SIZE,
        coefs: [0.66, 0.33],
        canvas: null,
        context: function() {
            return this.canvas.getContext('2d', { willReadFrequently: true });
        }
    };

    private _values: DeltaValues = new DeltaValues();

    private get _width() { return this._viewport.videoWidth }
    private get _height() { return this._viewport.videoHeight }

    public initialize = async () => {

        this._viewport = document.querySelector("video");   

        this.startDetector();
        
        this.dispatchEvent(Events.STREAM_BALANCED, null);

        /*this._viewport.onresize = () => {
            if (this._width === 1280 && this._height === 720) {
                this._viewport.onresize = null;
                this.startDetector();
                this.dispatchEvent(Events.STREAM_BALANCED, null);
            }
        };*/
    };

    private startDetector = async () => {

        this._container = document.getElementById("view-page");

        this._points.canvas = document.createElement("canvas"); //this._container.appendChild(this._points.canvas); 
        
        this._points.canvas.width = this._points.size;
        this._points.canvas.height = this._points.size;
        this._points.context().globalCompositeOperation = "difference";  

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
        this._graphic.style.setProperty('height', '50%');
        this._graphic.style.setProperty('width', '100%');

        Console.addEventListener(Events.CHANGE_TRACE_VISIBILITY, () => { 
            const map = { 'true': 'inline', 'false': 'none'};
            this._showTrace = !this._showTrace; 
            //@ts-ignore
            this._graphic.style.setProperty('display', String(map[String(this._showTrace)]));
            //@ts-ignore
            this._label.style.setProperty('display', String(map[String(this._showTrace)]));
        });

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    }

    private onVideoEnterFrame = (...args: any) => {  

        this.drawCheckpoints();

        this.analyzeVideoFrame();
    };

    private drawCheckpoints = () => {

        const size = this._points.size;

        const context = this._points.context();

        context.clearRect(0, 0, size, size);

        context.drawImage(
            this._viewport, 
            this._width * this._points.coefs[0], 
            this._height * this._points.coefs[1], 
            size, size, 0, 0, size, size
        );  
    }

    private analyzeVideoFrame = (): any => {

        const image: ImageData = this._points.context().getImageData(0, 0, this._points.size, this._points.size);

        const rgb: {r: number, g: number, b: number}  = Utils.getRgb(image);

        const hsv: {h: number, s: number, v: number} = Utils.rbgToHsv(rgb);

        this.analyzeDeltaValues(hsv); 

        if (this._showTrace) {
            this.trace(hsv);
        }

        return hsv;
    }

    private analyzeDeltaValues = (value: any) => {

        const current: number = value.h;
        const previous: number = this._values.hue.last;
        const average: number = this._values.hue.average;

        let timeout: number = 0;

        if (
            Math.abs(current - average) > MOTION_DETECT_PIXEL_COEF && 
            Math.abs(previous - average) > MOTION_DETECT_PIXEL_COEF
        ) {
            timeout = MOTION_DETECT_DELAY;
            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);
        }

        this._values.add(value);

        setTimeout(() => this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame), timeout);
    }

    private trace = ({h, s, v}: any) => {     
        
        this.drawDeltaGraphics(this._values.hue, "#00ff00", true, -100);

        this._label.textContent = 
        '[' + this._values.hue.average.toFixed(1) + ' Δ ' +  h.toFixed(1) + '] ' +
        '[' + s.toFixed(1) + '] ' + 
        '[' + v.toFixed(1) + ']';  
    }

    private drawDeltaGraphics = (values: any, color: string, clear: boolean = false, adjust: number = 0) => {

       const ctx = this._graphic.getContext('2d', { willReadFrequently: true });

       clear && ctx.clearRect(0, 0, this._width, this._height);

       ctx.lineWidth = 1;
       ctx.strokeStyle = color;

       ctx.beginPath();

        for (let i = 1; i < values.cached.length; i++) {
            ctx.moveTo(i - 1, values.cached[i - 1] + adjust);
            ctx.lineTo(i, values.cached[i] + adjust);
            ctx.stroke();
        }
       ctx.closePath();        
    }
}

class DeltaValues {

    private _h: DeltaValue = new DeltaValue();
    private _s: DeltaValue = new DeltaValue();
    private _v: DeltaValue = new DeltaValue();

    public get hue() { return this._h; }

    public get saturation() { return this._s; }

    public get brightness() { return this._v; }

    public add = (value: { h: number, s: number, v: number }) => {
        this._h.add(value.h);
        this._s.add(value.s);
        this._v.add(value.v);
    }
}

class DeltaValue {

    private _values: any = {
        cached: [] = [],
        average: Number,
    }

    public size: number = MOTION_DETECT_HEAP_SIZE;

    public get average(): number {
        return this._values.average;
    }

    public get cached(): any {
        return this._values.cached;
    }

    public get length(): number {
        return this._values.cached.length;
    }

    public get last(): number {
        return this.cached.length ? 
            this.cached[this.cached.length - 1] : undefined;
    }

    public add = (value: any): void => {
        this._values.cached.push(value);
        this.updateCached();
        this.updateAverage();
    }

    private updateAverage = (): void => {
        this._values.average = this._values.cached.length ? this._values.cached.reduce(
            (previous: number, current: number) => previous + current) / this._values.cached.length : 0;
    }

    private updateCached = (): void => {
        if (this._values.cached.length > this.size) {
            this._values.cached.shift();
        }
    }
}

export default new MotionDetector();