import logDAO from "./logDAO";

const COLLECTION = 'reservas'
const reservaDAO = {
    db: null,
    setDb(db) {
        this.db = db;
    },
    create(reserva, userLogged = null) {
        if (userLogged) {
            logDAO.create({usuario: userLogged, log: 'Adicionou uma reserva', data_hora: new Date()})
        }
        return this.db.collection(COLLECTION).insertOne(reserva);
    },
    update(query, changes) {
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes});
    },
    cancelaReserva(id_reserva) {
        return this.update({_id: id_reserva}, {cancelado: true});
    },
    cancelaMuitasReservas(reservas) {
        const promises = [];
        for (let i = 0; i < reservas.length; i++) {
            promises.push(this.cancelaReserva(reservas[i]._id));
        }
        return Promise.all(promises);
    },
    executaReserva(id_reserva) {
        return this.update({_id: id_reserva}, {executado: true});
    },
    pagaReserva(id_reserva) {
        return this.update({_id: id_reserva}, {pago: true});
    },
    editaReserva(id_reserva, edits) {
        return this.update({_id: id_reserva}, edits);
    },
    findReservaDeCliente(profissional_id) {
        return this.db.collection(COLLECTION).find({profissional_id}).toArray();
    },
    findAll(client) {
        return client.callFunction('getAgendamentos');
    },
    getAgendamentosFromSala(agendamentos, sala) {
        let array = [];
        agendamentos.forEach(agendamento => {
            if ('sala' in agendamento) {
                if (sala.nome === agendamento.sala.nome) {
                    array.push(agendamento);
                }
            }
        });
        return array;
    }
};

export default reservaDAO;