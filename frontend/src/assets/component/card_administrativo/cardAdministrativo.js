import React from 'react';
import Button from "../button/button";
import "./styles.sass";

const CardAdministrativo = props => {
    return (
        <div className={'card_administrativo'}>
            <img src={'https://randomuser.me/api/portraits/women/43.jpg'}/>
            <h2>Claudio Correa de Andrade Matias Pinto</h2>
            <Button text={'Informações'} />
        </div>
    )
}

export default CardAdministrativo;