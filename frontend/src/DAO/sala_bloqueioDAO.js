const COLLECTION = 'sala_bloqueios'

const sala_bloqueioDAO = {
    db: null,
    setDb(db) {
        this.db = db
    },
    create(salaBloqueio){
        return this.db.collection(COLLECTION).insertOne(salaBloqueio);

    },
    delete(query){
        return this.db.collection(COLLECTION).deleteMany(query);

    },
    findAll(){
        return this.db.collection(COLLECTION).find({}).toArray();
    }
};
export default sala_bloqueioDAO;
