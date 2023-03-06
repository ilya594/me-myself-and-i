import { 
    MOTION_DETECT_IMAGE_COEF, 
    MOTION_DETECT_PIXEL_COEF,
    VIDEO_WIDTH,
    VIDEO_HEIGHT } from "./../utils/Constants";
import * as Events from "../utils/Events";    
import * as Utils from "../utils/Utils";

var counter = 0;
const HOUR = 30 * 60 * 60;
const Each = (count: number): boolean => {
    return !!(++counter % count === 0);
}

class MotionDetector extends Events.EventHandler {

    private _frame:HTMLCanvasElement;
    private _viewport:HTMLVideoElement;


    private drawVideoToCanvas = (clear: boolean) => {
        if (clear) {
            this._frame.width = VIDEO_WIDTH;
            this._frame.height = VIDEO_HEIGHT;
            this._frame.getContext('2d').clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        }   
        this._frame.getContext('2d').drawImage(this._viewport, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT); 
    }

    public initialize = async () => {

        this._viewport = document.querySelector("video");     

        this._frame?.remove();
        this._frame = document.createElement("canvas");
        this._frame.getContext('2d', { willReadFrequently: true }).globalCompositeOperation = 'difference';

        this.drawVideoToCanvas(true);

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
        
        return this;
    };

    private onVideoEnterFrame = () => {

        if (Each(4)) this.analyzeVideoFrame();

        if (Each(4)) this.drawVideoToCanvas(true);

        if (Each(HOUR)) return this.initialize();

        this._viewport.requestVideoFrameCallback(this.onVideoEnterFrame);
    };

    private analyzeVideoFrame = (): void => {    

        const bitmap = this._frame.getContext('2d').getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        
        let offset: number = 4;
        let difference: number = 0;
        
        for (let i = 0; i < bitmap.data.length - offset; i = i + offset) {
            const r = bitmap.data[i] / (offset - 1);
            const g = bitmap.data[i + 1] / (offset - 1);
            const b = bitmap.data[i + 2] / (offset - 1);
            if ((r + g + b) > MOTION_DETECT_PIXEL_COEF) difference += offset;
        }   

        const coefficient = Number((difference / (bitmap.data.length)).toFixed(offset));

        if (coefficient > MOTION_DETECT_IMAGE_COEF) {
            Utils.Logger.log('[MotionDetector.analyzeVideoFrame] coefficient : ' + coefficient + '. dispatching MOTION_DETECTED event.');
            this.dispatchEvent(Events.MOTION_DETECTION_STARTED, null);
        }
    };
}

export default new MotionDetector();