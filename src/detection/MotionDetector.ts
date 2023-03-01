
import * as Utils from "../Utils";
import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_INTERVAL, 
    MOTION_DETECT_PIXEL_COEF,
    MOTION_DETECT_DELAY } from "./../Constants";
import * as Events from "../Events";    

class MotionDetector extends Events.EventHandler {
    private _frame:HTMLCanvasElement;
    private _viewport:any;
    private _timeout:any;
    private _counter = 0;

    //private _activity:boolean = false;

    constructor() {
        super();
    }

    public initialize = (viewport:HTMLVideoElement) => {
        this._viewport = viewport;        
        this._frame = document.createElement("canvas");
        this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'difference';
        //this._frame = Utils.drawCanvasFromVideo(this._frame, viewport, { timestamp: false });
        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
        return this;
    };

    private onVideoEnterFrame = () => {

        if (this._timeout || ++this._counter % 5 !== 0) {
            return this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
        }

        const onTimeoutComplete = () => {
            this._timeout = clearTimeout(this._timeout);
            this.onVideoEnterFrame();
        }

        const activity = this.analyzeVideoFrame();
        console.log('analyzing...activity : ' + activity);

        if (activity) {
            this._timeout = setTimeout(onTimeoutComplete, MOTION_DETECT_DELAY);
            //@ts-ignore
            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, { frame: new VideoFrame(this._viewport) });
        } else {
           this.dispatchEvent(Events.MOTION_DETECTION_FINISHED, null );
        }

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    };

    private analyzeVideoFrame = ():boolean => {

        //Utils.drawCanvasFromVideo(this._frame, this._viewport, { timestamp: false });

        const boundaries = this._viewport.getBoundingClientRect();
        const size = { w: boundaries.width, h: boundaries.height };   

        const bitmap = this._frame.getContext('2d').getImageData(0, 0, size.w, size.h);
        
        let difference:number = 0;
        
        for (var i = 0; i < bitmap.data.length; i += 4) {
            const r = bitmap.data[i] / 3;
            const g = bitmap.data[i + 1] / 3;
            const b = bitmap.data[i + 2] / 3;
            if ((r + g + b) > MOTION_DETECT_PIXEL_COEF) difference++;
        }   

        const coefficient = difference/bitmap.data.length;

        console.log('coef : ' + coefficient);

        return (coefficient > MOTION_DETECT_IMAGE_COEF);
            //console.log('detected...');
            //@ts-ignore
            //this.dispatchEvent(Events.MOTION_DETECTED, { frame: new VideoFrame(this._viewport) });
            //return this._timeout = setTimeout(this.onStartDetectionTimeoutComplete, MOTION_DETECT_DELAY);
        
        //this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);           
             
    };
}

export default new MotionDetector();