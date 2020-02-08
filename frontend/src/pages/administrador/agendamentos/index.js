import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import WeekCalendar from "../../../assets/component/week_calendar/calendar";
import Sala from "../../../assets/component/sala/sala";
import ModalTypes from "../../../assets/modal_types";

const AgendamentosAdministrador = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'agendamentos'} />
            <div className={'container_salas'}>
                <Sala isAdm={true} />
                <Sala isAdm={true} />
            </div>
        </div>
    )
}

export default AgendamentosAdministrador;