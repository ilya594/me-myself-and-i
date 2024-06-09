
import Snaphots from "../record/Snaphots";
import StreamProvider from "../stream/StreamProvider";
import * as Events from "../utils/Events";  


export class Controls extends Events.EventHandler {

    constructor() { 
        super();
    }

    private _container: any;
    private _viewport: any;

    private _traceButton: any;
    private _snapsButton: any;

    public initialize = async () => {

        this._container = document.getElementById("controls");
        

        StreamProvider.addEventListener(Events.STREAM_RECEIVED, () => {

            this._viewport = document.querySelector("video");

            this._container.style.setProperty('visibility', 'visible');
        });

        this.createButtons();
    }

    private createButtons = () => {
        this._traceButton = document.getElementById("trace-button");      
        this._traceButton.onclick = () => this.dispatchEvent(Events.CHANGE_TRACE_VISIBILITY, null);

        this._snapsButton = document.getElementById("snaps-button").parentElement;
        this._snapsButton.onclick = () => Snaphots.flushBuffer();
    }


}

export default new Controls();