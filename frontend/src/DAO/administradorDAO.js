import {AnonymousCredential} from 'mongodb-stitch-browser-sdk';

const COLLECTION = 'administradores';

/*
    foto_url: string,
    login: string,
    nome: string,
    senha: string,
 */

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
    },
    anonymousLogin(client) {
        return client.auth.loginWithCredential(new AnonymousCredential());
    }
};

export default administradorDAO;