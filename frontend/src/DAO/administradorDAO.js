import {AnonymousCredential, UserPasswordAuthProviderClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk';

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
    create(adm) {
        return this.db.collection(COLLECTION).insertOne(adm);
    },
    update(query, changes) {
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes})
    },
    delete(query) {
        return this.db.collection(COLLECTION).deleteMany(query);
    },
    findAll() {
        return this.db.collection(COLLECTION).find({}).toArray();
    },
    async addUser(client, email, password, clienteData){
        const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
        await emailPasswordClient.registerWithEmail(email, password);
        return this.create({ ...clienteData, email });
    },
    anonymousLogin(client) {
        return client.auth.loginWithCredential(new AnonymousCredential());
    },
    find(query) {
        return this.db.collection(COLLECTION).find(query).toArray();
    },
    userPasswordLogin(client, user, password) {
        const credentials = new UserPasswordCredential(user, password);
        return client.auth.loginWithCredential(credentials);
    }
};

export default administradorDAO;