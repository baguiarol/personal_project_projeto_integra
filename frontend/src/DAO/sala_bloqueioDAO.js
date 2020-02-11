const COLLECTION = 'sala_bloqueio'

const sala_bloqueioDAO = {
    create(db, salaBloqueio){
        return db.collection(COLLECTION).insertOne(salaBloqueio);

    },
    delete(db, query){
        return db.collection(COLLECTION).deleteMany(query);
        
    },
    findAll(db){
        return db.collection(COLLECTION).find({}).toArray();
    }
};
export default sala_bloqueioDAO;