import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_PIXEL_COEF,
    MOTION_DETECT_DELAY,
    VIDEO_WIDTH,
    VIDEO_HEIGHT, 
    FACE_DETECT_INTERVAL_LAZY,
    FACE_DETECT_INTERVAL_ACTIVE} from "./../utils/Constants";
import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

var counter = 0;

const Each = (count: number): boolean => !!(++counter % count === 0);

class MotionDetector extends Events.EventHandler {

    private _frame:HTMLCanvasElement;
    private _checks:HTMLCanvasElement;
    private _viewport:HTMLVideoElement;
    private _coefficient:number = 0;
    private _modes = { LAZY: FACE_DETECT_INTERVAL_LAZY, ACTIVE: FACE_DETECT_INTERVAL_ACTIVE };
    private _mode: number = this._modes.LAZY;

    private drawVideoToCanvas = (clear: boolean) => {
        if (clear) {
            this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'difference';
            this._frame.width = VIDEO_WIDTH;
            this._frame.height = VIDEO_HEIGHT;            
            this._frame.getContext('2d',  { willReadFrequently: true }).clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        }   
        this._frame.getContext('2d',  { willReadFrequently: true }).drawImage(this._viewport, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT); 
    }

    public initialize = async () => {

        this._viewport = document.querySelector("video");     

        this._frame = document.createElement("canvas");        


        this._checks = document.createElement("canvas");
        this._checks.width = 20;
        this._checks.height = 20;
        this._checks.getContext("2d", { willReadFrequently: true }).drawImage(this._viewport, 500, 400, 20, 20, 0, 0, 20, 20);

        Utils.Logger.log('[MotionDetector.initialize] handling by: [' + 'RectDeltaHSV' + ']'); 

        setTimeout(() => {
            this._coefficient = this.analyzeVideoFrame(false).h;        
            this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
        }, MOTION_DETECT_DELAY)        
        
        return this;
    };

    
    private onVideoEnterFrame = () => {

        if (Each(4)) { 
            this.analyzeVideoFrame();
            this.drawVideoToCanvas(true);
        }       
        
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    };

    private analyzeVideoFrame = (dispatch = true) => {

        if (this._mode === this._modes.ACTIVE) return;

        this._checks.width = 20;
        this._checks.height = 20;

        const context = this._checks.getContext("2d");
        context.clearRect(0, 0, 20, 20);
        context.drawImage(this._viewport, 500, 400, 20, 20, 0, 0, 20, 20);        

        const bitmap = context.getImageData(0, 0, 20, 20);

        let offset: number = 4;

        let r = 0;
        let g = 0;
        let b = 0;       
        let j = 0;

        for (let i = 0; i < bitmap.data.length - offset; i = i + offset) {
            r += bitmap.data[i];
            g += bitmap.data[i + 1];
            b += bitmap.data[i + 2];
            j++;
        }  
        let R = r/j;
        let G = g/j;
        let B = b/j;

        let hsv = Utils.rbgToHsv(R,G,B);
        let delta = Math.abs(hsv.h - this._coefficient);

        if (delta > 30 && dispatch) {
            this._mode = this._modes.ACTIVE;
            Utils.Logger.log('[MotionDetector.analyzeVideoFrame] delta : ' + delta.toFixed(3) + '. dispatching MOTION_DETECTED event.');
            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);
            setTimeout(() => { this._mode = this._modes.LAZY }, 5000);
        }
        return hsv;
    }


    /*private analyzeVideoFrame = (): void => {    

        const bitmap = this._frame.getContext('2d').getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        
        let offset: number = 4;
        let difference: number = 0;
        
        for (let i = 0; i < bitmap.data.length - offset; i = i + offset) {
            const r = bitmap.data[i] / (offset - 1);
            const g = bitmap.data[i + 1] / (offset - 1);
            const b = bitmap.data[i + 2] / (offset - 1);
            if ((r + g + b) > MOTION_DETECT_PIXEL_COEF) difference += offset;
        }   

        const coefficient = difference / bitmap.data.length;
        const delta = Math.abs(this._coefficient - coefficient);

        if (this._coefficient > 0 &&  delta > MOTION_DETECT_IMAGE_COEF) {
            Utils.Logger.log('[MotionDetector.analyzeVideoFrame] delta : ' + delta.toFixed(3) + '. dispatching MOTION_DETECTED event.');
            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);
        }
        this._coefficient = coefficient;
    };*/
}

export default new MotionDetector();