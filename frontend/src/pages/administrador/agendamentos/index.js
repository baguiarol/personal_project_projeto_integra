import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CalendarAgendamentos from "../../../assets/component/calendar_agendamentos/CalendarAgendamentos";

const AgendamentosAdministrador = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'agendamentos'} />
            <div className={'container_salas'}>
                <CalendarAgendamentos/>
            </div>
        </div>
    )
}

export default AgendamentosAdministrador;