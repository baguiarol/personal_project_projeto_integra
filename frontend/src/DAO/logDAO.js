const COLLECTION = 'logs';

const logDAO = {
    db: null,
    setDb(db) {
      this.db = db;
    },
    create(log){
        return this.db.collection(COLLECTION).insertOne(log);
    },
    findAll(){
        return this.db.collection(COLLECTION).find({}).toArray();
    }
};
export default logDAO;