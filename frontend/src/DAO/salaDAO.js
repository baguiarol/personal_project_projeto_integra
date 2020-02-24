const COLLECTION = 'salas'

const salaDAO = {
    db: null,
    setDb(db) {
        this.db = db;
    },
    create(sala){
        return this.db.collection(COLLECTION).insertOne(sala);
    },
    update(query, changes) {
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes})
    },
    delete(query) {
        return this.db.collection(COLLECTION).deleteMany(query);
    },
    findAll() {
        return this.db.collection(COLLECTION).find({}).toArray();
    }
};
export default salaDAO;