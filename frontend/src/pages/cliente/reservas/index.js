import React from 'react';
import './reservas.sass';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import AlternatingTab from "../../../assets/component/alternating_tab/alt_tab";
import Snack from "../../../assets/component/Snack/snack";
import ReservaCliente from "../../../assets/component/reserva_cliente/reserva_cliente";

const MinhasReservasPage = props => {

    const [selectedTab, selectTab] = React.useState(1);

    return (
        <div>
            <ClienteTopbar />
            <div className={'info_container'}>
                <AlternatingTab selectedIndex={selectedTab} elements={[{
                    name: 'Salas para Reservar',
                    onClick: () => selectTab(0),
                }, {
                    name: 'Minhas Reservas',
                    onClick: () => selectTab(1),
                }]}/>
                <Snack />
            </div>
            <div className={'container_reservas'}>
                <h1 className={'title'}>Minhas Reservas</h1>
                <ReservaCliente />
                <ReservaCliente />
                <h1 className={'title'}>Histórico</h1>
                <ReservaCliente executado/>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MinhasReservasPage);