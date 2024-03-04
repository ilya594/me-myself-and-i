import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_PIXEL_COEF,
    MOTION_DETECT_DELAY,
    VIDEO_WIDTH,
    VIDEO_HEIGHT, 
    FACE_DETECT_INTERVAL_LAZY,
    FACE_DETECT_INTERVAL_ACTIVE} from "./utils/Constants";
import * as Events from "./utils/Events";    
import * as Utils from "./utils/Utils";


export class MotionDetector extends Events.EventHandler {

    private _frame:HTMLCanvasElement | any;
    private _checks:HTMLCanvasElement | any;
    private _viewport:HTMLVideoElement | any;
    private _coefficient:number = 0;
    private _modes = { LAZY: FACE_DETECT_INTERVAL_LAZY, ACTIVE: FACE_DETECT_INTERVAL_ACTIVE };
    private _mode: number = this._modes.LAZY;
    private _label: any;


    public initialize = async () => {

        this._viewport = document.querySelector("video");     

        this._frame = document.createElement("canvas");        

        this._checks = document.createElement("canvas");

        this._label = document.getElementById("tracelabel");

        setTimeout(() => {
            this._coefficient = this.analyzeVideoFrame(false);        
            this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
        }, MOTION_DETECT_DELAY);

        return true;
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
    
    private onVideoEnterFrame = () => {

        this.analyzeVideoFrame();
        this.drawVideoToCanvas(true);     
        
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    };

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

        this._label.textContent = 'hsv delta: ' + delta.toFixed(2);
             
        if (delta > MOTION_DETECT_PIXEL_COEF && dispatch) {

            this._mode = this._modes.ACTIVE;

            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);

            setTimeout(() => { this._mode = this._modes.LAZY }, 5000);
        }
        return hsv.h;
    }
}

export default new MotionDetector();