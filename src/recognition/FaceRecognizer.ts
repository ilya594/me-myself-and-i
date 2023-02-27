import * as faceapi from "face-api.js";
import * as facesJSON from '../descriptors.json';
import * as Events from "../Events";
import FaceDetector from "../detection/FaceDetector";
import { FaceMatcher } from "face-api.js";
import * as Utils from "../Utils";

class FaceRecognizer extends Events.EventHandler {

    private faces:any = [];
    private _matcher:FaceMatcher;

    constructor() {
        super();
    }

    public initialize = async() => {

        //await faceapi.loadSsdMobilenetv1Model("../models/");
        await faceapi.loadAgeGenderModel("../models/");
        await faceapi.loadFaceRecognitionModel("../models/");
        await faceapi.nets.faceLandmark68Net.load("../models/");

        facesJSON.all.forEach(face => this.faces.push(faceapi.LabeledFaceDescriptors.fromJSON(face)));

        this._matcher = new faceapi.FaceMatcher(this.faces);

        FaceDetector.addEventListener(Events.FACE_DETECTED, (data:any) => this.analyzeDetections(data));

     

    };

    public analyzeDetections = async(data:any) => {

        const options = new faceapi.SsdMobilenetv1Options();

        this._matcher = new faceapi.FaceMatcher(this.faces);

        const detections = await faceapi.detectAllFaces(data.source, options).withFaceLandmarks().withAgeAndGender().withFaceDescriptors();    
        
        if (!detections?.length) return this.dispatchEvent(Events.FACE_RECOGNIZED, { source: data.source, person : 'recognition_error' });

        const detection = detections[detections.length - 1];

        const match = this._matcher.findBestMatch(detection.descriptor);
        
        const person = (match?.distance < 0.7 ? match?.label : 'unknown') + '. age:' + detection?.age?.toFixed(1) + '. sex:' + detection?.gender;

        this.dispatchEvent(Events.FACE_RECOGNIZED, { source: data.source, person : person });
    };

}

export default new FaceRecognizer();