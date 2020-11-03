import React from 'react';
import PropTypes from 'prop-types';
import ModalTypes from '../../../modal_types';
import { useDispatch } from 'react-redux';
import { ActionsFn } from '../../../../redux/actions/actions';

const NovoAgendamento = (props) => {
  const dispatch = useDispatch();

  return (
    <td
      className={'free'}
      onClick={() => {
        dispatch(ActionsFn.openModal(ModalTypes.adicionarAgendamentoAdm));
        dispatch(ActionsFn.selectSala(props.sala));
      }}
    >
      <i className={'fa fa-plus'} />
    </td>
  );
};

NovoAgendamento.propTypes = {
  sala: PropTypes.object.isRequired,
};

export default NovoAgendamento;
