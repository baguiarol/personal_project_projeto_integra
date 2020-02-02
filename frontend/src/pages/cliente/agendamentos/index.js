import React from 'react';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import Sala from "../../../assets/component/sala/sala";
import "./styles.sass";

const ClienteAgendamentos = props => {
    return (
        <div>
            <ClienteTopbar />
            <div className={'container_salas'}>
                <Sala />
                <Sala />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)