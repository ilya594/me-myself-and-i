import * as faceapi from "face-api.js";
import * as Utils from "../Utils";
import { 
    FACE_DETECT_INTERVAL, 
    FACE_DETECT_DELAY } from "./../Constants";
import * as Events from "../Events";
    

class FaceDetector extends Events.EventHandler {

    private _viewport:HTMLVideoElement;
    private _collection:Utils.Pool;
    private _interval:any;

    constructor() {
        super();  
    }

    public initialize = async (viewport:HTMLVideoElement) => {
        this._viewport = viewport;
        this._collection = new Utils.Pool(viewport);
        await this.initializeFaceDetection();
        return this;
    };

    private initializeFaceDetection = async () => {
        await faceapi.loadTinyFaceDetectorModel("../models/");
        await faceapi.nets.tinyFaceDetector.load("../models/");
        await faceapi.loadSsdMobilenetv1Model("../models/");

        //this.startDetectionInterval();
    }

    private startDetectionInterval = () => {
        this._interval = setInterval(async () => {
            await this.analyzeVideoFrame();
        }, FACE_DETECT_INTERVAL);
    };

    private analyzeVideoFrame = async () => {
        const frame:HTMLCanvasElement = Utils.drawCanvasFromVideo(this._collection.get(), this._viewport);
        const options = new faceapi.TinyFaceDetectorOptions();

        const detections = await faceapi.detectAllFaces(frame, options);

        if (detections.length) {
            this.stopDetectionInterval();
            this.dispatchEvent(Events.FACE_DETECTED, { source: frame, detections: detections });
        }  
        this._collection.put(frame);          
        return detections;        
    };

    private stopDetectionInterval = () => {
        clearInterval(this._interval);        
        setTimeout(this.startDetectionInterval, FACE_DETECT_DELAY);
    };
}

export default new FaceDetector();