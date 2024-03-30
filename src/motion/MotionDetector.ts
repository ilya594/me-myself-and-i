import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

export class MotionDetector extends Events.EventHandler {
  
    private _viewport: HTMLVideoElement | any;
    private _container: any;

    private _label: any;
    private _graphic: any;

    private _points: any = {
        size: 100,
        coefs: [0.70, 0.25],
        canvas: null,
    };

    private _values: DeltaValues = new DeltaValues();

    private get _width() { return this._viewport.videoWidth }
    private get _height() { return this._viewport.videoHeight }

    public initialize = async () => {

        this._viewport = document.querySelector("video");   

        this._viewport.addEventListener("resize", (event: Event) => {
            const video: HTMLVideoElement = event.target as HTMLVideoElement;
            if (video.videoWidth === 1280 && video.videoHeight === 720) {
                this.startDetector();
            }
        })
    };

    private startDetector = () => {

        this._container = document.getElementById("view-page");

        this._points.canvas = document.createElement("canvas");// this._container.appendChild(this._points.canvas); 
        
        this._points.canvas.width = this._points.size;
        this._points.canvas.height = this._points.size;
        this._points.canvas.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = "difference";  

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
        this._graphic.style.setProperty('height', '40%');
        this._graphic.style.setProperty('width', '100%');

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    }

    private onVideoEnterFrame = (...args: any) => {  

        this.drawCheckpoints();

        this.analyzeVideoFrame();

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame)
    };

    private drawCheckpoints = () => {

        const size = this._points.size;

        const context = this._points.canvas.getContext("2d", { willReadFrequently: true });
        context.clearRect(0, 0, size, size);
        context.drawImage(this._viewport, this._width * this._points.coefs[0], this._height * this._points.coefs[1], size, size, 0, 0, size, size);  
    }

    private analyzeVideoFrame = (): any => {

        const image: ImageData = this._points.canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, this._points.size, this._points.size);

        const rgb: {r: number, g: number, b: number}  = Utils.getRgb(image);

        const hsv: {h: number, s: number, v: number} = Utils.rbgToHsv(rgb);

        this.analyzeDeltaValues(hsv); 

        this.drawDeltaGraphics(this._values.h, "#27282c", true, - this._graphic.getBoundingClientRect().height / 5);
       // this.drawDeltaGraphics(this._values.s, "#C8C9C7", false, this._graphic.getBoundingClientRect().height / 5);

        this.trace_t(hsv);

        return hsv;
    }

    private analyzeDeltaValues = (value: any) => {
        this._values.add(value);    
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

    private trace_t = ({h, s, v}: any) => {
        this._label.textContent = 'Δ ' +
        '[' + h.toFixed(1) + '] ' + 
        '[' + s.toFixed(1) + '] ' + 
        '[' + v.toFixed(1) + ']';
    }
}

class DeltaValues {

    private _h: DeltaValue = new DeltaValue();
    private _s: DeltaValue = new DeltaValue();
    private _v: DeltaValue = new DeltaValue();

    public get h() {
        return this._h;
    }

    public get s() {
        return this._s;
    }

    public get v() {
        return this._v;
    }

    constructor() {}

    public add = (value: { h: number, s: number, v: number }) => {
        this._h.add(value.h);
        this._s.add(value.s);
        this._v.add(value.v);
    }
}

class DeltaValue {

    private _values: any = {
        deltas: [] = [],
        cached: [] = [],
        average: Number,
    }

    public size: number = 300;//document.querySelector("video").getBoundingClientRect().width; //TODO get rid of this magic const!

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
        if (this._values.cached.length >= this.size) {
            this._values.cached = this._values.cached.slice(1);
        }
    }
}

export default new MotionDetector();