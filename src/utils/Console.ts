import { EventHandler } from "./Events";
import * as Events from "../utils/Events";  

class Console extends EventHandler {

    private _console: any;

    private _value: string = '';

    constructor() {
        super();
    }

    public initialize = async () => {

        const viewport = document.getElementById("entry-page");

        this._console = document.createElement("textarea"); viewport.appendChild(this._console);
        this._console.style.setProperty('position', 'absolute');
        this._console.style.setProperty('top', '45%');
        this._console.style.setProperty('left', '30%');
        this._console.style.setProperty('width', '40%');
        this._console.style.setProperty('background-color', 'black');
        this._console.style.setProperty('font-size', '48px');
        this._console.style.setProperty('text-align', 'center');

       // this._console.style.setProperty('vertical-align', 'middle');
       // this._console.style.setProperty('line-height', '30%');
        this._console.style.setProperty('font-family', 'Courier New');
        this._console.style.setProperty('font-weight', 'bold');
        this._console.style.setProperty('color', 'green');
        this._console.style.setProperty('overflow', 'hidden');

        this._console.focus();
        this._console.value = '>';
        this._console.setSelectionRange(1,1);
        this._console.style.setProperty('display', 'none');


        document.onkeydown = (event: KeyboardEvent) => {

            if (Number.isInteger(Number(event.key))) {
                this._value += String(event.key);
            }
            
            switch (event.key) {
                case 'q': {
                    this.switchVisibility();
                    break;
                }
                case 'Enter': {
                    this.executeCommand(String(this._value));
                    break;
                }
            }

            if (this._console.value.length > 1) {
                this._console.value = '>' + '*'.repeat(this._console.value.length - 1);
            }            
        };
    }

    public switchVisibility = () => {
        this._console.style.setProperty('display', { inline : 'none', none : 'inline'}
            [String(this._console.style.getPropertyValue('display'))]);
    }

    private executeCommand = (command: String) => {
        switch (command) {
            case 'trace': {
                this.dispatchEvent(Events.CHANGE_TRACE_VISIBILITY, null);
                break;
            }
            default: {
                this.dispatchEvent(Events.CONSOLE_EXECUTE_COMMAND, command);
                break;
            }
        }
        this._console.value = '>';
        this.switchVisibility();

    }

}

export default new Console();


