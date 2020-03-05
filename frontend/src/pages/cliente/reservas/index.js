import React from 'react';
import './reservas.sass';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import AlternatingTab from "../../../assets/component/alternating_tab/alt_tab";
import Snack from "../../../assets/component/Snack/snack";
import ReservaCliente from "../../../assets/component/reserva_cliente/reserva_cliente";
import Actions from "../../../redux/actions/actions";
import {useHistory} from "react-router";
import Button from "../../../assets/component/button/button";
import CancelCheckbox from "../../../assets/component/cancel_checkbox/CancelCheckbox";
import {removeElementFromArray} from "../../../assets/AuxFunctions";
import reservaDAO from "../../../DAO/reservaDAO";

const MinhasReservasPage = props => {

    const [selectedTab, selectTab] = React.useState(1);
    const [cancelando, setCancelando] = React.useState(false);
    const [selectedReservas, selectReservas] = React.useState([]);

    const hist = useHistory();

    React.useEffect(() => {
        if (!('nome' in props.userLogged)) {
            hist.push('/');
        }
    });

    const renderHistorico = () => {
        let arrayExecutados = [];
        props.profissionalReservas.forEach(reserva => {
            if (reserva.executado)
                arrayExecutados.push(reserva);
        });
        if (arrayExecutados > 0) {
            return arrayExecutados.map((reserva, index) => (
                <ReservaCliente reserva={reserva} executado key={index}/>
            ))
        } else {
            return <h2 className={'empty_array'}>Não há agendamentos executados até o momento.</h2>
        }
    };

    const handleConfirmCancelamento = async () => {
        if (window.confirm("Você tem certeza que deseja cancelar esses agendamentos?")) {
            try {
                await reservaDAO.cancelaMuitasReservas(selectedReservas);
                alert("Cancelamento realizado com sucesso!");
            } catch (err) {
                alert("Erro! Informações: "+err);
            }
        }
    };

    const renderReservas = () => {
        if (props.profissionalReservas.length > 0) {
            return props.profissionalReservas.map((reserva, index) => {
                if (!reserva.executado && !reserva.cancelado)
                    return (
                        <div className={cancelando ? 'flex flex_margin' : 'flex'}>
                            {cancelando ? <CancelCheckbox onCheck={checked => {
                                if (!checked) {
                                    //Se estiver marcado
                                    selectReservas([...selectedReservas, reserva]);
                                } else {
                                    // Se não estiver
                                    selectReservas(removeElementFromArray(selectedReservas, reserva));
                                }
                            }}/> : <></>}
                            <ReservaCliente reserva={reserva} key={index}/>
                        </div>
                    );
                else
                    return <></>
            })
        } else {
            return <h2 className={'empty_array'}>Não há agendamentos marcados até o momento.</h2>
        }
    };

    return (
        <div className={'reservas_page_container'}>
            <ClienteTopbar/>
            <div className={'info_container'}>
                <AlternatingTab selectedIndex={selectedTab} elements={[{
                    name: 'Salas para Reservar',
                    onClick: () => selectTab(0),
                }, {
                    name: 'Minhas Reservas',
                    onClick: () => selectTab(1),
                }]}/>
                <Snack/>
            </div>
            <div className={'container_reservas'}>
                <div className={'flex'}>
                    <h1 className={'title'}>Minhas Reservas</h1>
                    <Button
                        onClick={() => {
                            setCancelando(!cancelando)
                        }}
                        className={'cancelar_agendamentos'}
                        text={cancelando ? 'Parar Cancelamento' : 'Cancelar Agendamentos'}/>
                </div>
                {
                    renderReservas()
                }
                {cancelando ? <Button
                    onClick={handleConfirmCancelamento}
                    text={'Confirmar Cancelamento'}
                    className={'cancelar_button'} />: <></>}
                <h1 className={'title'}>Histórico</h1>
                {
                    renderHistorico()
                }
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
    profissionalReservas: state.profissionais.profissionalReservas,
});
const mapDispatchToProps = dispatch => ({
    setProfissionalReservas: reservas => dispatch({type: Actions.setProfissionalReservas, payload: reservas}),
});

export default connect(mapStateToProps, mapDispatchToProps)(MinhasReservasPage);