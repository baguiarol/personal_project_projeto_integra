// eslint-disable-this-file @typescript-eslint/ban-ts-comment

import logDAO from './logDAO';
import Moment from 'moment';
import salaDAO, { Sala } from './salaDAO';
import clienteDAO, { Profissional } from './clienteDAO';
import { RemoteMongoDatabase } from 'mongodb-stitch-browser-sdk';
import { extendMoment } from 'moment-range';
const COLLECTION = 'reservas';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const moment = extendMoment(Moment);

export const getStringDate = (date, hour) =>
  `${moment(date).format('yyyy-MM-DD')} ${hour}:00`;

export interface Reserva {
  _id?: object;
  hora_inicio: number;
  hora_fim: number;
  cancelado: boolean;
  pago: boolean;
  sala_id: object;
  data: Date;
  profissional_id: object;
  profissional?: Profissional;
  sala?: Sala;
}

const OverlappingRanges = (r1_start, r1_finish, r2_start, r2_finish) => {
  const [arr1, arr2] = [[], []];
  for (let i = r1_start; i < r1_finish; i++) {
    // @ts-ignore
    arr1.push(i);
  }
  for (let i = r2_start; i < r2_finish; i++) {
    // @ts-ignore
    arr2.push(+i);
  }
  console.log(arr1, arr2);

  for (const el of arr1) {
    if (arr2.includes(el)) {
      return true;
    }
  }
  return false;
};

const reservaDAO: any = {
  db: null,
  setDb(db: RemoteMongoDatabase) {
    this.db = db;
  },
  create(reserva: Reserva) {
    if (this.db) {
      return this.db.collection(COLLECTION).insertOne(reserva);
    }
  },
  async delete(agendamentoId: object) {
    if (this.db) {
      return this.db.collection(COLLECTION).deleteMany(agendamentoId);
    }
  },
  async update(query: object, changes: object, userLogged?: object) {
    try {
      if (userLogged) {
        logDAO.create({
          usuario: userLogged,
          log: 'Editou uma reserva',
          data_hora: new Date(),
        });
      }
      if (this.db) {
        await this.db
          .collection(COLLECTION)
          .updateMany(query, { $set: changes });
      }
    } catch (e) {
      alert(e);
    }
  },
  async cancelaReserva(reserva: Reserva, userLogged?: object) {
    if (userLogged && reserva.profissional && reserva.sala) {
      await logDAO.create({
        usuario: userLogged,
        log: `Cancelou reserva ${reserva.profissional.nome} ${moment(
          reserva.data
        ).format('DD-MM-YYYY')} COMPLETA ${reserva.sala.nome}`,
        data_hora: new Date(),
      });
    }
    return this.update({ _id: reserva._id }, { cancelado: true });
  },
  cancelaMuitasReservas(reservas, userLogged) {
    const promises: Array<Promise<object>> = [];
    for (let i = 0; i < reservas.length; i++) {
      promises.push(this.cancelaReserva(reservas[i], userLogged));
    }
    return Promise.all(promises);
  },
  executaReserva(id_reserva) {
    return this.update(
      { _id: id_reserva },
      { executado: true, execucao_fim: new Date() }
    );
  },
  pagaReserva(id_reserva, pago, userLogged) {
    if (userLogged) {
      logDAO.create({
        usuario: userLogged,
        log:
          'Colocou uma reserva em situação de ' +
          (pago ? 'pago' : 'pendência de pagamento'),
        data_hora: new Date(),
      });
    }
    console.log('Paga reserva');
    return this.update({ _id: id_reserva }, { pago: pago });
  },
  async editaReserva(id_reserva: object, edits: object) {
    await this.update({ _id: id_reserva }, edits);
  },
  comecaReserva(id_reserva) {
    console.log('Começa a executar a reserva');
    return this.update({ _id: id_reserva }, { execucao_inicio: new Date() });
  },
  findReservaDeCliente(profissional_id: object, reservas: Array<Reserva>) {
    const profissionalReservas: Array<Reserva> = [];
    reservas.forEach((reserva: Reserva) => {
      if ('profissional' in reserva && reserva.profissional) {
        // @ts-ignore
        if (reserva.profissional._id.toString() === profissional_id.toString())
          profissionalReservas.push(reserva);
      }
    });
    return profissionalReservas;
  },
  find() {
    if (this.db) {
      return this.db.collection('reservas').find({}).toArray();
    }
  },
  findAll(client) {
    return client.callFunction('getAgendamentos');
  },
  async findAllInClient() {
    const salasArr = await salaDAO.findAll();
    const salas = salasArr.sort((a, b) => {
      const [first, second] = [a.nome.split(' '), b.nome.split(' ')];
      if (+first[1] > +second[1]) {
        return 1;
      }
      if (+first[1] < +second[1]) {
        return -1;
      } else return 0;
    });
    const clientsArr = await clienteDAO.findAll();
    const hash = clienteDAO.makeProfissionaisAHash(clientsArr);
    const reservasArr = await reservaDAO.find();
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
  prepareReservaWithAllData(reserva, profissionais, salas) {
    const arr = [reserva];
    const hash = clienteDAO.makeProfissionaisAHash(profissionais);
    salaDAO.setSalasInAgendamentos(salas, arr);
    reservaDAO.putProfissional(arr, hash);
    return arr[0];
  },
  async trocaSala(
    allAgendamentos: Array<Reserva>,
    agendamentoSelected: Reserva,
    userLogged: any,
    editarSala: { id: any; label: string },
    loadingCallback: () => void,
    successCallback: () => void
  ) {
    if (editarSala) {
      const agendamentos = reservaDAO.getAgendamentosFromSala(allAgendamentos, {
        nome: editarSala.label,
      });
      const r2 = moment.range(
        new Date(
          getStringDate(
            new Date(agendamentoSelected.data),
            agendamentoSelected.hora_inicio
          )
        ),
        new Date(
          getStringDate(
            new Date(agendamentoSelected.data),
            agendamentoSelected.hora_fim
          )
        )
      );
      for (const agendamento of agendamentos) {
        const r1 = moment.range(
          new Date(
            getStringDate(new Date(agendamento.data), agendamento.hora_inicio)
          ),
          new Date(
            getStringDate(new Date(agendamento.data), agendamento.hora_fim)
          )
        );
        if (r1.overlaps(r2) && !agendamento.cancelado) {
          if (
            window.confirm(
              'O horário já se encontra reservado na sala requerida. Deseja realizar uma troca?'
            )
          ) {
            if (
              agendamentoSelected.hora_fim - agendamentoSelected.hora_inicio ===
              agendamento.hora_fim - agendamento.hora_inicio
            ) {
              const logString = `Trocou de sala da reserva ${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                agendamentoSelected.profissional.nome
              } ${moment(agendamentoSelected.data).format('DD-MM-YYYY')} ${
                agendamentoSelected.hora_inicio
              }h-${agendamentoSelected.hora_fim}h ${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                agendamentoSelected.sala.nome
                //@ts-ignore
              } para sala ${editarSala.label} com ${
                agendamento.profissional.nome
              }.`;
              loadingCallback();
              await reservaDAO.editaReserva(agendamentoSelected._id, {
                sala_id: editarSala.id,
              });
              await reservaDAO.editaReserva(agendamento._id, {
                sala_id: agendamentoSelected.sala_id,
              });
              await logDAO.create({
                usuario: userLogged,
                log: logString,
                data_hora: new Date(),
              });
              successCallback();
            } else {
              alert(
                'As duas reservas precisam ser dos mesmos horários para realizar este tipo de troca.'
              );
            }
            return;
          } else {
            return;
          }
        }
      }
      loadingCallback();
      if ('profissional' in agendamentoSelected) {
        await logDAO.create({
          usuario: userLogged,
          log: `Trocou sala da reserva ${
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            agendamentoSelected.profissional.nome
          } ${moment(agendamentoSelected.data).format('DD-MM-YYYY')} ${
            agendamentoSelected.hora_inicio
          }h-${agendamentoSelected.hora_fim}h ${
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            agendamentoSelected.sala.nome
          } para sala ${editarSala.label}`,
          data_hora: new Date(),
        });
      }
      await reservaDAO.editaReserva(agendamentoSelected._id, {
        sala_id: editarSala.id,
      });
      successCallback();
    }
  },
  async findThisMonth(client) {
    return await client.callFunction('getAgendamentosCliente');
  },
  getAgendamentosById(agendamentos, agendamento_id): Reserva | {} {
    let agendamentoSelected: Reserva | any;
    agendamentos.forEach((agendamento) => {
      if (agendamento._id.toString() === agendamento_id.toString()) {
        agendamentoSelected = agendamento;
      }
    });
    return agendamentoSelected;
  },
  async cancelaParteDaReserva(
    reserva_id,
    horaInicio,
    horaFim,
    reservas,
    userLogged
  ) {
    try {
      const auxReserva: Reserva = reservaDAO.getAgendamentosById(
        reservas,
        reserva_id
      );
      if ('hora_inicio' in auxReserva && 'profissional' in auxReserva) {
        if (
          horaInicio === auxReserva.hora_inicio &&
          horaFim === auxReserva.hora_fim
        ) {
          reservaDAO.editaReserva(reserva_id, { cancelado: true });
          await logDAO.create({
            usuario: userLogged,
            // @ts-ignore
            log: `Cancelou reserva ${auxReserva.profissional.nome} ${moment(
              auxReserva.data
              // @ts-ignore
            ).format('DD-MM-YYYY')} COMPLETA ${auxReserva.sala.nome}`,
            data_hora: new Date(),
          });
        } else {
          const x = await reservaDAO.delete({ _id: auxReserva._id });
          if (x.deletedCount === 0) {
            new Error('Erro ao Cancelar Parte do Agendamento!');
          }
          await logDAO.create({
            usuario: userLogged,
            //@ts-ignore
            log: `Cancelou reserva ${auxReserva.profissional.nome} ${moment(
              auxReserva.data
            ).format('DD-MM-YYYY')} ${horaInicio}h-${horaFim}h ${
              //@ts-ignore
              auxReserva.sala.nome
            }`,
            data_hora: new Date(),
          });
          delete auxReserva._id;
          delete auxReserva.profissional;
          delete auxReserva.sala;
          if (horaFim === auxReserva.hora_fim) {
            await reservaDAO.create({ ...auxReserva, hora_fim: horaInicio });
            await reservaDAO.create({
              ...auxReserva,
              hora_inicio: horaInicio,
              hora_fim: horaFim,
              cancelado: true,
            });
          } else if (horaInicio === auxReserva.hora_inicio) {
            await reservaDAO.create({
              ...auxReserva,
              hora_inicio: horaInicio,
              hora_fim: horaFim,
              cancelado: true,
            });
            await reservaDAO.create({ ...auxReserva, hora_inicio: horaFim });
          } else {
            await reservaDAO.create({ ...auxReserva, hora_fim: horaInicio });
            await reservaDAO.create({
              ...auxReserva,
              hora_inicio: horaInicio,
              hora_fim: horaFim,
              cancelado: true,
            });
            await reservaDAO.create({ ...auxReserva, hora_inicio: horaFim });
          }
        }
      }
    } catch (e) {
      alert(e);
    }
  },
  async createHoraAvulsa(
    data,
    agendamentos,
    dateSelected,
    successCallback,
    failCallback
  ) {
    try {
      const dateBegin = new Date(getStringDate(dateSelected, data.hora_inicio));
      const dateFim = new Date(getStringDate(dateSelected, data.hora_fim));
      let passed = true;
      if (data.hora_inicio <= 0 || data.hora_fim <= 0) {
        passed = false;
        failCallback();
      } else {
        for (const agendamento of agendamentos) {
          if (
            !agendamento.cancelado &&
            agendamento.sala_id.toString() === data.sala_id.toString()
          ) {
            const x = OverlappingRanges(
              data.hora_inicio,
              data.hora_fim,
              agendamento.hora_inicio,
              agendamento.hora_fim
            );
            console.log('Verificação de Hora com Overlapping Ranges', x);
            if (x) {
              passed = false;
              failCallback();
              break;
            }
          }
        }
        if (passed) {
          successCallback();
        }
      }
    } catch (e) {
      alert(e);
    }
  },
  getAgendamentosFromSala(agendamentos, sala_obj) {
    const array: Array<Reserva> = [];
    agendamentos.forEach((agendamento: Reserva) => {
      if ('sala' in agendamento) {
        const { sala } = agendamento;
        if (sala) {
          if (sala_obj.nome === sala.nome) {
            array.push(agendamento);
          }
        }
      }
    });

    array.sort((a: Reserva, b: Reserva) => {
      if (a.hora_inicio > b.hora_inicio) {
        return 1;
      } else if (a.hora_inicio < b.hora_inicio) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;
  },
  putProfissional(agendamentos, profissionaisHash) {
    for (const agendamento of agendamentos) {
      agendamento['profissional'] =
        profissionaisHash[agendamento.profissional_id.toString()];
    }
  },
};

export default reservaDAO;
