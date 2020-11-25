import { RemoteMongoDatabase } from 'mongodb-stitch-browser-sdk';

const COLLECTION = 'notifications';

export interface Notificacao {
  titulo: string;
  texto: object;
  enviar_para: 'all' | Array<unknown>;
  visto_por: Array<unknown>;
  criadoAs: Date;
  dataExpiracao: Date;
}

interface NotificacaoDAO {
  db: RemoteMongoDatabase | null;
  setDb: (db: RemoteMongoDatabase) => any;
  findAll: () => any;
  update: (query: any, changes: any) => any;
  insert: (notification: any) => any;
}

const NotificacaoDAO: NotificacaoDAO = {
  db: null,
  setDb(db: RemoteMongoDatabase) {
    this.db = db;
  },
  findAll() {
    if (this.db) {
      return this.db.collection(COLLECTION).find({}).toArray();
    }
  },
  update(query: any, changes: any) {
    if (this.db) {
      return this.db
        .collection(COLLECTION)
        .updateMany(query, { $set: changes });
    }
  },
  insert(notification) {
    if (this.db) {
      return this.db.collection(COLLECTION).insertOne(notification);
    }
  },
};

export default NotificacaoDAO;
