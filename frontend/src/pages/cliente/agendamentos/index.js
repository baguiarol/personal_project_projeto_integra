import React from 'react';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";

const ClienteAgendamentos = props => {
    return (
        <div>
            <ClienteTopbar />
        </div>
    )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)