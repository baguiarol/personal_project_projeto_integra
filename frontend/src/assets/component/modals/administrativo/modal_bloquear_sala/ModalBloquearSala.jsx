import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ModalParent from "../../modal_parent/modal";
import Select from "react-select";
import Button from "../../../button/button";
import "./ModalBloquearSala.sass"
import CheckBox from "../../../checkbox/checkbox";

const ModalBloquearSala = props => {

    const fillHours = () => {
        let array = []
        for (let i = 8; i < 21; i++)
            array.push({label: i + ":00", value: i})
        return array
    }

    const [salasOpcoes, setSalasOpcoes] = React.useState([])
    const [horaInicio, setHoraInicio] = React.useState(fillHours())

    React.useEffect(() => {
        let array = []
        props.salas.forEach(sala => {
            array.push({label: sala.nome, value: sala._id.toString()})
        })
        setSalasOpcoes(array)
    }, [])

    return (
        <ModalParent
            show={props.show}
            onSubmit={props.onSubmit}
            header={<header>
                <div>
                    <h1>Bloquear Sala</h1>
                </div>
                <div className={'close_container'} onClick={() => {
                    props.close();
                }}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            close={props.close}
            body={<div className={'bloquear_salas_body'}>
                <h2>Salas</h2>
                <Select
                    closeMenuOnSelect={false}
                    name={'select_salas'}
                    onChange={props.handleChange}
                    classNamePrefix={'select_salas'}
                    isMulti={true}
                    options={salasOpcoes}/>
                    <div className={'flex_content'}>
                        <div>
                            <h2>Dia</h2>
                            <input type={'date'} name={'date'} />
                        </div>
                        <div>
                            <h2>Horário</h2>
                            <p>
                                <CheckBox
                                    onCheck={checked => {
                                        props.setWholeDay(!checked)
                                    }}
                                    label={'Dia inteiro'}/>
                            </p>
                            <div className={'flex_content'}>
                                <div className={'select_container'}>
                                    <Select
                                        required={!props.wholeDay}
                                        classNamePrefix={'select'}
                                        name={'hora_inicio'}
                                        options={horaInicio}/>
                                </div>
                                <p>até</p>
                                <div className={'select_container'}>
                                    <Select
                                        required={!props.wholeDay}
                                        classNamePrefix={'select'}
                                        name={'hora_fim'}
                                        options={horaInicio}/>
                                </div>
                            </div>
                        </div>
                    </div>

            </div>}
            footer={<div className={'footer'}>
                <Button type={'submit'} loading={props.loading} text={props.loading ? 'Carregando...' : 'Confirmar'}/>
            </div>}
        />
    );
}

ModalBloquearSala.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setWholeDay: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    salas: state.salas.salas,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModalBloquearSala);
