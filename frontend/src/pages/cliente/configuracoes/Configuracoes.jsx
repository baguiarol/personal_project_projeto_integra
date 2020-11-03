import React from 'react';
import { connect } from 'react-redux';
import './Configuracoes.sass';
import InputText from '../../../assets/component/inputText/input';
import Button from '../../../assets/component/button/button';
import ClienteTopbar from '../../../assets/component/cliente_topbar/topbar';
import { Link } from 'react-router-dom';
import LabelSelect from '../../../assets/component/LabelSelect/LabelSelect';
import HorarioAtendimento from './components/HorarioAtendimento/HorarioAtendimento';
import moment from 'moment';
import clienteDAO from '../../../DAO/clienteDAO';
import ModalTrocarFoto from './components/ModalTrocarFoto/ModalTrocarFoto';

const Configuracoes = (props) => {
  const options = [
    'Nutricionista',
    'Psicólogo',
    'Fonoaudiólogo',
    'Fisioterapeuta',
    'Acupunturista',
    'Psicopedagogo',
    'Psicanalista',
    'Terapeuta',
    'Farmacêutico',
    'Médico',
    'Psiquiatra',
  ];

  const generateOptions = () =>
    options.map((option) => ({ label: option, value: option }));

  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const onSubmitDados = async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      nome: form.nome.value,
      dataNascimento: form.dataNascimento.value,
      registro: form.registro.value,
      cpf: form.cpf.value,
      telefone: form.telefone.value,
      endereco: form.endereco.value,
      cep: form.cep.value,
      descricao: form.descricao.value,
    };
    setLoading(true);
    await clienteDAO.update({ _id: props.userLogged._id }, data);
    alert('Dados guardados com sucesso!');
    setLoading(false);
  };

  return (
    <div className={'configuracoes_container'}>
      <ClienteTopbar />
      <div style={{ marginTop: 35 }}>
        <Link to={'/agendamentos'}>
          <i className={'fas fa-chevron-left'} /> &nbsp; Voltar para Página
          Inicial
        </Link>
      </div>
      <ModalTrocarFoto show={showModal} close={() => setShowModal(false)} />
      <div className={'configuracoes_body'}>
        <form onSubmit={onSubmitDados}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'flex-end',
              marginTop: 35,
            }}
          >
            <div>
              <div
                onClick={() => setShowModal(true)}
                className={'foto_changer'}
                style={{
                  backgroundImage: 'url(' + props.userLogged.foto_url + ')',
                }}
              >
                <div>Trocar Foto</div>
              </div>
            </div>
            <InputText
              name={'nome'}
              style={{ flexGrow: 2, marginRight: 15 }}
              defaultValue={props.userLogged.nome}
              label={'Nome Completo'}
              required
            />
            <InputText
              required
              name={'dataNascimento'}
              defaultValue={moment(
                new Date(props.userLogged.dataNascimento)
              ).format('YYYY-MM-DD')}
              type={'date'}
              style={{ flexGrow: 0.5, marginRight: 15 }}
              label={'Data de Nascimento'}
            />
            <LabelSelect
              label={'Profissão'}
              style={{ flexGrow: 1, marginRight: 15 }}
              options={generateOptions()}
            />
            <InputText
              required
              name={'registro'}
              defaultValue={props.userLogged.registro}
              label={'Nº de Registro'}
              style={{ flexGrow: 0.3, marginRight: 15 }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%', marginTop: 35 }}>
            <InputText
              required
              name={'cpf'}
              defaultValue={props.userLogged.cpf}
              style={{ flexGrow: 0.5, marginRight: 15 }}
              label={'CPF'}
            />
            <InputText
              required
              name={'telefone'}
              defaultValue={props.userLogged.telefone}
              style={{ flexGrow: 0.5, marginRight: 15 }}
              label={'Telefone'}
            />
            <InputText
              name={'endereco'}
              required
              defaultValue={props.userLogged.endereco}
              style={{ flexGrow: 2, marginRight: 15 }}
              label={'Endereço'}
            />
            <InputText
              name={'cep'}
              required
              defaultValue={props.userLogged.cep}
              label={'CEP'}
              style={{ flexGrow: 0.5, marginRight: 15 }}
            />
          </div>
          <h2>Alterar Descrição</h2>
          <p>
            Sua descrição é seu currículo, você pode incluir o que você faz, sua
            formação acadêmica, e quanto tempo de experiência na área que você
            atua.
          </p>
          <p>
            <textarea
              name={'descricao'}
              defaultValue={props.userLogged.descricao}
              required
              placeholder={'Sua nova descrição vai aqui.'}
              style={{ width: '50%', height: 150, padding: 15 }}
            />
          </p>
          <Button loading={loading} text={'Confirmar'} width={'250px'} />
        </form>
        <h2>Horários de Atendimento</h2>
        <HorarioAtendimento />
        <h2>Recuperar Senha</h2>
        <p>
          Enviaremos um e-mail para seu e-mail cadastrado para redefinir a sua
          senha.
        </p>
        <Button loading={loading} text={'Enviar e-mail'} width={'350px'} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userLogged: state.general.userLogged,
});

export default connect(mapStateToProps)(Configuracoes);
