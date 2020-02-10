import React from 'react';
import './styles.sass';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CardAdministrativo from "../../../assets/component/card_administrativo/cardAdministrativo";

const AdministrativoPage = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'administrativo'}/>
            <div className={'container_adms'}>
                <CardAdministrativo/>
                <CardAdministrativo/>
                <CardAdministrativo/>
                <CardAdministrativo/>
            </div>
        </div>
    )
}

export default AdministrativoPage;