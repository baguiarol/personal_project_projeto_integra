const COLLECTION = 'administradores';

const administradorDAO = {
    create(db, adm) {
        return db.collection(COLLECTION).insertOne(adm);
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
export default administradorDAO;