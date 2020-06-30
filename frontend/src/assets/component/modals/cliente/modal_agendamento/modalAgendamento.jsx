import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import ModalParent from "../../modal_parent/modal";
import Options from "./tipos/options";
import {connect} from "react-redux";
import Moment from "moment/min/moment-with-locales";
import {extendMoment} from "moment-range";
import reservaDAO from "../../../../../DAO/reservaDAO";
import Actions from "../../../../../redux/actions/actions";

const moment = extendMoment(Moment)

const ModalAgendamento = ({
                              show,
                              close,
                              dateSelected,
                              userLogged,
                              salaSelected,
                              setAgendamentos,
                              mongoClient,
                              agendamentos,
                              setProfissionalReservas
                          }) => {

        const [loading, setLoading] = React.useState(false);
        const [selectedPage, selectPage] = React.useState('Hora Avulsa');
        const [selectedTurno, selectTurno] = React.useState({});
        const [selectedMes, selectMes] = React.useState(null);

        const checkIfIsBetween = (actualDateBegin, actualDateEnds, dateOne, dateTwo) => {
            let one = moment.range(actualDateBegin, actualDateEnds);
            let two = moment.range(dateOne, dateTwo);
            console.log(two)
            console.log(one)
            console.log('Checou, resultado: '+one.overlaps(two))
            return one.overlaps(two)
        }

        const prepareData = form => {
            let data = {
                profissional_id: userLogged._id,
                sala_id: salaSelected._id,
                data: dateSelected,
                cancelado: false,
                pago: false,
                executado: false,
            };
            switch (selectedPage) {
                case 'Hora Avulsa':
                    return {
                        ...data,
                        hora_inicio: Number(form.hora_inicio.value),
                        hora_fim: Number(form.hora_fim.value),
                        valorTotal: Number((salaSelected.valor_hora *
                            (Number(form.hora_fim.value) - Number(form.hora_inicio.value))).toFixed(2)),
                    };
                case 'Turno':
                    return {
                        ...data,
                        ...selectedTurno,
                        valorTotal: salaSelected.valor_hora * (selectedTurno.hora_fim - selectedTurno.hora_inicio)
                    }
                case 'Mensal':
                    return {
                        ...data,
                        mes: selectedMes,
                        valorTotal: 3500
                    }
            }
        }

        const getStringDate = (date, hour) => (`${moment(date).format('yyyy-MM-DD')} ${hour}:00`)

        const handleSubmit = async e => {
            e.preventDefault();
            const form = e.target;
            setLoading(true);
            let data = prepareData(form);
            if (selectedPage === 'Hora Avulsa') {
                let dateBegin = new Date(getStringDate(dateSelected, data.hora_inicio))
                let dateFim = new Date(getStringDate(dateSelected, data.hora_fim))
                let passed = true
                console.log('É hora avulsa')
                for (let agendamento of agendamentos) {
                    let dateInicioAgendamento =
                            new Date(getStringDate(new Date(agendamento.data), agendamento.hora_inicio)),
                        dateFimAgendamento =
                            new Date(getStringDate(new Date(agendamento.data), agendamento.hora_fim))

                        if (checkIfIsBetween(dateBegin, dateFim, dateInicioAgendamento, dateFimAgendamento)) {
                            alert("Erro! O horário já se encontra reservado.");
                            passed = false
                            setLoading(false)
                            close();
                            break;
                        }
                }
                if (passed) {
                    await reservaDAO.create(data, userLogged);
                    let novasReservas = await reservaDAO.findAll(mongoClient);
                    setAgendamentos(novasReservas)
                    setLoading(false);
                    alert('Adicionado com sucesso!');
                    close();
                }
            } else {
                await reservaDAO.create(data, userLogged);
                let novasReservas = await reservaDAO.findAll(mongoClient);
                setAgendamentos(novasReservas)
                setLoading(false);
                alert('Adicionado com sucesso!');
                close();
            }
        };

        React.useEffect(() => {
            if (mongoClient) {
                reservaDAO.findAll(mongoClient).then(res => {
                    setAgendamentos(res);
                    if ('nome' in userLogged) {
                        setProfissionalReservas(reservaDAO.findReservaDeCliente(userLogged._id, res));
                    }
                });
            }
        }, [mongoClient]);

        return (
            <ModalParent show={show}
                         onSubmit={handleSubmit}
                         header={<header>
                             <div>
                                 <h1>Adicionar Reserva</h1>
                                 <h3>
                                     {moment(dateSelected).locale('pt-BR')
                                         .format('DD [de] MMMM [de] YYYY')} - {salaSelected.nome}
                                 </h3>
                             </div>
                             <div className={'close_container'} onClick={close}>
                                 <i className={'fa fa-times'}/>
                             </div>
                         </header>}
                         body={<div>
                             <Options
                                 selectedPage={selectedPage}
                                 selectPage={selectPage}
                                 selectMes={selectMes}
                                 selectTurno={selectTurno}/>
                         </div>}
                         footer={
                             <div className={'footer'}>
                                 <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                             </div>}/>
        )
    }
;

ModalAgendamento.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func
}

const mapStateToProps = state => ({
    dateSelected: state.general.dateSelected,
    salaSelected: state.salas.salaSelected,
    userLogged: state.general.userLogged,
    mongoClient: state.general.mongoClient,
    agendamentos: state.agendamentos.agendamentos,
});

const mapDispatchToProps = dispatch => ({
    setProfissionalReservas: reservas => dispatch({type: Actions.setProfissionalReservas, payload: reservas}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamento);
