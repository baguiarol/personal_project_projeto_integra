const COLLECTION = 'logs';

const logDAO = {
    db: null,
    setDb(db) {
      this.db = db;
    },
    create(log){
        console.log('create login');
        return this.db.collection(COLLECTION).insertOne(log);
    },
    findAll(){
        console.log('find all logs');
        return this.db.collection(COLLECTION).find({}).toArray();
    }
};
export default logDAO;