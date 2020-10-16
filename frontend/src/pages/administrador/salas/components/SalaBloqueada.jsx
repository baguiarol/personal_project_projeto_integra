import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import "./SalaBloqueada.sass"
import Button from "../../../../assets/component/button/button";
import moment from 'moment/min/moment-with-locales'
import sala_bloqueioDAO from "../../../../DAO/sala_bloqueioDAO";
import Actions from "../../../../redux/actions/actions";

const SalaBloqueada = props => {

    const cancelarBloqueio = async () => {
        if (window.confirm("Tem certeza que deseja cancelar esse bloqueio?")) {
            setLoading(true)
            sala_bloqueioDAO.delete({_id: props.sala._id});
            let arr = await sala_bloqueioDAO.findAll();
            props.setBloqueiosSalas(arr);
            setLoading(false);
        }
    }

    const [loading, setLoading] = React.useState(false);

    const getSalaName = () => {
        let string = "";
        console.log(props.sala);

        let arr = [...props.sala.salas];

        arr.sort((a, b) => {
            let nA = a.nome.split(" ")[1];
            let nB = b.nome.split(" ")[1];
            console.log(nA, nB);
            if (+nA > +nB) {
                return 1;
            } else if (+nA < +nB){
                return -1;
            } else {
                return 0;
            }
        })
        arr.forEach((sala, index) => {
            if (index === 0) {
                string += sala.nome;
            } else {
                string += ", "+sala.nome;
            }
        })
        return string;
    }

    return (
        <div className={'sala_bloqueada'}>
            <div className={'data'}>
                <h2>{getSalaName()}</h2>
                <p>{moment(new Date(props.sala.dia)).locale('pt-BR').add(4, 'hours').format('ll')}, {
                    props.sala.wholeDay ? `Dia Inteiro` : `De ${props.sala.horaInicio}h até às ${props.sala.horaFim}h`}</p>
            </div>
            <div className={'btn_container'}>
                <Button
                    onClick={cancelarBloqueio}
                    loading={loading}
                    text={'Cancelar Bloqueio'} />
            </div>
        </div>
    )
}

SalaBloqueada.propTypes = {
    sala: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    salas: state.salas.salas,
});

const mapDispatchToProps = dispatch => ({
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    setBloqueiosSalas: bloqueios => dispatch({type: Actions.setBloqueiosSalas, payload: bloqueios}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SalaBloqueada)