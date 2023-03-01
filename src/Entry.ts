import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./Constants";
import * as Events from "./Events";
import Snaphots from "./view/Snaphots";
import * as Utils from "./Utils";
import FaceDetector from "./detection/FaceDetector";
import FaceRecognizer from './recognition/FaceRecognizer';

class Entry {

    private _snapshots:Snaphots;
    private _constraints = { video : { width: VIDEO_WIDTH, height: VIDEO_HEIGHT } };
    private _stream:MediaStream;   
    private _viewport:HTMLVideoElement;
 

    constructor() {
       this.initialize();         
    }

    private initialize = async () => {
        
        this._stream = await navigator.mediaDevices.getUserMedia(this._constraints); 

        this._viewport = document.querySelector("video");
        this._viewport.onloadedmetadata = () => this._viewport.play();        
        this._viewport.srcObject = this._stream;

        this._snapshots = new Snaphots();

        await FaceDetector.initialize();          

        await FaceRecognizer.initialize();       

        FaceRecognizer.addEventListener(Events .FACE_RECOGNIZED, async (data:Events.DetectionData) => { //@ts-ignore

            Utils.log('[Snapshots.FACE_RECOGNIZED] person: [' + data.person.name + ']');  

            this._snapshots.createSnaphot(await Utils.generateSignedCanvas(data));
         });

        Utils.log('[Snapshots.initializeDetectors] initilization completed');  

        setTimeout(window.console.clear, 1000);
    };
}

new Entry();