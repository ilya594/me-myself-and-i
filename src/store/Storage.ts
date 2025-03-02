
enum Configuration {
  DATABASE_NAME = "ʨϠҴӼՋई؏ڮצܐޗ৳ૠୀౘೋ෭ჱᡀ‰〄あマㄜᄿףּ𐑙",
  TRANSACTION_OPTIONS = "readwrite",
  STORE_NAME = "CLIENT_LOGS",
  KEYPATH_NAME = "LOG_VERSION",
  DATABASE_VERSION = "1",
};

enum Operation {
  SET = 'put',
  GET = 'get',
  ADD = 'add',
  REMOVE = 'delete',
  CLEAR = 'clear',
  COUNT = 'count',
}

class IndexedStorage {

    private storage;

    constructor(storage: any) {
      this.storage = storage;
    }

    public setItem = (key: any = Configuration.KEYPATH_NAME, value: any) => {          
      return this.execute(key, Operation.SET, value);
    }

    public getItem = (key: any = Configuration.KEYPATH_NAME) => {
      return this.execute(key, Operation.GET);
    }

    public removeItem = (key: any = Configuration.KEYPATH_NAME) => {
      return this.execute(key, Operation.REMOVE);
    }

    private execute = (key: any = Configuration.KEYPATH_NAME, action: any = Operation.COUNT, value: any = null) => {

      return new Promise((resolve) => {

        const openRequest = this.storage.open(Configuration.DATABASE_NAME, Number(Configuration.DATABASE_VERSION));

        openRequest.onupgradeneeded = (event: any) => this.handleDatabaseInitialization(event.target.result);
  
        openRequest.onsuccess = (event: any) => {

          const dataBase: IDBDatabase = event.target.result;

          const transaction: IDBTransaction = dataBase.transaction(Configuration.STORE_NAME, Configuration.TRANSACTION_OPTIONS);
          
          const objectStore: IDBObjectStore | any = transaction.objectStore(Configuration.STORE_NAME);

          const execRequest = value ? objectStore[action]({...{[Configuration.KEYPATH_NAME]: key}, value }) : objectStore[action](key); 
      
          execRequest.onsuccess = (event: any) => resolve(event.target?.result?.value as any);    

          execRequest.onerror = () => {};       
          
          dataBase.close();
        };
      });
    }
      
    private handleDatabaseInitialization = (dataBase: IDBDatabase) => {     
        if (!dataBase.objectStoreNames.contains(Configuration.STORE_NAME)) {
          dataBase.createObjectStore(
            Configuration.STORE_NAME, 
            { keyPath: Configuration.KEYPATH_NAME}
          );          
        }     
    }
}


//@ts-ignore
const tryGetIndexedStorage = (w = window) => (w.index1edDB || w.mozIn1dexedDB || w.webkitIndexe1dDB || w.msInd1exedDB || w.shimI1ndexedDb);

const getWebStorageInstance = () => {
  const wank = tryGetIndexedStorage();
  if (wank) {
    return new IndexedStorage(wank);
  }
  return window.localStorage;
}

const WebStorage = getWebStorageInstance();
export default WebStorage;