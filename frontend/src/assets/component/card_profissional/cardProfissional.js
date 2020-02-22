import React from 'react';
import './styles.sass';
import PropTypes from 'prop-types';
import Button from "../button/button";

const CardProfissional = props => {
    return (
        <div className={'card_profissional'}>
            <img
                alt={'profissional_pic'}
                src={props.profissional.foto_url}/>
            <h2>{props.profissional.nome}</h2>
            <h3>{props.profissional.ocupacao}</h3>
            <Button text={'Informações'} />
        </div>
    )
}

CardProfissional.propTypes = {
    profissional: PropTypes.object.isRequired,
};

export default CardProfissional;