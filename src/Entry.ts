import Matrix from "./Matrix";

class Entry {

    constructor() {     
      this.initialize();
    }

    private initialize = async () => {
      (await Matrix.initialize()).show();
    }

}

new Entry();