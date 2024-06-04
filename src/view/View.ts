
import * as Events from "../utils/Events";  
import Controls from "./Controls";


export class View extends Events.EventHandler {

    constructor() { 
        super();
    }

    public initialize = async () => {
      window.onload = (_) => this.initializeView();
    }

    private initializeView = async () => {
      //@ts-ignore-line
      //screen.lockOrientation?.("landscape") || screen.lock?.("landscape");

      document.querySelector("img").onclick = (_) => {
        document.getElementById("entry-page").style.display = 'none';
        document.getElementById("view-page").style.display = 'flex'; 

        this.dispatchEvent(Events.USER_PROCEEDED, null);

        Controls.initialize();
      }
    }


    // TODO move this somewhere idk/////////////////////////////////////////////////////////////////
    public displayStream = (stream: any) => {

      document.getElementById("loader").style.display = 'none';    
      const viewport = document.querySelector("video");              
      viewport.onloadedmetadata = viewport.play;        
      viewport.srcObject = stream;
      viewport.style.display = 'flex';
      
      document.body.requestFullscreen();
    }


}

export default new View();