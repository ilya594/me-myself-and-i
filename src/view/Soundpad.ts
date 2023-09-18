
import * as Utils from "./../utils/Utils";

class Soundpad {

    constructor() { }

    private _container: HTMLElement;
    private _phrases: Array<Object>;

    public initialize = async () => {           

        this._container = document.getElementById('soundpad');   

        this.preparePhrases();
        this.createButtons();

        return true;
    };

    private createButtons = () => {
        this._phrases.forEach((phpase) => this._container.appendChild(this.wrapButton(this.createNewButton(phpase))));
    };

    private preparePhrases = () => {
        this._phrases = [
            { key: 'метро обережно', say: () => Utils.Speaker.playOnce('./audio/kyiv_metro_obolon.mp3') }
        ]; 
    };

    private wrapButton = (button: HTMLButtonElement): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.appendChild(button);
        return wrapper;
    }

    private createNewButton = (phrase: any): HTMLButtonElement => {      
        const button = document.createElement('button') as HTMLButtonElement;
        button.onclick = () => phrase.say();
        button.textContent = phrase.key;
        return button;
    }



}

export default new Soundpad();