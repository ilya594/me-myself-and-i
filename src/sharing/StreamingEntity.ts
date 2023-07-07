import Peer from "peerjs";

class StreamingEntity {

   private static PEERS: any = {
    DISTRIBUTOR: { UUID: 'bf5641c6-1d11-11ee-be56-0-distributor' },
    CLIENT:      { UUID: 'cc658912-1d11-11ee-be56-0242ac-client' }
   };

    constructor() {}

    public initialize = async () => {

        this.initializeDistributor();

        setTimeout(this.initializeClient, 3000);

        return true;
    };

    private initializeDistributor = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({ video : { width: 800, height: 600 } }); 

        const peer = this.createPeer(StreamingEntity.PEERS.DISTRIBUTOR.UUID);
        
        peer.on('connection', connection => {

            connection.on('data', data => {

                debugger;
                const call = peer.call(String(data), stream);  
                         
            });            
        });


    };

    private initializeClient = () => {

        const peer = this.createPeer(StreamingEntity.PEERS.CLIENT.UUID);

        const connection = peer.connect(StreamingEntity.PEERS.DISTRIBUTOR.UUID);

        //@ts-ignore
        connection.on('open', () => { 
            connection.send(StreamingEntity.PEERS.CLIENT.UUID);            
        });

        peer.on('call', call => {

            call.on('stream', stream => {
                debugger; //TODO
            });
            call.answer();
        });
    };
    
    private createPeer = ( uuid: string ) => {

        return new Peer(uuid, { host: "localhost", port: 9000 });

    };

}

export default new StreamingEntity();