import React from 'react';
import {connect} from "react-redux";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CardLog from "../../../assets/component/card_log/cardLog";
import "./styles.sass";

const LogsPage = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'logs'} />
            <div className={'logs'}>
                <CardLog />
                <CardLog />
                <CardLog />
                <CardLog />

            </div>
        </div>
    )
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(LogsPage);