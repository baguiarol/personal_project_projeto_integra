import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import "./ProfissionalList.sass"
import ModalTypes from "../../../../assets/modal_types";
import Button from "../../../../assets/component/button/button";
import Actions from "../../../../redux/actions/actions";

const ProfissionalList = props => {

    const horarios = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    const verifyMaxQnt = (horariosObj) => {
        let quantity = 0;
        const horarios = Object.keys(horariosObj);
        horarios.forEach((horario) => {
            let tam = horariosObj[horario].length
            if (tam > quantity) {
                quantity = tam;
            }
        })
        return quantity;
    }

    const renderRows = (horariosObj) => {
        let matrix = [];
        let columnSize = verifyMaxQnt(horariosObj);
        for (let i = 0; i < columnSize; i++) {
            matrix[i] = new Array(horarios.length).fill(null);
        }
        for (let i = 0; i < horarios.length; i++) {
            for (let j = 0; j < columnSize; j++) {
                    matrix[j][i] = horariosObj[horarios[i]][j];
            }
        }

        return (
            <React.Fragment>
            {matrix.map(row => (
                    <tr>
                        {row.map(horario => (
                            <React.Fragment>
                            {horario ? <td style={{padding: 0, paddingRight: 5, fontSize: 13}}>{horario.inicio}h~{horario.fim}h</td> : <td style={{padding: 0}}>----</td> }
                            </React.Fragment>
                            ))}
                    </tr>
                ))}
            </React.Fragment>
        )
    }

    React.useEffect(() => {
        if (props.profissional.nome === "Brian Ito de Oliveira Moura" && "horarios" in props.profissional) {
            console.log(props.profissional)
            renderRows(props.profissional.horarios);
        }
    })

    return (
        <tr className={'profissional_list_obj'}>
            <td><img
                alt={'profissional_pic'}
                src={props.profissional.foto_url}/></td>
            <td>
                <div>
                    <span style={{fontWeight: 500}}>{props.profissional.nome}</span> <br />
                    {props.profissional.ocupacao}  &nbsp; {props.profissional.registro} <br />
                    <span className={'cpf'}>{props.profissional.cpf}</span>
                </div>
            </td>
            <td>
                <div>
                    {'endereco' in props.profissional ?
                        <span>{props.profissional.endereco}  <span className={'cep'}>{props.profissional.cep}</span> <br /></span>
                        : <></>}
                    {props.profissional.telefone} <br />
                    {props.profissional.email}
                </div>
            </td>
            <td>


                {'valorAtendimento' in props.profissional ?
                    <React.Fragment>
                        <span className={'cep'}>Valor do Atendimento Inicial: R$ {props.profissional.valorAtendimento}</span>
                        <br/>
                    </React.Fragment>
                    : <></>}
                <table style={{textAlign: 'center'}}>
                    <thead>
                    {horarios.map((horario) => <td style={{padding: 0, fontWeight: 500}}>{horario}</td>) }
                    </thead>
                    <tbody>
                    {
                        ('horarios' in props.profissional) ? renderRows(props.profissional.horarios) : <></>
                    }
                    </tbody>
                </table>
            </td>
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

const mapDispatchToProps = dispatch => ({
    openModal: type => dispatch({type: Actions.showModal, payload: type}),
    selectProfissional: prof => dispatch({type: Actions.selectProfissional, payload: prof}),
});


export default connect(mapStateToProps, mapDispatchToProps)(ProfissionalList)