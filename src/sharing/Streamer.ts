import Signaling from "./Signaling";

export default class Streamer {

    private signaling!: Signaling;
    private connection!: RTCPeerConnection;
    private stream: any;

    public setSignalingChannel = (signaling:Signaling) => {
        this.signaling = signaling;
    };

    public startStreaming = (stream: any) => {
        this.stream = stream;
        this.initializeConnection();
    };

    private initializeConnection = async () => {

        this.connection = new RTCPeerConnection({/* check RTCConfiguration */} as RTCConfiguration);

        this.connection.onicecandidate = (event:RTCPeerConnectionIceEvent) => {
            if (event.candidate !== null) {
                this.signaling.addViewerIceCandidate(event.candidate);
            } else {
                // received null, candidates gathering finished
            }
        };

        this.connection.onnegotiationneeded = async (data) => {            
            let offer:RTCSessionDescriptionInit = await this.connection.createOffer();
            this.connection.setLocalDescription(offer);       
            let answer:RTCSessionDescriptionInit = await this.signaling.processOffer(offer);  
            this.connection.setRemoteDescription(answer);            
        };    

        this.connection.oniceconnectionstatechange = (event:any) => {
            //
        };

        this.connection.onsignalingstatechange = (event:any) => {
            //
        };

        this.connection.onconnectionstatechange = (event:any) => {
            //
        };

        this.attachMediaTrack();
    };

    private attachMediaTrack = async (connection:RTCPeerConnection = this.connection) => {
        connection.addTrack(this.stream.getVideoTracks()?.pop());
    };

    public addIceCandidate = async (candidate:RTCIceCandidate) => {
        this.connection.addIceCandidate(candidate);
    };
}