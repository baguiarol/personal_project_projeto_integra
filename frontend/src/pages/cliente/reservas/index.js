import React from 'react';
import './reservas.sass';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import AlternatingTab from "../../../assets/component/alternating_tab/alt_tab";
import Snack from "../../../assets/component/Snack/snack";
import ReservaCliente from "../../../assets/component/reserva_cliente/reserva_cliente";
import Actions from "../../../redux/actions/actions";
import reservaDAO from "../../../DAO/reservaDAO";

const MinhasReservasPage = props => {

    const [selectedTab, selectTab] = React.useState(1);

    const renderHistorico = () => {
        let arrayExecutados = [];
        props.profissionalReservas.forEach(reserva => {
            if (reserva.executado)
                arrayExecutados.push(reserva);
        })
        if (arrayExecutados > 0) {
            return arrayExecutados.map((reserva, index) => (
                <ReservaCliente reserva={reserva} executado key={index}/>
            ))
        } else {
            return <h2 className={'empty_array'}>Não há agendamentos executados até o momento.</h2>
        }
    }

    return (
        <div>
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
                <h1 className={'title'}>Minhas Reservas</h1>
                {
                    props.profissionalReservas.map((reserva, index) => {
                        if (!reserva.executado)
                            return (
                                <ReservaCliente reserva={reserva} key={index}/>
                            )
                        else
                            return <></>
                    })
                }
                <h1 className={'title'}>Histórico</h1>
                {
                    renderHistorico()
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
    profissionalReservas: state.profissionais.profissionalReservas,
});
const mapDispatchToProps = dispatch => ({
    setProfissionalReservas: reservas => dispatch({type: Actions.setProfissionalReservas, payload: reservas}),
});

export default connect(mapStateToProps, mapDispatchToProps)(MinhasReservasPage);