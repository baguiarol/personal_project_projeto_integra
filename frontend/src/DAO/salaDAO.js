const COLLECTION = 'sala'

const salaDAO = {
    create(db,sala){
        return db.collection(COLLECTION).insertOne(sala);
    },
    update(db, query, changes) {
        return db.collection(COLLECTION).updateMany(query, {$set: changes})
    },
    delete(db, query) {
        return db.collection(COLLECTION).deleteMany(query);
    },
    findAll(db) {
        return db.collection(COLLECTION).find({}).toArray();
    }
};
export default salaDAO;