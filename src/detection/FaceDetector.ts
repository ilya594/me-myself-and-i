import * as faceapi from "face-api.js";
import { 
    FACE_DETECT_INTERVAL, 
    VIDEO_WIDTH,
    VIDEO_HEIGHT} from "./../Constants";
import * as Events from "../Events";
import { data, browser, Tensor4D }  from "@tensorflow/tfjs";
import { FaceDetectionOptions, TinyFaceDetectorOptions } from "face-api.js";
import * as Utils from "./../Utils";
    

class FaceDetector extends Events.EventHandler {

    private _viewport:HTMLVideoElement;
    private _frame:Tensor4D;
    private _camera:any;
    private _options:TinyFaceDetectorOptions | FaceDetectionOptions;
    private _detections:any = [];
    private _processing: boolean = false;

    constructor() {
        super();  
    }

    public initialize = async () => {

        this._viewport = document.querySelector("video");

        this._viewport.width = VIDEO_WIDTH;
        this._viewport.height = VIDEO_HEIGHT;

        this._camera  = await data.webcam(this._viewport);

        return await this._initializeFaceDetection();
    };

    private _initializeFaceDetection = async () => {

        await faceapi.loadTinyFaceDetectorModel("../models/");
        await faceapi.nets.tinyFaceDetector.load("../models/");
        await faceapi.loadSsdMobilenetv1Model("../models/");

        this._options = new faceapi.TinyFaceDetectorOptions();

        setInterval(this._processVideoFrame, FACE_DETECT_INTERVAL);

        return true;
    }


    private _processVideoFrame = async () => {

        if (this._processing) return false;

        this._processing = true;

        this._frame = await this._camera.capture();       

        if (!this._frame) return this._dispose(); //@ts-ignore
        
        this._detections = await faceapi.detectAllFaces(this._frame, this._options); 

        if (!this._detections?.length) return this._dispose();

        Utils.log('[FaceDetector._processVideoFrame] detections: [' + this._detections.length + ']');  

        this.dispatchEvent(Events.FACE_DETECTED, { frame: this._frame.clone(), canvas: await this._splashFrametoCanvas(this._frame), box: this._detections.pop().box }); 

        this._dispose();

        return true;
    };

    private _splashFrametoCanvas = async (frame:Tensor4D) => {
        const canvas = document.createElement("canvas"); //@ts-ignore
        canvas.width = frame.shape.width; //@ts-ignore
        canvas.height = frame.shape.height; //@ts-ignore
        await browser.toPixels(frame, canvas);
        return canvas;
    };

    private _dispose = () => {
        this._frame?.dispose();
        this._frame = null;
        this._detections = null;
        this._processing = false;
        return false;
    };
}

export default new FaceDetector();