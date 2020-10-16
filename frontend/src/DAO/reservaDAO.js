import logDAO from "./logDAO";
import Moment from 'moment/min/moment-with-locales'
import {extendMoment} from "moment-range";
import salaDAO from "./salaDAO";
import clienteDAO from "./clienteDAO";

const COLLECTION = 'reservas'

const moment = extendMoment(Moment)

export const getStringDate = (date, hour) => (`${moment(date).format('yyyy-MM-DD')} ${hour}:00`)

export const checkIfIsBetween = (actualDateBegin, actualDateEnds, dateOne, dateTwo) => {
    let one = moment.range(actualDateBegin, actualDateEnds);
    let two = moment.range(dateOne, dateTwo);
    return one.overlaps(two)
}

const reservaDAO = {
    db: null,
    setDb(db) {
        this.db = db;
    },
    create(reserva) {
        return this.db.collection(COLLECTION).insertOne(reserva);
    },
    async delete(agendamentoId) {
        return this.db.collection(COLLECTION).deleteMany(agendamentoId)
    },
    update(query, changes, userLogged) {
        if (userLogged) {
            logDAO.create({usuario: userLogged, log: 'Editou uma reserva', data_hora: new Date()})
        }
        return this.db.collection(COLLECTION).updateMany(query, {$set: changes});
    },
    async cancelaReserva(reserva, userLogged) {
        if (userLogged) {
            await logDAO.create({usuario: userLogged,
            log: `Cancelou reserva ${reserva.profissional.nome} ${moment(reserva.data).format("DD-MM-YYYY")} COMPLETA ${reserva.sala.nome}`,
            data_hora: new Date()}) }
        return this.update({_id: reserva._id}, {cancelado: true});
    },
    cancelaMuitasReservas(reservas, userLogged) {
        const promises = [];
        for (let i = 0; i < reservas.length; i++) {
            promises.push(this.cancelaReserva(reservas[i], userLogged));
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
    find() {
       return this.db.collection("reservas").find({}).toArray();
    },
    findAll(client) {
        return client.callFunction('getAgendamentos');
    },
    async findAllInClient() {
        let salasArr = await salaDAO.findAll();
        let salas = salasArr.sort((a,b) => {
            let [first, second] = [ a.nome.split(' '), b.nome.split(' ') ]
            if (+first[1] > +second[1]) { return 1 }
            if (+first[1] < +second[1]) { return -1 }
            else return 0
        })
        let clientsArr = await clienteDAO.findAll();
        let hash = clienteDAO.makeProfissionaisAHash(clientsArr)
        let reservasArr = await reservaDAO.find();
        reservaDAO.putProfissional(reservasArr, hash);
        salaDAO.setSalasInAgendamentos(salas, reservasArr);
        return [salas, clientsArr, reservasArr];
        // salaDAO.findAll().then(salasArr => {
        //     let salas = salasArr.sort((a,b) => {
        //         let [first, second] = [ a.nome.split(' '), b.nome.split(' ') ]
        //         if (+first[1] > +second[1]) { return 1 }
        //         if (+first[1] < +second[1]) { return -1 }
        //         else return 0
        //     })
        //     props.setSalas(salas);
        //     clienteDAO.findAll().then(clientsArr => {
        //         props.setProfissionais(clientsArr);
        //         let hash = clienteDAO.makeProfissionaisAHash(clientsArr)
        //         props.setProfissionaisHash(hash);
        //         reservaDAO.find().then(reservasArr => {
        //             reservaDAO.putProfissional(reservasArr, hash);
        //             salaDAO.setSalasInAgendamentos(reservasArr, salas);
        //             console.log(reservasArr[1]);
        //         });
        //     });
        // });
    },
    findThisMonth(client) {
        return client.callFunction('getAgendamentosCliente');
    },
    getAgendamentosById(agendamentos, agendamento_id) {
        let agendamentoSelected = {};
        agendamentos.forEach(agendamento => {
            if (agendamento._id.toString() === agendamento_id.toString()) {
                agendamentoSelected = agendamento;
            }
        });
        return agendamentoSelected;
    },
    async cancelaParteDaReserva(reserva_id, horaInicio, horaFim, reservas, userLogged) {
        try {
            let auxReserva = reservaDAO.getAgendamentosById(reservas, reserva_id);
            if (horaInicio  === auxReserva.hora_inicio && horaFim === auxReserva.hora_fim) {
                reservaDAO.editaReserva(reserva_id, {cancelado: true});
                await logDAO.create({usuario: userLogged,
                    log: `Cancelou reserva ${auxReserva.profissional.nome} ${moment(auxReserva.data).format("DD-MM-YYYY")} COMPLETA ${auxReserva.sala.nome}`,
                    data_hora: new Date()})
            } else {
                let x = await reservaDAO.delete({_id: auxReserva._id});
                if (x.deletedCount === 0) {
                    throw new Error("Erro ao Cancelar Parte do Agendamento!");
                }
                await logDAO.create({usuario: userLogged,
                    log: `Cancelou reserva ${auxReserva.profissional.nome} ${moment(auxReserva.data).format("DD-MM-YYYY")} ${horaInicio}h-${horaFim}h ${auxReserva.sala.nome}`,
                    data_hora: new Date()})
                delete auxReserva._id;
                delete auxReserva.profissional;
                delete auxReserva.sala;
                if (horaFim === auxReserva.hora_fim) {
                    await reservaDAO.create({...auxReserva, hora_fim: horaInicio});
                    await reservaDAO.create({...auxReserva, hora_inicio: horaInicio, hora_fim: horaFim, cancelado: true})
                } else if (horaInicio === auxReserva.hora_inicio) {
                    await reservaDAO.create({...auxReserva, hora_inicio: horaInicio, hora_fim: horaFim, cancelado: true})
                    await reservaDAO.create({...auxReserva, hora_inicio: horaFim});
                } else {
                    await reservaDAO.create({...auxReserva, hora_fim: horaInicio});
                    await reservaDAO.create({...auxReserva, hora_inicio: horaInicio, hora_fim: horaFim, cancelado: true})
                    await reservaDAO.create({...auxReserva, hora_inicio: horaFim});
                }
            }
        } catch(e) {
            alert(e);
        }
    },
    async createHoraAvulsa(data, agendamentos, dateSelected, successCallback, failCallback) {
            let dateBegin = new Date(getStringDate(dateSelected, data.hora_inicio))
            let dateFim = new Date(getStringDate(dateSelected, data.hora_fim))
            let passed = true
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
        let array = [];
        agendamentos.forEach(agendamento => {
            if ('sala' in agendamento) {
                if (sala.nome === agendamento.sala.nome) {
                    array.push(agendamento);
                }
            }
        });

        array.sort((a, b) => {
            if (a.hora_inicio > b.hora_inicio) {
                return 1;
            } else if (a.hora_inicio < b.hora_inicio) {
                return -1;
            } else {
                return 0;
            }
        })
        return array;
    },
    putProfissional(agendamentos, profissionaisHash) {
        for (let agendamento of agendamentos) {
            agendamento["profissional"] = profissionaisHash[agendamento.profissional_id.toString()];
        }
    }
};

export default reservaDAO;
