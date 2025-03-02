
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

    private _fullsButton: any;

    //private _watchToggle_0: any;
    private _watchToggle_1: any;

    private _watchButtons_0: Array<any> = [];
    private _imageButtons: Array<any> = [];
    private _imageButtonsBlocked: boolean = false;
    private _contextMenu: any;

    private _filesList: Array<any>;

    private _folders = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    public initialize = async () => {

        this._container = document.getElementById("controls"); 

        this._viewport = document.querySelector("video");

        this.createButtons();
    }

    private createButtons = () => {

        this.createTraceButton();

        this.createVoiceButton();

        this.createFullsButton();

        this.createSnapsButton();


        //this._watchToggle_0 = document.getElementById("watch-toggle-month");

        this.createWatchButton();

        this.createWatchToggle(); 
        
        this.createContextMenu();

        this.createJonTravolta();        

        this.createSaveButtons();        
    }

    public setVisible = (value: boolean) => {
        this._container.style.setProperty('visibility', value ? 'visible' : 'hidden');
    }       
    
    public get localSaveEnabled(): boolean {
        return !!document.getElementById("local-save-button")?.style.getPropertyValue('background-color');
    }

    public get remoteSaveEnabled(): boolean {
        return !!document.getElementById("remote-save-button")?.style.getPropertyValue('background-color');
    }

    public adjustVolume = (value: any) => {
        this._voiceButton.style.opacity = String(value);
    }

    private createTraceButton = () => {
        this._traceButton = document.getElementById("trace-button");      
        this._traceButton.onclick = () => {
            this.dispatchEvent(Events.CHANGE_TRACE_VISIBILITY, null);
            if (this._traceButton.style.getPropertyValue('background-color')) {
                this._traceButton.style.removeProperty('background-color');
            } else {
                this._traceButton.style.setProperty('background-color', '#00ff0077');
            }
        }
    }

    private createVoiceButton = () => {
        this._voiceButton = document.getElementById("voice-button");
        this._voiceButton.onclick = () => StreamProvider?.sendVoiceMessage();        
            
        /*const current = Number(this._voiceButton.style.opacity);
          this._voiceButton.style.opacity = String(current + 0.1);
          if (Number(this._voiceButton.style.opacity) > 1) {
             this._voiceButton.style.opacity = String(0.1);
          }
         this.dispatchEvent(Events.VOLUME_ADJUST_SPREAD, 
         Number(this._voiceButton.style.opacity));*/
        
    }

    private createFullsButton = () => {
        this._fullsButton = document.getElementById("fullscreen-button");
        this._fullsButton.onclick = () => {
            console.log('[Controls] displayStream requesting fullscreen if avail');
      
            if (document.body.requestFullscreen) {
              try {
                document.body.requestFullscreen();
              } catch (error: any) {
                console.log('[Controls] displayStream requesting fullscreen error');
              }
             }
        };
    }

    private createSnapsButton = () => {
        this._snapsButton = document.getElementById("snaps-button").parentElement;
        this._snapsButton.onclick = () => Snaphots.flushBuffer();
    }

    private createWatchButton = () => {
        this._watchButton = document.getElementById("watch-button");

        this._watchButton.onmouseenter = () => {
            RestService.getFilesList().then((response: any) => this._filesList = response.data?.data);
            this._watchButton.firstElementChild.style.setProperty('visibility', 'visible');
        }
        this._watchButton.onmouseleave = () => this._watchButton.firstElementChild.style.setProperty('visibility', 'hidden');
    }

    private createWatchToggle = () => {
        this._watchToggle_1 = document.getElementById("watch-toggle-item");
        
        const arrow_0 = this._watchToggle_1.firstElementChild;

        const onButtonMouseOver = (index: number) => {
            this._watchToggle_1.replaceChildren(arrow_0);
            arrow_0.style.setProperty('top', (2 + (index * 8.25)).toString() + '%');

            if (this._filesList?.[index]?.length) {
                this.showContextMenu(index);                 
            } else {
                this.createJonTravolta();
            }            
        }

        for (let i = 0; i < 12; i++) {
            const button = document.getElementById("watch-toggle-month-" + i);
            button.onmouseenter = () => onButtonMouseOver(i);
            this._watchButtons_0.push(button);
        }  
    }

    private onDeleteButtonClick = (contextMenu: any) => {
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

    private onImageButtonClick = async (button: any) => {
        if (button._state) return;
        const [month, name] = button.name.split('/');

        this._imageButtonsBlocked = true;
        button.classList.toggle('button-months-downloading');            

        const result: string = await RestService.getSnapshot(month, name);
        button.classList.remove('button-months-downloading');
        this._imageButtonsBlocked = false;
        return FileSaver.saveAs(result, name);
    };

    private createContextMenu = (index: number = undefined) => {
        this._contextMenu = document.getElementById("context-menu");

        //@ts-ignore
        this._contextMenu.firstElementChild.onclick = (event) => {
          event.preventDefault(); event.stopPropagation();
          this.onDeleteButtonClick(this._contextMenu);
        }

        //@ts-ignore
        this._contextMenu.lastElementChild.onclick = (event) => {
          event.preventDefault(); event.stopPropagation();
          this.onImageButtonClick(this._contextMenu.parentElement).then((_: any) => {
              this.onDeleteButtonClick(this._contextMenu);
          });
        }
    }

    private showContextMenu = (index: number) => {
        this._imageButtons.length = 0;
        this._filesList[index].forEach((fileName: string) => {
            const imageButton = this._watchButtons_0[0].cloneNode(true);
                  if (!imageButton) return;
                  imageButton.textContent = fileName;
                  imageButton.style.setProperty('font-size', '24px');
                  imageButton.name = this._folders[index] + '/' + fileName;
                  imageButton.onclick = () => this.onImageButtonClick(imageButton); 
                  imageButton.onmouseenter = () => {
                    if (this._imageButtonsBlocked) return;
                    this._imageButtons.forEach((button: any) => {
                        if (button && button !== imageButton) button.style.removeProperty('background-color');
                    })
                  }
                  imageButton.oncontextmenu = () => {
                    if (this._imageButtonsBlocked) return;
                    imageButton.appendChild(this._contextMenu);                 
                    this._contextMenu.style.setProperty('visibility', 'visible');
                    this._contextMenu.nonce = this._folders[index] + '/' + fileName;
                    this._contextMenu.onmouseleave = () => {
                        this._contextMenu.style.setProperty('visibility', 'hidden');
                        imageButton.style.removeProperty('background-color');
                    };
                    imageButton.style.setProperty('background-color', '#ff0000');
                    return false;
                }
            this._imageButtons.push(imageButton);
            this._watchToggle_1.appendChild(imageButton); 
        });
    }

    private createJonTravolta = () => {
        const backgroundImage = document.createElement("div");
        backgroundImage.style.setProperty('background-image', 'url(./images/nothing_here.png');
        backgroundImage.style.setProperty('width', '100%');
        backgroundImage.style.setProperty('height', '100%');
        backgroundImage.style.setProperty('background-repeat', 'no-repeat');
        backgroundImage.style.setProperty('background-position', 'center');
        backgroundImage.style.setProperty('opacity',  '77%');            
        this._watchToggle_1.appendChild(backgroundImage);
    }

    private createSaveButtons = () => {
        const localSaveButton = document.getElementById("local-save-button");
        const remoteSaveButton = document.getElementById("remote-save-button");
        const onSaveButtonClick = (button: any) => {
            if (button.style.getPropertyValue('background-color')) {
                button.style.removeProperty('background-color');
            } else {
                button.style.setProperty('background-color', '#00ff0077');
            }
        }
        localSaveButton.onclick = () => onSaveButtonClick(localSaveButton);
        remoteSaveButton.onclick = () => onSaveButtonClick(remoteSaveButton); 
    }
}

export default new Controls();