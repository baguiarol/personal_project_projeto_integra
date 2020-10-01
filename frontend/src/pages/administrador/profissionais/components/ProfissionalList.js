import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import "./ProfissionalList.sass"
import ModalTypes from "../../../../assets/modal_types";
import Button from "../../../../assets/component/button/button";

const ProfissionalList = props => {
    return (
        <tr className={'profissional_list_obj'}>
            <td><img
                alt={'profissional_pic'}
                src={props.profissional.foto_url}/></td>
            <td>{props.profissional.nome}</td>
            <td>{props.profissional.ocupacao}</td>
            <td>{props.profissional.telefone}</td>
            <td>{props.profissional.email}</td>
            <td><Button className={'inside'} text={'Informações'} onClick={ () => {
                props.selectProfissional(props.profissional);
                props.openModal(ModalTypes.adicionarProfissional);
            }}/></td>
        </tr>
    )
}

ProfissionalList.propTypes = {
    profissional: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ProfissionalList)