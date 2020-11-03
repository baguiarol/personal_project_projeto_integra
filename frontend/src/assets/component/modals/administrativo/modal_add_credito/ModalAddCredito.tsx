import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalParent from '../../modal_parent/modal';
import Button from '../../../button/button';
import './ModalAddCredito.sass';
import { toast } from 'react-toastify';
import clienteDAO from '../../../../../DAO/clienteDAO';
import Actions from '../../../../../redux/actions/actions';
import logDAO from '../../../../../DAO/logDAO';
import { Profissional } from '../../../../../DAO/clienteDAO';

export const EditCredito = async (
  profissional: Profissional,
  quantidade: number,
  quantidadeAntiga: number,
  toast,
  userLogged,
  setProfissionais,
  setQuantidadeAntiga?
) => {
  toast.warn(
    `Carregando: ${
      quantidade - quantidadeAntiga > 0 ? 'Adicionar' : 'Remover'
    } ${Math.abs(quantidade - quantidadeAntiga)} créditos de ${
      profissional.nome
    }`
  );
  try {
    await clienteDAO.update(
      { _id: profissional._id },
      { creditos: quantidade }
    );
    const profissionais = await clienteDAO.findAll();
    await logDAO.create({
      usuario: userLogged,
      log: `${
        quantidade - quantidadeAntiga > 0 ? 'Adicionado' : 'Removido'
      } ${Math.abs(quantidade - quantidadeAntiga)} créditos para ${
        profissional.nome
      }`,
      data_hora: new Date(),
    });
    if (setQuantidadeAntiga)
      setQuantidadeAntiga(quantidade);
    setProfissionais(profissionais);
    toast.success(
      `${
        quantidade - quantidadeAntiga > 0 ? 'Adicionado' : 'Removido'
      } ${Math.abs(quantidade - quantidadeAntiga)} créditos de ${
        profissional.nome
      }`
    );
  } catch (e) {
    toast.error(
      `Erro ao adicionar ou remover créditos para ${profissional.nome}`
    );
    alert(
      `Houve um erro ao adicionar ou remover créditos para $${profissional.nome}. Verifique o erro na Aba Console em Inspecionar Elemento e envie para os Desenvolvedores`
    );
    console.log('Erro -> ', e);
  }
};

const ModalAddCredito = (props) => {
  const [quantidade, setQuantidade] = React.useState(0);
  const [quantidadeAntiga, setQuantidadeAntiga] = React.useState(0);

  React.useEffect(() => {
    if ('creditos' in props.profissionalSelected) {
      setQuantidade(props.profissionalSelected.creditos);
      setQuantidadeAntiga(props.profissionalSelected.creditos);
    } else {
      setQuantidade(0);
      setQuantidadeAntiga(0);
    }
  }, [props.profissionalSelected]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await EditCredito(
      props.profissionalSelected,
      quantidade,
      quantidadeAntiga,
      toast,
      props.userLogged,
      props.setProfissionais
    );
  };

  return (
    <ModalParent
      show={props.show}
      onSubmit={onSubmit}
      header={
        <header>
          <div>
            <h1>Adicionar Crédito</h1>
            <h2 className={'subtitle'}>{props.profissionalSelected.nome}</h2>
          </div>
          <div
            className={'close_container'}
            onClick={() => {
              props.close();
            }}
          >
            <i className={'fa fa-times'} />
          </div>
        </header>
      }
      close={props.close}
      body={
        <div className={'add_credito_body'}>
          <p>
            Edite abaixo a quantidade de reservas que deseja adicionar ou
            remover.
          </p>
          <div className={'counter'}>
            <h2>
              <i
                className={'fa fa-minus'}
                onClick={() => setQuantidade(quantidade - 1)}
              />
            </h2>
            <h1>{quantidade}</h1>
            <h2>
              <i
                className={'fa fa-plus'}
                onClick={() => setQuantidade(quantidade + 1)}
              />
            </h2>
          </div>
        </div>
      }
      footer={
        <div className={'footer'}>
          <Button type={'submit'} text={'Confirmar'} />
        </div>
      }
    />
  );
};

ModalAddCredito.propTypes = {
  close: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  profissionalSelected: PropTypes.object,
  userLogged: PropTypes.object,
  setProfissionais: PropTypes.func,
};

const mapStateToProps = (state) => ({
  profissionalSelected: state.profissionais.profissionalSelected,
  userLogged: state.general.userLogged,
});

const mapDispatchToProps = (dispatch) => ({
  setProfissionais: (prof) =>
    dispatch({ type: Actions.setProfissionais, payload: prof }),
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(ModalAddCredito);