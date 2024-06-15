
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

    private _watchToggle_0: any;
    private _watchToggle_1: any;

    private _watchButtons_0: Array<any> = [];

    private _filesList: Array<any>;

    private _folders = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

        this._watchButton = document.getElementById("watch-button");
        this._watchButton.onmouseenter = () => {
            RestService.getFilesList().then((response: any) => this._filesList = response.data?.data);
            this._watchButton.firstElementChild.style.setProperty('visibility', 'visible');
        }
        this._watchButton.onmouseleave = () => this._watchButton.firstElementChild.style.setProperty('visibility', 'hidden');

        this._watchToggle_1 = document.getElementById("watch-toggle-item");
        
        const arrow_0 = this._watchToggle_1.firstElementChild;

        const onImageButtonClick = (path: string) => {
            const [month, name] = path.split('/');
            RestService.getSnapshot(month, name).then((result: string) => {
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

        addNothingFoundBackground();
        
        const onButtonMouseOver = (index: number) => {
            this._watchToggle_1.replaceChildren(arrow_0);

            if (this._filesList[index].length) {
                this._filesList[index].forEach((fileName: string) => {
                    const imageButton = this._watchButtons_0[0].cloneNode(true);
                          imageButton.textContent = fileName;
                          imageButton.style.setProperty('font-size', '24px');
                          imageButton.name = this._folders[index] + '/' + fileName;
                          imageButton.onclick = () => onImageButtonClick(imageButton.name);

                    /*const deleteButton = this._traceButton.cloneNode(true);
                          deleteButton.style.setProperty('background-image', 'url(./images/rubbish-bin.png');
                          deleteButton.style.setProperty('width', '30px');
                          deleteButton.style.setProperty('height', '30px');

                          deleteButton.style.setProperty('min-height', '1px');
                            deleteButton.style.setProperty('line-height', undefined);
                                deleteButton.style.setProperty('padding-bottom', undefined);
                                    deleteButton.style.setProperty('padding-right', undefined);
                                    deleteButton.style.setProperty('vertical-align', 'middle');*/

                    const container = document.createElement("div");
                        //  container.style.setProperty('display', 'flex');
                         // container.style.setProperty('flex-direction', 'row');
                          container.appendChild(imageButton);
                       //   container.appendChild(deleteButton);


                    this._watchToggle_1.appendChild(container);
                    //this._watchToggle_1.appendChild(imageButton);                   
                });
            } else {
                addNothingFoundBackground();
            }
            arrow_0.style.setProperty('top', (2 + (index * 8.25)).toString() + '%');
        }

        for (let i = 0; i < 12; i++) {
            const button = document.getElementById("watch-toggle-month-" + i);
            button.onmouseenter = () => onButtonMouseOver(i);
            this._watchButtons_0.push(button);
        }        
    }


    


}

export default new Controls();