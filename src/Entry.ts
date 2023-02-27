import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./Constants";
import Snaphots from "./Snaphots";

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

        setTimeout(window.console.clear, 100);
    };
}

new Entry();