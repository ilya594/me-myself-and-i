import * as Events from "../utils/Events";    
import axios from "axios";

export class RestService extends Events.EventHandler {

    private SERVER_URL: string = 'https://nodejs-http-server.onrender.com/';
    private TIME_ZONE: string = 'Europe/Kyiv';

    constructor() {
        super();
    }

    public initialize = async () => {
        return this;
    }

    public sendSnaphot = (snapshot: string) => {

     const name: string = new Date().toLocaleString('ua-UA', { timeZone: this.TIME_ZONE })
      .replace(/:/g, '.').replace(', ', '-') + '.png';
  
      axios({
        method: 'post',
        url: this.SERVER_URL + 'snapshot',
        data: { file: snapshot, name: name }, 
      });      
    }

    public getFilesList = () => {
      return axios.get(this.SERVER_URL + 'lsall');
    };
}

export default new RestService();