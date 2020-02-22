import {AnonymousCredential, UserPasswordAuthProviderClient} from 'mongodb-stitch-browser-sdk';

const COLLECTION = 'administradores';

/*
    foto_url: string,
    login: string,
    nome: string,
    senha: string,
 */

const administradorDAO = {
    db: null,
    setDb(db) {
        this.db = db;
    },
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
    },
    async addUser(client, email, password, clienteData){
        const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
        await emailPasswordClient.registerWithEmail(email, password);
        return this.create({ ...clienteData, email });
    },
    anonymousLogin(client) {
        return client.auth.loginWithCredential(new AnonymousCredential());
    }
};

export default administradorDAO;