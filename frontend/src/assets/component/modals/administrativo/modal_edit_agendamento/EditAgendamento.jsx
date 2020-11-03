import React from 'react';
import ModalParent from '../../modal_parent/modal';
import Button from '../../../button/button';
import { connect, useDispatch } from 'react-redux';
import CheckBox from '../../../checkbox/checkbox';
import Moment from 'moment/min/moment-with-locales.min';
import './EditAgendamento.sass';
import reservaDAO, { getStringDate } from '../../../../../DAO/reservaDAO';
import Actions from '../../../../../redux/actions/actions';
import Select from 'react-select';
import { extendMoment } from 'moment-range';
import logDAO from '../../../../../DAO/logDAO';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import {EditCredito} from "../modal_add_credito/ModalAddCredito";

const moment = extendMoment(Moment);

const ModalEditAgendamento = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [executing, setExecuting] = React.useState(false);
  const [finalizado, setFinalizado] = React.useState(false);
  const [pago, setPago] = React.useState(false);
  const [cancelamentoData, setCancelamentoData] = React.useState({
    hora_inicio: 0,
    hora_fim: 0,
    reservaInteira: false,
  });
  const [quantidade, setQuantidade] = React.useState(0);
  const [quantidadeAntiga, setQuantidadeAntiga] = React.useState(0);
  const [editarSala, setEditarSala] = React.useState(null);

  const dispatch = useDispatch();

  const agendamentoSelected = useSelector(
    (state) => state.agendamentos.agendamentoSelected
  );

  const setSubtitle = () => {
    if ('profissional' in agendamentoSelected) {
      return (
        agendamentoSelected.profissional.nome +
        ' - ' +
        moment(props.dateSelected).locale('pt-BR').format('DD MMMM [de] YYYY') +
        ' - ' +
        agendamentoSelected.sala.nome
      );
    }
    return '';
  };

  const populateHorasArray = (horaInicio, horaFim) => {
    let arr = [];
    for (let i = horaInicio; i < horaFim; i++)
      arr.push({ label: i + ':00', value: i });
    return arr;
  };

  const showToastLoading = (text) => {
    toast.warn(text, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showToastSuccess = (text) => {
    toast.success(text, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const populateSalas = (salas) => {
    let arr = [];
    salas.forEach((sala) => arr.push({ label: sala.nome, value: sala._id }));
    return arr;
  };

  React.useEffect(() => {
    setExecuting(
      'execucao_inicio' in agendamentoSelected &&
        !('execucao_fim' in agendamentoSelected)
    );
    setFinalizado(
      'execucao_inicio' in agendamentoSelected &&
        'execucao_fim' in agendamentoSelected
    );

    if ('profissional' in agendamentoSelected) {
      setQuantidadeAntiga(agendamentoSelected.profissional.creditos);
      setQuantidade(agendamentoSelected.profissional.creditos);
    }

    setCancelamentoData({
      ...cancelamentoData,
      hora_inicio: agendamentoSelected.hora_inicio,
      hora_fim: agendamentoSelected.hora_fim,
    });
    setPago(agendamentoSelected.pago);
  }, [agendamentoSelected]);

  const updateAgendamentos = async () => {
    let agendamentos = await reservaDAO.findAllInClient();
    props.setSalas(agendamentos[0]);
    props.setProfissionais(agendamentos[1]);
    props.setAgendamentos(agendamentos[2]);
  };

  const agendamentos = useSelector((state) => state.agendamentos.agendamentos);
  React.useEffect(() => {
    if (agendamentos.length > 0 && '_id' in agendamentoSelected) {
      dispatch({
        type: Actions.selectAgendamentos,
        payload: reservaDAO.getAgendamentosById(
          agendamentos,
          agendamentoSelected._id
        ),
      });
    }
  }, [agendamentos, agendamentoSelected]);

  //Modal para fazer trocar pagamento, execução ou cancelar.
  if (props.agendamentoSelected) {
    return (
      <React.Fragment>
        <ModalParent
          show={props.show}
          header={
            <header>
              <div>
                <h1>Editar Reserva</h1>
                <h3>{setSubtitle()}</h3>
              </div>
              <div className={'close_container'} onClick={props.close}>
                <i className={'fa fa-times'} />
              </div>
            </header>
          }
          body={
            <div className={'body_edit_agendamento'}>
              <h2>Sala</h2>
              <Select
                onChange={(e) => setEditarSala({ id: e.value, label: e.label })}
                options={populateSalas(props.salas)}
              />
              <br />
              <Button
                loading={loading}
                width={'45%'}
                style={{ marginTop: 15 }}
                type={'button'}
                text={'Trocar Sala'}
                onClick={async () => {
                  if (editarSala) {
                    let agendamentos = reservaDAO.getAgendamentosFromSala(
                      props.agendamentos,
                      { nome: editarSala.label }
                    );
                    let r2 = moment.range(
                      new Date(
                        getStringDate(
                          new Date(props.agendamentoSelected.data),
                          props.agendamentoSelected.hora_inicio
                        )
                      ),
                      new Date(
                        getStringDate(
                          new Date(props.agendamentoSelected.data),
                          props.agendamentoSelected.hora_fim
                        )
                      )
                    );
                    console.log('Range ', r2);
                    for (let agendamento of agendamentos) {
                      let r1 = moment.range(
                        new Date(
                          getStringDate(
                            new Date(agendamento.data),
                            agendamento.hora_inicio
                          )
                        ),
                        new Date(
                          getStringDate(
                            new Date(agendamento.data),
                            agendamento.hora_fim
                          )
                        )
                      );
                      if (r1.overlaps(r2) && !agendamento.cancelado) {
                        alert(
                          'O horário já se encontra reservado na sala requerida.'
                        );
                        setLoading(false);
                        return;
                      }
                    }
                    showToastLoading(
                      'Carregando: Trocando ' +
                        props.agendamentoSelected.profissional.nome +
                        ' de sala'
                    );
                    await logDAO.create({
                      usuario: props.userLogged,
                      log: `Trocou sala da reserva ${
                        props.agendamentoSelected.profissional.nome
                      } ${moment(props.agendamentoSelected.data).format(
                        'DD-MM-YYYY'
                      )} ${props.agendamentoSelected.hora_inicio}h-${
                        props.agendamentoSelected.hora_fim
                      }h ${props.agendamentoSelected.sala.nome} para sala ${
                        editarSala.label
                      }`,
                      data_hora: new Date(),
                    });
                    await reservaDAO.editaReserva(
                      props.agendamentoSelected._id,
                      { sala_id: editarSala.id }
                    );
                    showToastSuccess(
                      'Sucesso na troca da ' +
                        props.agendamentoSelected.profissional.nome +
                        ' de sala'
                    );
                  }
                }}
              />
              <h2>Execução</h2>
              <h3>
                {finalizado
                  ? `Reserva já foi finalizada. Início às ${moment(
                      props.agendamentoSelected.execucao_inicio
                    ).format('HH:mm')}, e fim às ${moment(
                      props.agendamentoSelected.execucao_fim
                    ).format('HH:mm')}`
                  : executing
                  ? 'Reserva está sendo executada'
                  : 'Reserva ainda não executada'}
                <br />
                <br />
                {finalizado ? (
                  <></>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <Button
                      onClick={async () => {
                        if (executing) {
                          showToastLoading(
                            'Carregando: Finalizando reserva de ' +
                              props.agendamentoSelected.profissional.nome
                          );
                          await reservaDAO.executaReserva(
                            props.agendamentoSelected._id
                          );
                          await updateAgendamentos();
                          showToastSuccess(
                            'Reserva de ' +
                              props.agendamentoSelected.profissional.nome +
                              ' finalizada!'
                          );
                        } else {
                          showToastLoading(
                            'Carregando: Iniciando reserva de ' +
                              props.agendamentoSelected.profissional.nome
                          );
                          await reservaDAO.comecaReserva(
                            props.agendamentoSelected._id
                          );
                          await updateAgendamentos();
                          showToastSuccess(
                            'Reserva de ' +
                              props.agendamentoSelected.profissional.nome +
                              ' iniciada!'
                          );
                        }
                      }}
                      type={'button'}
                      text={
                        'execucao_inicio' in props.agendamentoSelected
                          ? 'Finalizar'
                          : 'Iniciar'
                      }
                      loading={loading}
                      width={'30%'}
                    />{' '}
                    &nbsp; &nbsp;
                  </div>
                )}
              </h3>
              <div>
                <h2>Cancalemento</h2>
                <CheckBox
                  label={'Reserva Inteira'}
                  onCheck={(checked) =>
                    setCancelamentoData({
                      ...cancelamentoData,
                      reservaInteira: !checked,
                    })
                  }
                />
                <div style={{ display: 'flex', marginBottom: 20 }}>
                  <div style={{ flexGrow: 1, marginRight: 20 }}>
                    <h3 style={{ marginTop: 0 }}>Hora Início</h3>
                    <Select
                      value={
                        cancelamentoData.hora_inicio === 0
                          ? ''
                          : {
                              label: cancelamentoData.hora_inicio + ':00',
                              value: cancelamentoData.hora_inicio,
                            }
                      }
                      onChange={(e) =>
                        setCancelamentoData({
                          ...cancelamentoData,
                          hora_inicio: e.value,
                        })
                      }
                      options={populateHorasArray(
                        props.agendamentoSelected.hora_inicio,
                        props.agendamentoSelected.hora_fim
                      )}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ marginTop: 0 }}>Hora Fim</h3>
                    <Select
                      value={
                        cancelamentoData.hora_fim === 0
                          ? ''
                          : {
                              label: cancelamentoData.hora_fim + ':00',
                              value: cancelamentoData.hora_fim,
                            }
                      }
                      onChange={(e) =>
                        setCancelamentoData({
                          ...cancelamentoData,
                          hora_fim: e.value,
                        })
                      }
                      options={populateHorasArray(
                        cancelamentoData.hora_inicio + 1,
                        props.agendamentoSelected.hora_fim + 1
                      )}
                    />
                  </div>
                </div>
                <Button
                  text={'Cancelar Reserva'}
                  type={'button'}
                  width={'45%'}
                  onClick={async () => {
                    if (cancelamentoData.reservaInteira) {
                      if (
                        window.confirm(
                          'Tem certeza que deseja cancelar toda a reserva?'
                        )
                      ) {
                        showToastLoading(
                          'Carregando: Cancelamento da Reserva de: ' +
                            props.agendamentoSelected.profissional.nome
                        );
                        props.close();
                        await reservaDAO.cancelaReserva(
                          props.agendamentoSelected,
                          props.userLogged
                        );
                        props.selectAgendamentos({});
                        showToastSuccess(
                          'Cancelamento da Reserva de ' +
                            props.agendamentoSelected.profissional.nome +
                            ' efetuada!'
                        );
                      }
                    } else {
                      if (
                        window.confirm(
                          `Tem certeza que deseja cancelar a reserva das ${cancelamentoData.hora_inicio}h até às ${cancelamentoData.hora_fim}h`
                        )
                      ) {
                        try {
                          showToastLoading(
                            'Carregando: Cancelamento Parcial da Reserva de: ' +
                              props.agendamentoSelected.profissional.nome
                          );
                          props.close();
                          let aux = { ...props.agendamentoSelected };
                          props.selectAgendamentos({});
                          await reservaDAO.cancelaParteDaReserva(
                            aux._id,
                            cancelamentoData.hora_inicio,
                            cancelamentoData.hora_fim,
                            props.agendamentos,
                            props.userLogged
                          );
                          showToastSuccess(
                            'Cancelamento Parcial da Reserva de ' +
                              aux.profissional.nome +
                              ' efetuada!'
                          );
                        } catch (e) {
                          alert(e);
                        }
                        props.close();
                      }
                    }
                  }}
                />{' '}
                &nbsp;
                <Button
                  text={'Excluir Reserva'}
                  width={'45%'}
                  onClick={async () => {
                    if (
                      window.confirm(
                        'Tem certeza que deseja excluir a reserva?'
                      )
                    ) {
                      showToastLoading(
                        'Carregando: Excluindo Reserva de: ' +
                          props.agendamentoSelected.profissional.nome
                      );
                      await logDAO.create({
                        usuario: props.userLogged,
                        log: `Excluiu reserva ${
                          props.agendamentoSelected.profissional.nome
                        } ${moment(props.agendamentoSelected.data).format(
                          'DD-MM-YYYY'
                        )} ${props.agendamentoSelected.hora_inicio}h-${
                          props.agendamentoSelected.hora_fim
                        }h ${props.agendamentoSelected.sala.nome}`,
                        data_hora: new Date(),
                      });
                      await reservaDAO.delete({
                        _id: props.agendamentoSelected._id,
                      });
                      showToastSuccess(
                        'Reserva de: ' +
                          props.agendamentoSelected.profissional.nome +
                          ' excluída!'
                      );
                    }
                  }}
                />
              </div>
              <h2>Pagamento</h2>
              <h3>
                {pago ? 'Reserva já foi paga.' : 'Reserva ainda não foi paga.'}{' '}
                <br />
                <br />
                {pago ? (
                  <></>
                ) : (
                  <Button
                    onClick={async () => {
                      showToastLoading(
                        'Carregando: Pagamento da Reserva de: ' +
                          props.agendamentoSelected.profissional.nome
                      );
                      await reservaDAO.pagaReserva(
                        props.agendamentoSelected._id,
                        true,
                        props.userLogged
                      );
                      await updateAgendamentos();
                      showToastSuccess(
                        'Reserva de: ' +
                          props.agendamentoSelected.profissional.nome +
                          ' paga!'
                      );
                    }}
                    loading={loading}
                    type={'button'}
                    text={'Pagar'}
                    width={'45%'}
                  />
                )}
                {pago ? (
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      await reservaDAO.pagaReserva(
                        props.agendamentoSelected._id,
                        false,
                        props.userLogged
                      );
                      await updateAgendamentos();
                      setLoading(false);
                    }}
                    text={'Desfazer'}
                    width={'45%'}
                  />
                ) : (
                  <></>
                )}
              </h3>
              <h2>Debitar Créditos</h2>
              <div className={'counter'}>
                <h2>
                  <i
                    className={'fa fa-minus'}
                    onClick={() => setQuantidade(quantidade - 1)}
                  />
                </h2>
                <h1>{quantidade}</h1>
                <h2>
                  <i
                    className={'fa fa-plus'}
                    onClick={() => setQuantidade(quantidade + 1)}
                  />
                </h2>
              </div>
              <br />
              <Button
                width={'35%'}
                text={'Debitar'}
                onClick={async () => {
                  await EditCredito(
                    agendamentoSelected.profissional,
                    quantidade,
                    quantidadeAntiga,
                    toast,
                    props.userLogged,
                    props.setProfissionais,
                    setQuantidadeAntiga
                  );
                }}
              />
            </div>
          }
          footer={<div className={'footer footer_edit_agendamento'}/>}
        />
        <ToastContainer />
      </React.Fragment>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = (state) => ({
  agendamentoSelected: state.agendamentos.agendamentoSelected,
  dateSelected: state.general.dateSelected,
  mongoClient: state.general.mongoClient,
  salas: state.salas.salas,
  userLogged: state.general.userLogged,
  agendamentos: state.agendamentos.agendamentos,
});

const mapDispatchToProps = (dispatch) => ({
  setProfissionais: (prof) =>
    dispatch({ type: Actions.setProfissionais, payload: prof }),
  setSalas: (salas) => dispatch({ type: Actions.setSalas, payload: salas }),
  setAgendamentos: (agnds) =>
    dispatch({ type: Actions.setAgendamentos, payload: agnds }),
  selectAgendamentos: (agnd) =>
    dispatch({ type: Actions.selectAgendamentos, payload: agnd }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalEditAgendamento);
