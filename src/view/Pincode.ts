import { PINCODE_CHAR_LENGTH } from "../utils/Constants";
import * as Events from "../utils/Events";  

class Pincode extends Events.EventHandler {

    private _inputs: Array<any> = [];

    constructor() {
        super();
    }

    public initialize = async () => {

        const viewport = document.getElementById("entry-page");

        for (let i = 0; i < PINCODE_CHAR_LENGTH; i++) {

            let _console = document.createElement("input"); viewport.appendChild(_console);
            _console.type = 'password';
            _console.maxLength = 1;
            _console.style.setProperty('position', 'absolute');
            _console.style.setProperty('top', '45%');
            _console.style.setProperty('left', 30 + (i * 12) + '%');
            _console.style.setProperty('width', '60px');
            _console.style.setProperty('background-color', 'black');
            _console.style.setProperty('font-size', '48px');
            _console.style.setProperty('text-align', 'center');
            _console.style.setProperty('font-family', 'Courier New');
            _console.style.setProperty('font-weight', 'bold');
            _console.style.setProperty('color', 'green');
            _console.style.setProperty('overflow', 'hidden');
            
            this._inputs.push(_console);
        }

        this._inputs[0].focus();

        document.onkeyup = (event: KeyboardEvent) => {

            if (this._inputs[this._inputs.length - 1].value) {
                const pin: string = this._inputs.map(({ value }) => value)
                    .reduce((accumulator, currentValue) => accumulator + currentValue);
                this.dispatchEvent(Events.CONSOLE_EXECUTE_COMMAND, pin);
                document.onkeyup = () => {};

            } else {
                for (let i = 0; i < PINCODE_CHAR_LENGTH - 1; i++) {
                    if (this._inputs[i].value) {
                        this._inputs[i + 1].focus();
                    }
                }
            }
        };
    }
}

export default new Pincode();


