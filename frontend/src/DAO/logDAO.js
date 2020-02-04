const COLLECTION = 'logs'

const logDAO = {
    create(db, log){
        return db.collection(COLLECTION).insertOne(log);
    },
    findAll(db){
        return db.collection(COLLECTION).find({}).toArray();
    }
};
export default logDAO;