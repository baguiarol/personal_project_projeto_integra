import { UserPasswordCredential, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

const COLLECTION = 'clientes'
const clienteDAO = {
    db: null,
    setDb(db){
        this.db = db;
    },
    async delete(query) {
        console.log('delete cliente');
        return this.db.collection(COLLECTION).deleteOne(query);
    },
    create(cliente){
        console.log('create cliente');
        return this.db.collection(COLLECTION).insertOne(cliente);
    },
    update(query, changes){
        console.log('update cliente');
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes});
    },
    editCliente(id_cliente, edits){
        console.log('edit cliente');
        return this.update({_id: id_cliente}, edits);
    },
    async addUser(client, email, password, clienteData){
        console.log('add cliente user');
        const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
        await emailPasswordClient.registerWithEmail(email, password);
        return this.create({ ...clienteData, email });
    },
    login(client, email, password){
        console.log('login cliente');
        return client.auth.loginWithCredential(new UserPasswordCredential(email, password));
    },
    findAll(){
        console.log('find all clientes');
        return this.db.collection(COLLECTION).find({}, {sort: {'nome': 1}}).toArray();
    },
    find(query) {
        console.log('find query clientes');
        return this.db.collection(COLLECTION).find(query).toArray();
    },
};
export default clienteDAO;