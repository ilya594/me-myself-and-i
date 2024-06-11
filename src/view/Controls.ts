
import Snaphots from "../record/Snaphots";
import StreamProvider from "../network/StreamProvider";
import * as Events from "../utils/Events";  


export class Controls extends Events.EventHandler {

    constructor() { 
        super();
    }

    private _container: any;
    private _viewport: any;

    private _traceButton: any;
    private _snapsButton: any;
    private _watchButton: any;

    private _watchToggle_0: any;
    private _watchToggle_1: any;

    private _watchButtons_0: Array<any> = [];

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

        this._watchToggle_0 = document.getElementById("watch-toggle-month");

        const onMouseOut = (timeout: number = 0) => setTimeout(() => !this._watchButton.name.length && this._watchToggle_0.style.setProperty('visibility', 'hidden'), timeout);
        const onMouseOver = (name: string) => !this._watchButton.name.includes(name) && (this._watchButton.name += name)

        this._watchButton = document.getElementById("watch-button");
        this._watchButton.onmouseover = () => this._watchToggle_0.style.setProperty('visibility', 'visible');
        this._watchButton.onmouseleave = () => onMouseOut(600);

        this._watchToggle_1 = document.getElementById("watch-toggle-item");

        this._watchToggle_0.onmouseover = () => onMouseOver('watch-toggle-month.') && this._watchToggle_1.style.setProperty('visibility', 'visible');
        this._watchToggle_0.onmouseleave = () => { this._watchButton.name.includes('watch-toggle-month.') && (this._watchButton.name = this._watchButton.name.replace('watch-toggle-month.','')); this._watchToggle_1.style.setProperty('visibility', 'hidden'); onMouseOut();};

        
        const arrow_0 = this._watchToggle_1.firstElementChild;

        const onButtonMouseOver = (index: number) => arrow_0.style.setProperty('top', String(index * 7.7 + 2) + '%');

        for (let i = 0; i < 12; i++) {
            const button = document.getElementById("watch-toggle-month-" + i);
            button.onmouseover = () => onButtonMouseOver(i);
            this._watchButtons_0.push(button);
        }

    }


}

export default new Controls();