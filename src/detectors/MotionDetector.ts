
import * as Utils from "../Utils";
import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_INTERVAL, 
    MOTION_DETECT_PIXEL_COEF,
    MOTION_DETECT_DELAY } from "./../Constants";
import * as Events from "../Events";    

export default class MotionDetector extends Events.EventHandler {
    private _frame:HTMLCanvasElement;
    private _viewport:any;
    private _interval:any;
    private _pool:Utils.Pool;

    constructor(viewport:HTMLVideoElement) {
        super();
        this._viewport = viewport;
        this._frame = document.createElement("canvas");
        this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'difference';
        //this._frame.getContext('2d').willReadFrequently = true;
        this._frame = Utils.drawCanvasFromVideo(this._frame, viewport, { timestamp: false });
        this._pool = new Utils.Pool(viewport);
        this.startDetectionInterval();
    }

    private startDetectionInterval = () => {
        this._interval = setInterval(() => {
            this.analyzeVideoFrame();
        }, MOTION_DETECT_INTERVAL);    
    };
    
    private stopDetectionInterval = () => {
        clearInterval(this._interval);
        setTimeout(this.startDetectionInterval, MOTION_DETECT_DELAY);
    };

    private analyzeVideoFrame = () => {
        Utils.drawCanvasFromVideo(this._frame, this._viewport, { timestamp: false });
        const boundaries = this._viewport.getBoundingClientRect();
        const size = { w: boundaries.width, h: boundaries.height };        
        const bitmap = this._frame.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, size.w, size.h);
        
        let difference:number = 0;
        
        for (var i = 0; i < bitmap.data.length; i += 4) {
            const r = bitmap.data[i] / 3;
            const g = bitmap.data[i + 1] / 3;
            const b = bitmap.data[i + 2] / 3;
            if ((r + g + b) > MOTION_DETECT_PIXEL_COEF) difference++;
        }   
        const coefficient = difference/(size.w * size.h);

        //console.log('[MotionDetector.analyzeVideoFrame] coefficient : ' + coefficient);

        if (coefficient > MOTION_DETECT_IMAGE_COEF) {
            this.stopDetectionInterval();
            const source = Utils.drawCanvasFromVideo(this._pool.get(), this._viewport);
            return this.dispatchEvent(Events.MOTION_DETECTED, { source });
        }
        return false;
    };

    //private dispatchDetectedEvent = () => {}
}