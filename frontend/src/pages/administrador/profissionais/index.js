import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CardProfissional from "../../../assets/component/card_profissional/cardProfissional";
import "./styles.sass";

const ProfissionaisPage = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'profissionais'}/>
            <div className={'profissionais_container'}>
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
            </div>
        </div>
    )
}

export default ProfissionaisPage;