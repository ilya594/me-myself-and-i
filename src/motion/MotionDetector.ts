import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_PIXEL_COEF,
    MOTION_DETECT_DELAY,
    VIDEO_WIDTH,
    VIDEO_HEIGHT, 
    FACE_DETECT_INTERVAL_LAZY,
    FACE_DETECT_INTERVAL_ACTIVE} from "../utils/Constants";
import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";


export class MotionDetector extends Events.EventHandler {

    private _frame: HTMLCanvasElement | any;
    private _checks: HTMLCanvasElement | any;
    private _viewport: HTMLVideoElement | any;
    private _container: any;
    private _coefficient: number = 0;
    private _modes = { LAZY: FACE_DETECT_INTERVAL_LAZY, ACTIVE: FACE_DETECT_INTERVAL_ACTIVE };
    private _mode: number = this._modes.LAZY;
    private _label: any;
    private _delay: any;


    public initialize = async () => {

        this._container = document.getElementById("view-page");

        this._viewport = document.querySelector("video");     

        this._frame = document.createElement("canvas");        

        this._checks = document.createElement("canvas");

        this._label = document.createElement("label"); this._container.appendChild(this._label);       
        this._label.style.setProperty('position', 'absolute');
        this._label.style.setProperty('top', '3%');
        this._label.style.setProperty('left', '3%');
        this._label.style.setProperty('font-size', '34px');
        this._label.style.setProperty('font-family', 'Courier New');
        this._label.style.setProperty('color', '#00ff30');

    
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);

        return true;
    };

    private onVideoEnterFrame = () => {

        clearTimeout(this._delay);

        this.analyzeVideoFrame();
        
        this.drawVideoToCanvas(true);     
        
        this._delay = setTimeout(() => this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame), 500);
    };

    private drawVideoToCanvas = (clear: boolean) => {
        if (clear) {
            this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'difference';
            this._frame.width = VIDEO_WIDTH;
            this._frame.height = VIDEO_HEIGHT;            
            this._frame.getContext('2d',  { willReadFrequently: true }).clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        }   
        this._frame.getContext('2d',  { willReadFrequently: true }).drawImage(this._viewport, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT); 
    }
    


    private analyzeVideoFrame = (dispatch = true): number => {

        if (this._mode === this._modes.ACTIVE) return 0;

        this._checks.width = 20;
        this._checks.height = 20;

        const context = this._checks.getContext("2d", { willReadFrequently: true });
        context.clearRect(0, 0, 20, 20);
        context.drawImage(this._viewport, 500, 400, 20, 20, 0, 0, 20, 20);    

        const bitmap = context.getImageData(0, 0, 20, 20);

        let rgb = Utils.getRgb(bitmap);

        //@ts-ignore
        let hsv = Utils.rbgToHsv(rgb.r, rgb.g, rgb.b);

        let delta = Math.abs(hsv.h - this._coefficient);   

        this._label.textContent = '[m_detect]: ' +
            ' Δ: { ' + delta.toFixed(2) + ' }';
            'lim:{ ' + MOTION_DETECT_PIXEL_COEF.toFixed(2) + ' }';
            
        
       // console.trace(delta.toFixed(2))
             
        if (delta > MOTION_DETECT_PIXEL_COEF && dispatch) {

            console.warn('probable motion detected');

            this._mode = this._modes.ACTIVE;

            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);

            setTimeout(() => { this._mode = this._modes.LAZY }, 5000);
        }
        return hsv.h;
    }
}

export default new MotionDetector();