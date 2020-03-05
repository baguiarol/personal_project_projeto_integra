import React from 'react';
import {connect} from "react-redux";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CardLog from "../../../assets/component/card_log/cardLog";
import "./logs.sass";
import Actions from "../../../redux/actions/actions";
import {useHistory} from "react-router";

const LogsPage = props => {

    const hist = useHistory();

    if ('ocupacao' in props.userLogged) {
        hist.push('/');
    }

    return (
        <div>
            <AdministradorTopbar pageSelected={'logs'} />
            <div className={'logs'}>
                {
                    props.logs.map(log => (
                        <CardLog log={log}/>
                    ))
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    logs: state.logs.logs,
    userLogged: state.general.userLogged,
});

const mapDispatchToProps = dispatch => ({
    setLogs: logs => dispatch({type: Actions.setLogs, payload: logs}),
});

export default connect(mapStateToProps)(LogsPage);