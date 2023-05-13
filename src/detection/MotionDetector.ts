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
import Snaphots from "../view/Snaphots";

var counter = 0;

const Each = (count: number): boolean => !!(++counter % count === 0);

class MotionDetector extends Events.EventHandler {

    //TODO check the fucking bundle 


    private _frame:HTMLCanvasElement | any;
    private _checks:HTMLCanvasElement | any;
    private _checks_check:any;
    private _checks_capture:any;
    private _checks_check_enabled:boolean = false;
    private _checks_capture_enabled:boolean = false;
    private _viewport:HTMLVideoElement | any;
    private _coefficient:number = 0;
    private _modes = { LAZY: FACE_DETECT_INTERVAL_LAZY, ACTIVE: FACE_DETECT_INTERVAL_ACTIVE };
    private _mode: number = this._modes.LAZY;
    private _hsvDelta:number;



    public initialize = async () => {

        this._viewport = document.querySelector("video");     

        this._frame = document.createElement("canvas");        

        this._checks = document.createElement("canvas");

        this._checks_check = document.getElementById("motion-detector-checks");
        this._checks_check.addEventListener("change", (event: any) => this.onChecksValueChanged(event.target.checked));

        this._checks_capture = document.getElementById("motion-detector-capture");
        this._checks_capture.addEventListener("change", (event: any) => this.onCaptureValueChanged(event.target.checked));


        Utils.Logger.log('[MotionDetector.initialize] handling by: [' + 'RectDeltaHSV' + ']'); 

        setTimeout(() => {
            this._coefficient = this.analyzeVideoFrame(false);        
            this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
        }, MOTION_DETECT_DELAY)        

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

    private onChecksValueChanged = (value: boolean ) => {     

        this._checks_check_enabled = value;

        if (this._checks_check_enabled) {
            this.drawChecksData();
        } else {
            this.clearChecksData();
        }

        Utils.Logger.log('[MotionDetector.checkpoints] visible : [' + value + ']');
    };

    private onCaptureValueChanged = (value: boolean ) => {     
        
        this._checks_capture_enabled = value;

        Utils.Logger.log('[MotionDetector.capturing] enabled : [' + value + ']');
    };

    private drawChecksData = () => {

        let container  = document.querySelectorAll("canvas")[0];
        let context = container.getContext('2d');
        context.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);   

        const {x, y} = { x: 500, y: 400 };

        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "#ff0000";
        context.rect(x, y, 20, 20);
        context.stroke();

        context.font = '12px Courier New';
        context.fillStyle = "#ff0000";
        context.fillText(this._hsvDelta.toFixed(3), x - 8, y - 5);
    }

    private clearChecksData = () => {
        let container  = document.querySelectorAll("canvas")[0];
        let context = container.getContext('2d');
        context.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);  
    }
    
    private onVideoEnterFrame = () => {

        //if (Each(1)) { 
            this.analyzeVideoFrame();
            this.drawVideoToCanvas(true);
       // }       
        
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    };

    private analyzeVideoFrame = (dispatch = true): number => {

        if (this._mode === this._modes.ACTIVE) return 0;

        this._checks.width = 20;
        this._checks.height = 20;

        const context = this._checks.getContext("2d");
        context.clearRect(0, 0, 20, 20);
        context.drawImage(this._viewport, 500, 400, 20, 20, 0, 0, 20, 20);    

        const bitmap = context.getImageData(0, 0, 20, 20);

        let rgb = Utils.getRgb(bitmap);

        //@ts-ignore
        let hsv = Utils.rbgToHsv(rgb.r, rgb.g, rgb.b);

        let delta = this._hsvDelta = Math.abs(hsv.h - this._coefficient);   
        
        if (this._checks_check_enabled) {
            this.drawChecksData();
        }

        if (delta > MOTION_DETECT_PIXEL_COEF && dispatch) {
            this._mode = this._modes.ACTIVE;
            Utils.Logger.log('[MotionDetector.analyzeVideoFrame] delta : ' + delta.toFixed(3) + '. dispatching MOTION_DETECTED event.');

            if (this._checks_capture_enabled) {
                Snaphots.onViewportClick();
            }


            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);
            setTimeout(() => { this._mode = this._modes.LAZY }, 5000);
        }
        return hsv.h;
    }
}

export default new MotionDetector();