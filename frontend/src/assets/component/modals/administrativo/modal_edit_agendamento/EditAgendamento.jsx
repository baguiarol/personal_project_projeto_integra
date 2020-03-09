import React from 'react';
import ModalParent from "../../modal_parent/modal";
import Button from "../../../button/button";
import {connect} from "react-redux";
import moment from 'moment/min/moment-with-locales.min';
import "./EditAgendamento.sass";

const ModalEditAgendamento = props => {

    const [loading, setLoading] = React.useState(false);

    const setSubtitle = () => {
        if ('profissional' in props.agendamentoSelected) {
            return props.agendamentoSelected.profissional.nome + ' - ' +
                moment(props.dateSelected).locale('pt-BR').format('DD MMMM [de] YYYY');
        }
        return '';
    }

    //Modal para fazer trocar pagamento, execução ou cancelar.
    return (
        <ModalParent
            show={props.show}
            header={<header>
                <div>
                    <h1>Editar Reserva</h1>
                    <h3>{setSubtitle()}</h3>
                </div>
                <div className={'close_container'} onClick={props.close}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            body={<div className={'body_edit_agendamento'}>
                <h2>Execução</h2>
                <h3>
                    Reserva ainda não executada. <br/><br/>
                    <Button
                        type={'button'}
                        text={'Iniciar'}
                        width={'30%'}/>
                </h3>
                <h2>Pagamento</h2>
                <h3>
                    Reserva ainda não foi paga. <br/><br/>
                    <Button
                        type={'button'}
                        text={'Pagar'}
                        width={'30%'}/>
                </h3>
            </div>}
            footer={
                <div className={'footer footer_edit_agendamento'}>
                    {'sala' in props.agendamentoSelected ?
                        <div className={'flex crud_ops'}>
                            <Button text={'Cancelar'} type={'button'} onClick={async () => {
                            }}/>
                            <Button className={'submit'} loading={loading} type={'submit'} text={'Confirmar'}/>
                        </div> : <></>}
                </div>
            }
        />
    )
};

const mapStateToProps = state => ({
    agendamentoSelected: state.agendamentos.agendamentoSelected,
    dateSelected: state.general.dateSelected,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditAgendamento);