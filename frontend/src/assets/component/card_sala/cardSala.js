import React from 'react';
import './styles.sass';
import Button from "../button/button";

const CardSala = props => {
    return (
        <div className={'card_sala'}>
            {/*<img*/}
            {/*    alt={'sala'}*/}
            {/*    src={'https://integracps.com.br/uploads/gallery/2019/04/estrutura-11556120340.jpg'} />*/}
            <h2>Sala 03</h2>
            <Button text={'Informações'} />
        </div>
    )
}

export default CardSala;