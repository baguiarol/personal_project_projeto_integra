import React from 'react';
import Button from "../button/button";
import "./styles.sass";

const Sala = props => {
    return (
        <div className={'sala_container'}>
            <div>
                <h1>Sala 01</h1>
                 <p>Horários Reservados</p>
            </div>
            <div>
                <Button width={'25%'} text={'Detalhes'} />
            </div>
        </div>
    )
};

export default Sala;
