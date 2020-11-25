import {
  UserPasswordCredential,
  UserPasswordAuthProviderClient,
  RemoteMongoDatabase,
} from 'mongodb-stitch-browser-sdk';
import logDAO from './logDAO';
import { Reserva } from './reservaDAO';

const COLLECTION = 'clientes';

export interface Profissional {
  nome: string;
  _id?: object;
  email: string;
  foto_url?: string;
  creditos: number;
}

interface clienteDAO {
  db: RemoteMongoDatabase | null;
  setDb: any;
  delete: any;
  create: any;
  update: any;
  editCliente: any;
  registerAuth: any;
  addUser: any;
  login: any;
  findAll: any;
  find: any;
  fixarSalaNoTopo: any;
  makeProfissionaisAHash: any;
  getProfissionalById: (
    profissionais: Array<Profissional>,
    profissional_id: unknown
  ) => Profissional;
}

// @ts-ignore
const clienteDAO: clienteDAO = {
  db: null,
  setDb(db) {
    this.db = db;
  },
  async delete(query) {
    console.log('delete cliente');
    if (this.db) {
      return this.db.collection(COLLECTION).deleteOne(query);
    }
  },
  create(cliente) {
    console.log('create cliente');
    if (this.db) {
      return this.db.collection(COLLECTION).insertOne(cliente);
    }
  },
  update(query, changes) {
    if (this.db) {
      return this.db
        .collection(COLLECTION)
        .updateMany(query, { $set: changes });
    }
  },
  editCliente(id_cliente, edits) {
    console.log('edit cliente');
    return this.update({ _id: id_cliente }, edits);
  },
  async registerAuth(client, email, password) {
    const emailPasswordClient = client.auth.getProviderClient(
      UserPasswordAuthProviderClient.factory
    );
    try {
      await emailPasswordClient.registerWithEmail(email, password);
    } catch (err) {
      alert(
        'O usuário de e-mail já foi definido e talvez deletado anteriormente. Para redefinir ' +
          'senha, por favor, peça ao usuário que vá em "Esqueceu sua Senha?" na tela de Login.'
      );
    }
  },
  async addUser(client, email, password, clienteData, userLogged) {
    console.log('add cliente user');
    if (userLogged) {
      logDAO.create({
        usuario: userLogged,
        log: 'Adicionou ' + clienteData.nome + ' a lista de profissionais.',
        data_hora: new Date(),
      });
    }
    await this.registerAuth(client, email, password);
    return this.create({ ...clienteData, email });
  },
  login(client, email, password) {
    return client.auth.loginWithCredential(
      new UserPasswordCredential(email, password)
    );
  },
  findAll() {
    if (this.db) {
      return this.db
        .collection(COLLECTION)
        .find({}, { sort: { nome: 1 } })
        .toArray();
    }
  },
  find(query) {
    if (this.db) {
      return this.db.collection(COLLECTION).find(query).toArray();
    }
  },
  fixarSalaNoTopo(sala, user) {
    if (this.db) {
      if (user.sala_fixa) {
        if (user.sala_fixa.toString() === sala._id.toString()) {
          return this.db
            .collection(COLLECTION)
            .updateOne({ _id: user._id }, { $set: { sala_fixa: null } });
        }
      }
      return this.db
        .collection(COLLECTION)
        .updateOne({ _id: user._id }, { $set: { sala_fixa: sala._id } });
    }
  },
  makeProfissionaisAHash(profissionaisArray) {
    const dict = {};
    for (const profissional of profissionaisArray) {
      dict[profissional._id.toString()] = profissional;
    }
    return dict;
  },
  getProfissionalById(
    profissionais: Array<Profissional>,
    profissional_id: any
  ): Profissional {
    let profissionalSelected: Profissional | any;
    profissionais.forEach((profissional) => {
      if (profissional._id) {
        if (profissional._id.toString() === profissional_id.toString()) {
          profissionalSelected = profissional;
        }
      }
    });
    return profissionalSelected;
  },
};

export default clienteDAO;
