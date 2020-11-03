import { RemoteMongoDatabase } from 'mongodb-stitch-browser-sdk';

const COLLECTION = 'salas';

export interface Sala {
  nome: string;
  descricao: string;
}

interface salaDAO {
  db: RemoteMongoDatabase | null;
  setDb: any;
  create: any;
  update: any;
  delete: any;
  findAll: any;
  getSalaById: any;
  setSalasInAgendamentos: any;
}

const salaDAO: salaDAO = {
  db: null,
  setDb(db) {
    this.db = db;
  },
  create(sala) {
    if (this.db) {
      return this.db.collection(COLLECTION).insertOne(sala);
    }
  },
  update(query, changes) {
    if (this.db) {
      return this.db
        .collection(COLLECTION)
        .updateMany(query, { $set: changes });
    }
  },
  delete(query) {
    if (this.db) {
      return this.db.collection(COLLECTION).deleteMany(query);
    }
  },
  findAll() {
    if (this.db) {
      return this.db.collection(COLLECTION).find({}).toArray();
    }
  },
  getSalaById(id, salas) {
    for (const sala of salas) {
      if (sala._id.toString() === id.toString()) {
        return sala;
      }
    }
    return null;
  },
  setSalasInAgendamentos(salas, agendamentos) {
    for (const agendamento of agendamentos) {
      for (const sala of salas) {
        if (sala._id.toString() === agendamento.sala_id.toString()) {
          agendamento['sala'] = sala;
        }
      }
    }
  },
};
export default salaDAO;
