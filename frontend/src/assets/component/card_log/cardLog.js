import React from 'react';
import "./styles.sass";

const CardLog = props => {
    return (
        <div className={'card_log'}>
            <img
                alt={'Profile_pic'}
                className={'profile_pic'} src={'https://randomuser.me/api/portraits/women/43.jpg'}/>
            <div>
                <h3>Brian Ito</h3>
                <h1>Solicitou uma nova sala</h1>
            </div>
            <div>
                <h4>Seg, 24/Jan/2020 15:35</h4>
            </div>
        </div>
    )
}

export default CardLog;