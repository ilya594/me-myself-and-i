
import * as Utils from "./../utils/Utils";

class Soundpad {


    constructor() { }

    private _container: HTMLElement;
    private _phrases: Map<string, any> = new Map();

    public initialize = async () => {   

        this._container = document.getElementById('soundpad');

        this.preparePhrases();


        //TODO clean this shit
        const button = this.createNewButton({ key: 'метро обережно', say: () => Utils.Speaker.playOnce('./../audio/kyiv_metro_obolon.mp3')});
        this._container.appendChild(this.wrapButton(button));

        return true;
    };

    private preparePhrases = () => {
        this._phrases.set('метро обережно', () => Utils.Speaker.playOnce('./../audio/kyiv_metro_obolon.mp3'));      
    };

    private wrapButton = (button: HTMLButtonElement): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.appendChild(button);
        return wrapper;
    }

    private createNewButton = (phrase: any): HTMLButtonElement => {
        debugger;
        const button = document.createElement('button') as HTMLButtonElement;
        button.onclick = () => phrase.say();
        button.textContent = phrase.key;
        return button;
    }



}

export default new Soundpad();