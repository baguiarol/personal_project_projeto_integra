import React from 'react';
import './styles.sass';
import PropTypes from 'prop-types';
import Button from "../button/button";

const CardProfissional = props => {
    return (
        <div className={'card_profissional'}>
            <img src={'https://randomuser.me/api/portraits/women/43.jpg'}/>
            <h2>Claudio Correa de Andrade Matias Pinto</h2>
            <h3>Fisioterapeuta</h3>
            <Button text={'Informações'} />
        </div>
    )
}

CardProfissional.propTypes = {

};

export default CardProfissional;