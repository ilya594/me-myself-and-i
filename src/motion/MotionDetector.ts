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
    private _modes = { LAZY: FACE_DETECT_INTERVAL_LAZY, ACTIVE: FACE_DETECT_INTERVAL_ACTIVE };
    private _mode: number = this._modes.LAZY;
    private _label: any;
    private _delay: any;

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

    private onVideoEnterFrame = () => {

        clearTimeout(this._delay);

        this.analyzeVideoFrame();
        
        this.drawVideoToCanvas(true);     
        
        this._delay = setTimeout(() => this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame), 222);
    };

    private drawVideoToCanvas = (clear: boolean) => {
        if (clear) {
            this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'difference';
            this._frame.width = this.w;
            this._frame.height = this.h;            
            this._frame.getContext('2d').clearRect(0, 0, this.w, this.h);
        }   
        this._frame.getContext('2d').drawImage(this._viewport, 0, 0, this.w, this.h); 
    }  

    private analyzeVideoFrame = (dispatch = true): number => {

        const bitmap = this._frame.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, this.w, this.h);

        const rgb = Utils.getRgb(bitmap);

        const hsv = Utils.rbgToHsv(rgb.r, rgb.g, rgb.b);

        const delta = Math.abs(hsv.h);   

        this.trace(delta);            
             
        /*if (delta > MOTION_DETECT_PIXEL_COEF && dispatch) {

            this._mode = this._modes.ACTIVE;

            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);

            setTimeout(() => { this._mode = this._modes.LAZY }, 5000);
        }*/
        return hsv.h;
    }

    private trace = (delta: number) => {
        this._label.textContent = '[m_detect]: ' + ' Δ: [' + delta.toFixed(2) + ']';
    }
}

export default new MotionDetector();