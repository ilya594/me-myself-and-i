
import Snaphots from "../record/Snaphots";
import StreamProvider from "../network/StreamProvider";
import * as Events from "../utils/Events";  
import RestService from "../network/RestService";
import FileSaver from "file-saver";


export class Controls extends Events.EventHandler {

    constructor() { 
        super();
    }

    private _container: any;
    private _viewport: any;

    private _traceButton: any;
    private _snapsButton: any;
    private _watchButton: any;
    private _voiceButton: any;

    private _watchToggle_0: any;
    private _watchToggle_1: any;

    private _watchButtons_0: Array<any> = [];
    private _imageButtons: Array<any> = [];
    private _imageButtonsBlocked: boolean = false;

    private _filesList: Array<any>;

    private _folders = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    public initialize = async () => {

        this._container = document.getElementById("controls"); 

        this._viewport = document.querySelector("video");

        this.createButtons();
    }

    public setVisible = (value: boolean) => {
        this._container.style.setProperty('visibility', value ? 'visible' : 'hidden');
    }        

    private createButtons = () => {
        this._traceButton = document.getElementById("trace-button");      
        this._traceButton.onclick = () => this.dispatchEvent(Events.CHANGE_TRACE_VISIBILITY, null);

        this._voiceButton = document.getElementById("voice-button");
        this._voiceButton.onclick = () => {
            const current = Number(this._voiceButton.style.opacity);
            this._voiceButton.style.opacity = String(current + 0.1);
            if (Number(this._voiceButton.style.opacity) > 1) {
                this._voiceButton.style.opacity = String(0.1);
            }
            this.dispatchEvent(Events.VOLUME_ADJUST_SPREAD, Number(this._voiceButton.style.opacity));
        }

        this._snapsButton = document.getElementById("snaps-button").parentElement;
        this._snapsButton.onclick = () => Snaphots.flushBuffer();

        this._watchToggle_0 = document.getElementById("watch-toggle-month");

        this._watchButton = document.getElementById("watch-button");

        this._watchButton.onmouseenter = () => {
            RestService.getFilesList().then((response: any) => this._filesList = response.data?.data);
            this._watchButton.firstElementChild.style.setProperty('visibility', 'visible');
        }
        this._watchButton.onmouseleave = () => this._watchButton.firstElementChild.style.setProperty('visibility', 'hidden');

        this._watchToggle_1 = document.getElementById("watch-toggle-item");
        
        const arrow_0 = this._watchToggle_1.firstElementChild;

        const contextMenu = document.getElementById("context-menu");
              //@ts-ignore

              contextMenu.firstElementChild.onclick = (event) => {
                event.preventDefault(); event.stopPropagation();

                const button = contextMenu.parentElement;
                button.classList.toggle('button-months-deleting');
                this._imageButtonsBlocked = true;

                contextMenu.parentElement.removeChild(contextMenu);

                const [month, name] = contextMenu.nonce.split('/');
                RestService.deleteSnapshot(month, name).then((_: any) => {                    
                          button.classList.remove('button-months-deleting');
                          this._imageButtonsBlocked = false;
                    this._watchToggle_1.removeChild(button);
                });
              }

        const onImageButtonClick = (button: any) => {
            if (button._state) return;
            const [month, name] = button.name.split('/');

            this._imageButtonsBlocked = true;
            button.classList.toggle('button-months-downloading');
            

            RestService.getSnapshot(month, name).then((result: string) => {
                button.classList.remove('button-months-downloading');
                this._imageButtonsBlocked = false;
                FileSaver.saveAs(result, name);
            });
        };

        const addNothingFoundBackground = () => {
            const backgroundImage = document.createElement("div");
            backgroundImage.style.setProperty('background-image', 'url(./images/nothing_here.png');
            backgroundImage.style.setProperty('width', '100%');
            backgroundImage.style.setProperty('height', '100%');
            backgroundImage.style.setProperty('background-repeat', 'no-repeat');
            backgroundImage.style.setProperty('background-position', 'center');
            backgroundImage.style.setProperty('opacity',  '77%');            
            this._watchToggle_1.appendChild(backgroundImage);
        }

        const addImageControlContainer = (index: number) => {
            this._imageButtons.length = 0;
            this._filesList[index].forEach((fileName: string) => {
                const imageButton = this._watchButtons_0[0].cloneNode(true);
                      imageButton.textContent = fileName;
                      imageButton.style.setProperty('font-size', '24px');
                      imageButton.name = this._folders[index] + '/' + fileName;
                      imageButton.onclick = () => onImageButtonClick(imageButton); 
                      imageButton.onmouseenter = () => {
                        if (this._imageButtonsBlocked) return;
                        this._imageButtons.forEach((button: any) => {
                            if (button && button !== imageButton) button.style.removeProperty('background-color');
                        })
                      }
                      imageButton.oncontextmenu = () => {
                        if (this._imageButtonsBlocked) return;
                        imageButton.appendChild(contextMenu);                 
                        contextMenu.style.setProperty('visibility', 'visible');
                        contextMenu.nonce = this._folders[index] + '/' + fileName;
                        contextMenu.onmouseleave = () => {
                            contextMenu.style.setProperty('visibility', 'hidden');
                            imageButton.style.removeProperty('background-color');
                        };
                        imageButton.style.setProperty('background-color', '#ff0000');
                        return false;
                    }
                this._imageButtons.push(imageButton);
                this._watchToggle_1.appendChild(imageButton); 
            });
        }

        addNothingFoundBackground();        

        
        const onButtonMouseOver = (index: number) => {
          //  debugger;
            this._watchToggle_1.replaceChildren(arrow_0);
            arrow_0.style.setProperty('top', (2 + (index * 8.25)).toString() + '%');

            if (this._filesList[index].length) {
                addImageControlContainer(index);                 
            } else {
                addNothingFoundBackground();
            }            
        }

        for (let i = 0; i < 12; i++) {
            const button = document.getElementById("watch-toggle-month-" + i);
            button.onmouseenter = () => onButtonMouseOver(i);
            this._watchButtons_0.push(button);
        }        
    }

    public adjustVolume = (value: any) => {
        this._voiceButton.style.opacity = String(value);
    }


    


}

export default new Controls();