import Signaling from "./Signaling";
import Streamer from "./Streamer";
import Viewer from "./Viewer";

class Distributor {

    private stream = document.querySelector("video");


    constructor() {
       // this.stream = 
    }

    public  initialize = async () => {

        const streamer: Streamer = new Streamer();
        const viewer: Viewer = new Viewer();
        const signaling: Signaling = new Signaling(streamer, viewer);

        

        streamer.setSignalingChannel(signaling);
        viewer.setSignalingChannel(signaling);
    
        streamer.startStreaming(this.stream);
    };

}

export default new Distributor();