import React from 'react';
import './styles.sass';
import Button from "../button/button";
import PropTypes from 'prop-types';

const CardSala = props => {
    return (
        <div className={'card_sala'}>
            <img
                alt={'sala'}
                src={props.sala.fotos[0]}/>
            <div>
                <h2>{props.sala.nome}</h2>
                <Button text={'Informações'}/>
            </div>
        </div>
    )
}

CardSala.propTypes = {
    sala: PropTypes.object.isRequired,
}

export default CardSala;