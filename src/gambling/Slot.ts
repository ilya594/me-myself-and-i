import { AppController } from "./AppController";



class Slot {
    constructor() {
        debugger;
    }

    public start = () => {
        let controller = new AppController();
        controller.initialize();
    }
}

class Reel {
    
    private shots: Array<any>;

    constructor() {

    }


}

export default new Slot();