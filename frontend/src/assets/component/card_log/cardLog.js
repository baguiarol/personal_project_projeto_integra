import React from 'react';
import "./styles.sass";
import moment from "moment/min/moment-with-locales.min";

const CardLog = props => {
    return (
        <div className={'card_log'}>
            <img
                alt={'Profile_pic'}
                className={'profile_pic'} src={props.log.usuario.foto_url}/>
            <div>
                <h3>{props.log.usuario.nome}</h3>
                <h1>{props.log.log}</h1>
            </div>
            <div>
                <h4>{moment(new Date(props.log.data_hora)).locale('pt-BR').format(' DD/MM/YYYY HH:mm')}</h4>
            </div>
        </div>
    )
}

export default CardLog;