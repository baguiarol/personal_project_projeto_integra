import React from 'react';
import "./salas.sass";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import Button from "../../../assets/component/button/button";
import CardSala from "../../../assets/component/card_sala/cardSala";
import Fab from "../../../assets/component/Fab/Fab";
import ModalNewSalas from "../../../assets/component/modals/administrativo/modal_new_salas/modal_new_salas";
import ModalTypes from "../../../assets/modal_types";
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import salaDAO from "../../../DAO/salaDAO";
import {Redirect} from 'react-router-dom';
import {useHistory} from "react-router";
import ModalBloquearSala from "../../../assets/component/modals/administrativo/modal_bloquear_sala/ModalBloquearSala";
import sala_bloqueioDAO from "../../../DAO/sala_bloqueioDAO";
import SalaBloqueada from "./components/SalaBloqueada";
import moment from "moment";

const SalasPage = props => {

    const hist = useHistory();

    const [loading, setLoading] = React.useState(false)
    const [wholeDay, setWholeDay] = React.useState(false)
    const [salasBloqueadas, setSalasBloqueadas] = React.useState([]);
    const [bloqueiosAtuais, setBloqueiosAtuais] = React.useState([]);
    if ('ocupacao' in props.userLogged) {
        hist.push('/');
    }

    React.useEffect(() => {
        if (salaDAO.db) {
            salaDAO.findAll().then(res => {
                props.setSalas(res);
            });
        }
    }, []);

    React.useEffect(() => {
        if (sala_bloqueioDAO.db && props.salas.length > 0) {
            let arr = [];
            sala_bloqueioDAO.findAll().then(res => {
                res.forEach(salaBloqueada => {
                    arr.push({...salaBloqueada, sala: salaDAO.getSalaById(salaBloqueada.sala[0], props.salas)})
                })
                setBloqueiosAtuais(arr.filter((el) => {
                    return moment(new Date(el.dia)).add(4, 'hours').isSameOrAfter(new Date(), 'day');
                }))
                setSalasBloqueadas(arr);
                console.log(arr);
            });
        }
    }, [props.bloqueiosSalas]);

    const [salas, selectSalas] = React.useState([])

    const sortSalas = (a, b) => {
        let [first, second] = [a.nome.split(' '), b.nome.split(' ')]
        if (+first[1] > +second[1]) return 1
        if (+first[1] < +second[1]) return -1
        else return 0
    }

    const handleChange = (selectedSalas) => {selectSalas(selectedSalas)}


    return ('nome' in props.userLogged) ? (
        <div>
            <AdministradorTopbar pageSelected={'salas'}/>
            <ModalBloquearSala
                setWholeDay={setWholeDay}
                loading={loading}
                handleChange={handleChange}
                onSubmit={async e => {
                    e.preventDefault()
                    setLoading(true)
                    const form = e.target;
                    /* Casos de erro. */
                    if (moment(new Date(form.date.value)).add(1, 'day').isBefore(moment(new Date()), 'day')) {
                        alert("O bloqueio não pode ser feito em uma data anterior a hoje.");
                        setLoading(false)
                        return;
                    } else if (!wholeDay && (!form.hora_inicio.value || !form.hora_fim.value)) {
                        alert("Por favor, informe o horário");
                        setLoading(false)
                        return;
                    }

                    let getSalas = () => {
                        if (salas.length === 0) {
                            return {$oid: salas[0].value}
                        } else {
                            let newArray = []
                            salas.forEach(sala => newArray.push({$oid: sala.value}))
                            return newArray
                        }
                    }

                    let data = {
                        sala: getSalas(),
                        dia: new Date(form.date.value),
                        wholeDay: wholeDay,
                    }
                    if (!wholeDay)
                        data = {...data, horaInicio: form.hora_inicio.value, horaFim: form.hora_fim.value}
                    try {
                        await sala_bloqueioDAO.create(data);
                        let bloqueios = await sala_bloqueioDAO.findAll();
                        props.setBloqueiosSalas(bloqueios);
                        props.closeModal()
                    } catch (e) {
                        alert('Erro: ' + e)
                    }

                    setLoading(false)
                }}
                close={() => props.closeModal()}
                show={
                    props.showModal &&
                    props.modalType === ModalTypes.bloquearSalas
                }/>
            <ModalNewSalas
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarSalas}
            />
            <div className={'salas_container'}>
                {
                    (bloqueiosAtuais.length > 0) ?
                        <div>
                            <h1>Salas Bloqueadas</h1>
                            {bloqueiosAtuais.map((sala, index) =>
                                <SalaBloqueada key={index} sala={sala} />)}
                        </div>
                    : <></>
                }
                <div className={'header_salas'}>
                    <div style={{flexGrow: 1}}>
                        <h1>Salas Cadastradas</h1>
                        <h3>Abaixo seguem as salas possuídas pela Integra</h3>
                    </div>
                    <div style={{width: 'auto'}}>
                        <Button
                            width={'250px'}
                            text={'Bloquear Salas'}
                            onClick={() => props.openModal(ModalTypes.bloquearSalas)}/>
                    </div>
                </div>
                <div className={'salas'}>
                    {
                        props.salas.sort(sortSalas).map((sala, index) => (
                            <CardSala sala={sala} key={index}/>
                        ))
                    }
                </div>
                    
            </div>
            <Fab onClick={() => props.openModal(ModalTypes.adicionarSalas)}/>
        </div>
    ) : (<Redirect to={'/'}/>)
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
    salas: state.salas.salas,
    userLogged: state.general.userLogged,
    bloqueiosSalas: state.salas.bloqueiosSalas,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    setBloqueiosSalas: bloqueios => dispatch({type: Actions.setBloqueiosSalas, payload: bloqueios}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SalasPage);
