import React from 'react';
import './HorarioAtendimento.sass';
import InputText from '../../../../../assets/component/inputText/input';
import Button from '../../../../../assets/component/button/button';
import DiaAtendimento from '../DiaAtendimento/DiaAtendimento';
import clienteDAO from '../../../../../DAO/clienteDAO';
import { useSelector } from 'react-redux';

const HorarioAtendimento = (props) => {
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const [atendimentos, setAtendimentos] = React.useState({
    Seg: [],
    Ter: [],
    Qua: [],
    Qui: [],
    Sex: [],
    Sab: [],
  });
  const [loading, setLoading] = React.useState(false);

  const { userLogged } = useSelector((state) => state.general);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    let data = { horarios: atendimentos };
    if (form.valor.value !== '') {
      data = { ...data, valorAtendimento: form.valor.value };
    }
    await clienteDAO.update({ _id: userLogged._id }, data);
    setLoading(false);
  };

  React.useEffect(() => {
    if (userLogged) {
      if ('horarios' in userLogged) {
        setAtendimentos(userLogged.horarios);
      }
    }
  }, [userLogged]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <InputText
          defaultValue={userLogged.valorAtendimento}
          label={'Valor do Atendimento Inicial'}
          type={'number'}
          name={'valor'}
          style={{ width: '23%' }}
        />
        <div className={'horario_atendimento'}>
          <div className={'column'}>
            {dias.map((dia, index) =>
              index < 3 ? (
                <DiaAtendimento
                  dia={dia}
                  setAtendimentos={(novosAtendimentos) =>
                    setAtendimentos(novosAtendimentos)
                  }
                  atendimentos={atendimentos}
                />
              ) : (
                <></>
              )
            )}
          </div>
          <div className={'column'}>
            {dias.map((dia, index) =>
              index >= 3 ? (
                <DiaAtendimento
                  dia={dia}
                  setAtendimentos={(novosAtendimentos) =>
                    setAtendimentos(novosAtendimentos)
                  }
                  atendimentos={atendimentos}
                />
              ) : (
                <></>
              )
            )}
          </div>
        </div>
        <br />
        <Button loading={loading} text={'Salvar Horários'} width={'300px'} />
      </form>
    </div>
  );
};

export default HorarioAtendimento;
