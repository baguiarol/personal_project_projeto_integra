import { UserPasswordCredential, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

const COLLECTION = 'clientes'
const clienteDAO = {
    db: null,
    setDb(db){
        this.db = db;
    },
    create(cliente){
        return this.db.collection(COLLECTION).insertOne(cliente);
    },
    update(query, changes){
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes});
    },
    editCliente(id_cliente, edits){
        return this.update({_id: id_cliente}, edits);
    },
    async addUser(client, email, password, clienteData){
        const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
        await emailPasswordClient.registerWithEmail(email, password);
        return this.create({ ...clienteData, email });
    },
    login(client, email, password){
        return client.auth.loginWithCredential(new UserPasswordCredential(email, password));
    },
    findAll(){
        return this.db.collection(COLLECTION).find({}).toArray();
    }
};
export default clienteDAO;