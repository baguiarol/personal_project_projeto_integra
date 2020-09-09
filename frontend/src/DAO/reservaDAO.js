import logDAO from "./logDAO";
import Moment from 'moment/min/moment-with-locales'
import {extendMoment} from "moment-range";

const COLLECTION = 'reservas'

const moment = extendMoment(Moment)

const getStringDate = (date, hour) => (`${moment(date).format('yyyy-MM-DD')} ${hour}:00`)

const checkIfIsBetween = (actualDateBegin, actualDateEnds, dateOne, dateTwo) => {
    let one = moment.range(actualDateBegin, actualDateEnds);
    let two = moment.range(dateOne, dateTwo);
    return one.overlaps(two)
}

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
    delete(agendamentoId) {
        return this.db.collection(COLLECTION).deleteMany(agendamentoId)
    },
    update(query, changes, userLogged) {
        if (userLogged) {
            logDAO.create({usuario: userLogged, log: 'Editou uma reserva', data_hora: new Date()})
        }
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes});
    },
    cancelaReserva(id_reserva, userLogged) {
        if (userLogged) { logDAO.create({usuario: userLogged, log: 'Cancelou uma reserva', data_hora: new Date()}) }
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
        return this.update({_id: id_reserva}, {executado: true, execucao_fim: new Date()});
    },
    pagaReserva(id_reserva, pago, userLogged) {
        if (userLogged) {
            logDAO.create({usuario: userLogged, log: 'Colocou uma reserva em situação de '+ (pago ? 'pago' : 'pendência de pagamento'), data_hora: new Date()})
        }
        console.log('Paga reserva');
        return this.update({_id: id_reserva}, {pago: pago});
    },
    editaReserva(id_reserva, edits) {
        console.log('Edita reserva');
        return this.update({_id: id_reserva}, edits);
    },
    comecaReserva(id_reserva) {
        console.log('Começa a executar a reserva');
        return this.update({_id: id_reserva}, {execucao_inicio: new Date()});
    },
    findReservaDeCliente(profissional_id, reservas) {
        console.log('Find Reserva de Cliente');
        let profissionalReservas = [];
        reservas.forEach(reserva => {
            if (reserva.profissional) {
                if (reserva.profissional._id.toString() === profissional_id.toString())
                    profissionalReservas.push(reserva);
            }
        });
        return profissionalReservas;
    },
    findAll(client) {
        console.log('Find All de Cliente');
        return client.callFunction('getAgendamentos');
    },
    getAgendamentosById(agendamentos, agendamento_id) {
        let agendamentoSelected = null;
        agendamentos.forEach(agendamento => {
            if (agendamento._id.toString() === agendamento_id.toString()) {
                agendamentoSelected = agendamento;
            }
        });
        return agendamentoSelected;
    },
    async cancelaParteDaReserva(reserva_id, horaInicio, horaFim, reservas) {
        let auxReserva = reservaDAO.getAgendamentosById(reservas, reserva_id);
        delete auxReserva.profissional;
        delete auxReserva.sala;
        if (horaInicio  === auxReserva.hora_inicio && horaFim === auxReserva.hora_fim) {
            reservaDAO.editaReserva(reserva_id, {cancelado: true});
        } else {
            console.log(auxReserva._id.toString())
            await reservaDAO.delete({_id: auxReserva._id})
            delete auxReserva._id;
            await reservaDAO.create({...auxReserva, hora_fim: horaInicio});
            await reservaDAO.create({...auxReserva, hora_inicio: horaInicio, hora_fim: horaFim, cancelado: true})
            await reservaDAO.create({...auxReserva, hora_inicio: horaFim});
        }
        // await reservaDAO.editaReserva(reserva_id, {horasCanceladas: [horaInicio, horaFim]})
    },
    async createHoraAvulsa(data, agendamentos, dateSelected, successCallback, failCallback) {
            let dateBegin = new Date(getStringDate(dateSelected, data.hora_inicio))
            let dateFim = new Date(getStringDate(dateSelected, data.hora_fim))
            let passed = true
            console.log(agendamentos)
            console.log(data)
            if (data.hora_inicio <= 0 || data.hora_fim <= 0) {
                passed = false
                failCallback()
            } else {
                for (let agendamento of agendamentos) {
                    // Checagem de ERRO
                    let dateInicioAgendamento =
                            new Date(getStringDate(new Date(agendamento.data), agendamento.hora_inicio)),
                        dateFimAgendamento =
                            new Date(getStringDate(new Date(agendamento.data), agendamento.hora_fim))
                    if (!agendamento.cancelado && agendamento.sala_id.toString() === data.sala_id.toString()) {
                        if (checkIfIsBetween(dateBegin, dateFim, dateInicioAgendamento, dateFimAgendamento)) {
                                passed = false
                                failCallback()
                                break;
                            }
                        }
                    }
                if (passed) {
                    successCallback()
                }
            }

    },
    getAgendamentosFromSala(agendamentos, sala) {
        console.log('get Agendamentos da sala');
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
