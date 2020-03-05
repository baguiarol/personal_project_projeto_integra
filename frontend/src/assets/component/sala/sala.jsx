import React from 'react';
import Button from "../button/button";
import "./styles.sass";
import WeekCalendar from "../week_calendar/calendar";
import PropTypes from 'prop-types';
import ReactTooltip from "react-tooltip";
import {connect} from "react-redux";
import clienteDAO from "../../../DAO/clienteDAO";
import reservaDAO from "../../../DAO/reservaDAO";
import Actions from "../../../redux/actions/actions";

const Sala = props => {

    const [salaFixa, setSalaFixa] = React.useState(false);

    React.useEffect(() => {
        if ('sala_fixa' in props.userLogged && '_id' in props.sala) {
            setSalaFixa(props.sala._id.toString() === props.userLogged.sala_fixa.toString());
        }
    }, [props]);

    return (
        <div className={'sala_content'}>
            <ReactTooltip id='main' place={'left'} type={'info'} effect={'solid'}/>
            <div className={'sala_container'}>
                <div>
                    <h1>
                        <span
                            className={salaFixa ? 'fixa' : ''}
                            onClick={async () => {
                                await clienteDAO.fixarSalaNoTopo(props.sala, props.userLogged);
                                props.setUserLogged({...props.userLogged, sala_fixa: props.sala._id});
                            }}
                            data-for={'main'} data-tip={'Fixar no Topo'} data-iscapture={'true'}>
                             <i className={'fas fa-thumbtack'}/> {'\u00A0'}
                        </span>
                        {props.sala.nome}
                    </h1>
                    <p>Horários Reservados</p>
                </div>
                <div>
                    <Button
                        className={'btn_detalhes'}
                        text={'Detalhes'}
                        onClick={props.onClickDetalhesListener}/>
                </div>
            </div>
            <WeekCalendar sala={props.sala} isAdm={props.isAdm} addReservaListener={props.addReservaListener}/>
        </div>
    )
};

Sala.propTypes = {
    isAdm: PropTypes.bool,
    addReservaListener: PropTypes.func,
    onClickDetalhesListener: PropTypes.func,
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
});

const mapDispatchToProps = dispatch => ({
    setUserLogged: user => dispatch({type: Actions.setUserLogged, payload: user}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sala);
