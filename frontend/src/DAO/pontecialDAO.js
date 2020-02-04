const COLLECTIONS = 'pontencial'

const PontencialDAO ={
    create(db,pontencial){
        return db.collection(COLLECTION).insertOne(pontencial);
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

export default PontencialDAO; 