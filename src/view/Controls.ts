
import * as Events from "../utils/Events";  


export class Controls extends Events.EventHandler {

    constructor() { 
        super();
    }

    private _container: any;

    private _traceButton: any;

    public initialize = async () => {
        this._container = document.getElementById("view-page");

        this.createTraceButton();
    }

    private createTraceButton = () => {
        this._traceButton = document.getElementById("trace-button");      
        this._traceButton.onclick = () => this.dispatchEvent(Events.CHANGE_TRACE_VISIBILITY, null);
    }


}

export default new Controls();