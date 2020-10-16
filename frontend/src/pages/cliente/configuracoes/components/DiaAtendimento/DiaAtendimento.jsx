import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import InputText from "../../../../../assets/component/inputText/input";
import Button from "../../../../../assets/component/button/button";

const DiaAtendimento = ({dia, atendimentos, setAtendimentos}) => {

    const [horaInicio, setHoraInicio] = React.useState('');
    const [horaFim, setHoraFim] = React.useState('');

    return (
        <div><h2 style={{marginBottom: 0}}>{dia}</h2>
            <div style={{display: 'flex'}}>
                <InputText
                    type={'number'}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    style={{width: '20%'}}
                    value={horaInicio}
                    inputStyle={{textAlign: 'center', fontSize: '19px'}} label={''}/>
                às <InputText style={{width: '20%'}}
                              type={'number'}
                              value={horaFim}
                              onChange={(e) => setHoraFim(e.target.value)}
                              inputStyle={{textAlign: 'center', fontSize: '19px'}} label={''}/>
                &nbsp; &nbsp; &nbsp; <Button className={'plus'}
                                             type={'button'}
                                             onClick={() => {
                                                 let newAtendimentos = {...atendimentos};
                                                 newAtendimentos[dia].push({inicio: horaInicio, fim: horaFim});
                                                 setAtendimentos(newAtendimentos);
                                                 setHoraInicio('');
                                                 setHoraFim('');
                                             }}
                                             text={<i className={'fa fa-plus'}/>}
                                             width={'50px'}/>
            </div>
            {
                atendimentos[dia].map((valor) => (
                    <div style={{display: 'flex'}}>
                        <InputText
                            type={'number'}
                            onChange={(e) => setHoraInicio(e.target.value)}
                            style={{width: '20%'}}
                            disabled={true}
                            defaultValue={valor.inicio}
                            inputStyle={{textAlign: 'center', fontSize: '19px'}} label={''}/>
                        às <InputText style={{width: '20%'}}
                                      type={'number'}
                                      defaultValue={valor.fim}
                                      disabled={true}
                                      onChange={(e) => setHoraFim(e.target.value)}
                                      inputStyle={{textAlign: 'center', fontSize: '19px'}} label={''}/>
                    </div>
                ))
            }
        </div>
    )
}

DiaAtendimento.propTypes = {
    dia: PropTypes.string,
    atendimentos: PropTypes.object,
    setAtendimentos: PropTypes.func,
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(DiaAtendimento)