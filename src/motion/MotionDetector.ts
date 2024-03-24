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


    private _values: Array<number> = [];
    private _deltas: Array<number> = [];
    private _average: number = undefined;

    private get w() { return this._viewport.getBoundingClientRect().width; }
    private get h() { return this._viewport.getBoundingClientRect().height; }


    public initialize = async () => {

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
   
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);

        return true;
    };

    private onVideoEnterFrame = (...args: any) => {  

        this.drawVideoToCanvas(); 

        this.analyzeVideoFrame();

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame)
    };

    private drawVideoToCanvas = () => {
        this._frame.getContext('2d', { willReadFrequently: true }).drawImage(this._viewport, 0, 0, this.w, this.h);       
    }

    private clearVideoCanvas = () => {
        this._frame.width = this.w;
        this._frame.height = this.h;  
        this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'exclusion';
        this._frame.getContext('2d', { willReadFrequently: true }).clearRect(0, 0, this.w, this.h); 
    }

    private analyzeVideoFrame = (): number => {

        const bitmap = this._frame.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, this.w, this.h);

        const rgb = Utils.getRgb(bitmap);

        const hsv = Utils.rbgToHsv(rgb.r, rgb.g, rgb.b);

        const delta = Math.abs(hsv.h);   

        this.analyzeDeltaValues(delta); 

        this.clearVideoCanvas();

        return hsv.h;
    }

    private analyzeDeltaValues = (value: number, size: number = 55) => {      

        this._values.push(value);

        this._average = this._values.reduce((prev, curr) => prev + curr) / this._values.length;

        if (this._values.length >= size) {
            this._values = this._values.slice(Math.round(size / 2), -11);
        }

        if (Math.abs(this._average - value) > MOTION_DETECT_PIXEL_COEF) {
            this._deltas.push(value);
        } else {
            if (this._deltas.length >= 11) {
                this._deltas.length = 0;
            }            
        }

        if (this._deltas.length >= 11) {
            const average = this._deltas.reduce((prev, curr) => prev + curr) / this._deltas.length;
            if (Math.abs(this._average - average)) {
                this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);
            }
            this._deltas.length = 0;
        }

        this.trace(value); 
    }

    private trace = (delta: number) => {
        this._label.textContent = '[m_det] ' +
        'Δ=[' + delta.toFixed(1) + '] ' + 
        'm=[' + this._average.toFixed(1) + '] ';
    }
}

export default new MotionDetector();