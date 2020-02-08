import React from 'react';
import "./styles.sass";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import Button from "../../../assets/component/button/button";

const SalasPage = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'salas'}/>
            <div className={'salas_container'}>
                <div className={'header_salas'}>
                    <div>
                        <h1>Salas Cadastradas</h1>
                        <h3>Abaixo seguem as salas possuídas pela Integra</h3>
                    </div>
                    <div>
                        <Button width={'50%'} text={'Nova Sala'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalasPage;