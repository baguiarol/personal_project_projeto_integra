import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import WeekCalendar from "../../../assets/component/week_calendar/calendar";
import Sala from "../../../assets/component/sala/sala";
import ModalTypes from "../../../assets/modal_types";

const AgendamentosAdministrador = props => {
    return (
        <div>
            <AdministradorTopbar />
            <div className={'container_salas'}>
                <Sala isAdm={true} />
                <Sala />
            </div>
        </div>
    )
}

export default AgendamentosAdministrador;