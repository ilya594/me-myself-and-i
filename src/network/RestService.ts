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

    public getSnapshot = async (month: string, name: string) => {

      const response = await axios.get(this.SERVER_URL + 'snapshot', {
        params: {
          month: month,
          name: name,
        }
      });

      const url: string = 'data:image/png;base64,'.concat(response.data as string);

      return url;
    }  

    public deleteSnapshot = async (month: string, name: string) => {
      const response = await axios.get(this.SERVER_URL + 'delsnapshot', {
        params: {
          month: month,
          name: name,
        }
      });

      return response.data;
    };

    public getFilesList = () => {
      return axios.get(this.SERVER_URL + 'lsall');
    };

    public validatePrediction = async (prediction: any) => {
      const response = await axios.get(this.SERVER_URL + 'valprediction', {
        params: {
          prediction: prediction,
        }
      });
      return response.data;
    };
}

export default new RestService();