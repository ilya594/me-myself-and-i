import Peer from "peerjs";

class StreamingEntity {


    constructor() {}

    private SEED_ID: string = 'endpoint-c774-4678-ac38-1473d7967d8b';
    private PEER_ID: string = 'client15-66db-3c0a-4f64-92f8452c63d2';

    private HOST_URL: string = '45.91.168.94';
    private HOST_PORT: number = 9000;

    public initialize = async () => {
       return this.initializeClient();
    };



    private initializeClient = async (): Promise<MediaStream> => {

        return new Promise((resolve) => {

            const peer = new Peer(this.PEER_ID, { host: this.HOST_URL, port: this.HOST_PORT });

            const connection = peer.connect(this.SEED_ID);
    
            //@ts-ignore
            connection.on('open', () => { 
                connection.send(this.PEER_ID);            
            });
    
            peer.on('call', call => {
    
                call.on('stream', stream => {
                  // const viewport = document.querySelector("video");
                  //  viewport.onloadedmetadata = viewport.play;        
                  //  viewport.srcObject = stream;

                  resolve(stream);

                });
                call.answer();
            });
        });
    };
}

export default new StreamingEntity();