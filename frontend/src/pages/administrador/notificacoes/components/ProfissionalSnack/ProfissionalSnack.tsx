import React from 'react';
import './ProfissionalSnack.sass';
import { Profissional } from '../../../../../DAO/clienteDAO';

const ProfissionalSnack = ({
  profissional,
}: {
  profissional: Profissional;
}) => {
  return (
    <div className={'profissional_snack'}>
      <img
        src={'foto_url' in profissional ? profissional.foto_url : ''}
        alt={''}
      />
      <p>{profissional.nome}</p>
    </div>
  );
};

export default ProfissionalSnack;
