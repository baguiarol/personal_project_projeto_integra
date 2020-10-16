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
        console.log('created administrador');
        return this.db.collection(COLLECTION).insertOne(adm);
    },
    update(query, changes) {
        console.log('update administrador');
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes})
    },
    delete(query) {
        console.log('delete administrador');
        return this.db.collection(COLLECTION).deleteMany(query);
    },
    findAll() {
        console.log('find administrador');
        return this.db.collection(COLLECTION).find({}).toArray();
    },
    async addUser(client, email, password, clienteData) {
        console.log('add User');
        const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
        try {
            const array = await administradorDAO.find({email: email})
            if (array.length > 0) {
                alert('Administrador já existe com esse email.');
            } else {
                await emailPasswordClient.registerWithEmail(email, password);
                return this.create({...clienteData, email});
            }
        } catch (e) {
            alert('ATENÇÃO: Já existe um profissional com esse e-mail, ' +
                'por favor, considere a SENHA do profissional já cadastrado. Essa conta agora terá ' +
                'privilégios administrativos.')
            return this.create({...clienteData, email});
        }
    },
    anonymousLogin(client) {
        console.log('Anonymous Login');
        return client.auth.loginWithCredential(new AnonymousCredential());
    },
    find(query) {
        console.log('Query administrador');
        return this.db.collection(COLLECTION).find(query).toArray();
    },
    userPasswordLogin(client, user, password) {
        console.log('User Password Login');
        const credentials = new UserPasswordCredential(user, password);
        return client.auth.loginWithCredential(credentials);
    }
};

export default administradorDAO;
