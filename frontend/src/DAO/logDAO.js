import moment from 'moment';

const COLLECTION = 'logs';

const logDAO = {
    db: null,
    setDb(db) {
      this.db = db;
    },
    create(log){
        console.log('create login');
        return this.db.collection(COLLECTION).insertOne(log);
    },
    async findAll(){
        console.time("pegar logs e ordenar");
        const logs = await this.db.collection(COLLECTION).find({}).toArray();
        console.log('found all logs');
        logs.sort((a, b) => {
            if (moment(new Date(a.data_hora)).isBefore(new Date(b.data_hora))) {
                return 1;
            } else {
                return -1;
            }
        });
        console.timeEnd("pegar logs e ordenar");
        return logs;
    }
};
export default logDAO;