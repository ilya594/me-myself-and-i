
import * as Events from "../utils/Events";  
import Controls from "./Controls";


export class View extends Events.EventHandler {

    constructor() { 
        super();
    }

    public initialize = async () => {
      this.initializeView();
    }

    private initializeView = async () => {
      //@ts-ignore-line
      //screen.lockOrientation?.("landscape") || screen.lock?.("landscape");

      //document.querySelector("img").src = "./images/eye_frozen.png";

      document.querySelector("img").onclick = () => {
        document.getElementById("entry-page").style.setProperty('visibility', 'hidden');
        document.getElementById("view-page").style.setProperty('visibility', 'visible'); 
  
        document.getElementById("entry-page").style.display = 'none';
        document.getElementById("view-page").style.display = 'flex'; 
  
        Controls.initialize();
  
        this.dispatchEvent(Events.USER_PROCEEDED, null);
      };


    }


    // TODO move this somewhere idk/////////////////////////////////////////////////////////////////
    public displayStream = (stream: any) => {

      document.getElementById("loader").style.setProperty('visibility', 'hidden'); 
      document.getElementById("loader").style.display = 'none';   

      const viewport = document.querySelector("video");              
            viewport.onloadedmetadata = viewport.play;        
            viewport.srcObject = stream;
            viewport.style.setProperty('visibility', 'visible');
            viewport.style.display = 'flex';
      
      document.body.requestFullscreen();
    }


}

export default new View();