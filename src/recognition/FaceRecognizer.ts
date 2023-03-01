import * as faceapi from "face-api.js";
import * as facesJSON from '../descriptors.json';
import * as Events from "../Events";
import FaceDetector from "../detection/FaceDetector";
import { FaceDetectionOptions, FaceMatcher } from "face-api.js";
import * as Utils from "./../Utils";

const UNKNOWN:string = 'unknown';

class FaceRecognizer extends Events.EventHandler {

    private _faces:any = [];
    private _matcher:FaceMatcher;
    private _processing:boolean = false;
    private _options:FaceDetectionOptions;
    private _detections:any;
    private _data:Events.DetectionData;

    constructor() {
        super();
    }

    public initialize = async() => {

        await faceapi.loadSsdMobilenetv1Model("../models/");
        await faceapi.loadAgeGenderModel("../models/");
        await faceapi.loadFaceRecognitionModel("../models/");
        await faceapi.nets.faceLandmark68Net.load("../models/");

        facesJSON.all.forEach(face => this._faces.push(faceapi.LabeledFaceDescriptors.fromJSON(face)));

        this._matcher = new faceapi.FaceMatcher(this._faces);

        this._options = new faceapi.SsdMobilenetv1Options();

        FaceDetector.addEventListener(Events.FACE_DETECTED, (data:Events.DetectionData) => this._onDetectionDataReceived(data));

        return Promise.resolve();
    };

    private _onDetectionDataReceived = async (data:Events.DetectionData) => {

        Utils.log('[FaceRecognizer._onDetectionDataReceived] is busy: [ ' + this._processing + ' ]'); 

        if (this._processing) return false;   //@ts-ignore    

        this._processing = true; 

        this._data = data;

        const result = await this._analyzeDetections();

        Utils.log('[FaceRecognizer._onDetectionDataReceived] detections analyzed'); 

        this.dispatchEvent(Events.FACE_RECOGNIZED, { frame: this._data.frame.clone(), person: result, bounds: this._data.bounds });

        this._dispose();
    };

    private _analyzeDetections = async():Promise<Person> => {         
        //@ts-ignore
        this._detections = await faceapi.detectAllFaces(this._data.frame, this._options).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
        
        if (!this._detections?.length) return Distinguish();

        const detection = this._detections.pop();

        const match = this._matcher.findBestMatch(detection.descriptor);
        
        return Distinguish(detection, match);
    };
    
    private _dispose = () => {
        this._data?.frame?.dispose();
        delete this._data?.frame;
        this._detections = null;
        this._processing = false;
    };
}

export const Distinguish = (detection:any | null = null, match:any | null = null):Person => {
    return {
        identified: (!!match && match.label !== UNKNOWN),
        name: match?.label || UNKNOWN,
        age: detection?.age?.toFixed(0),
        sex: detection?.gender
    };
};

export interface Person {
    identified: boolean;
    name: string;
    age?:number;
    sex?:string;
    mood?:Array<string>;
};


export default new FaceRecognizer();