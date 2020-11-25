import React from 'react';
import './Notification.sass';
import ProfissionalSnack from '../ProfissionalSnack/ProfissionalSnack';
import { Notificacao } from '../../../../../DAO/NotificacaoDAO';
import moment from 'moment';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const Notification = (props: { data: Notificacao }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>(props.data.texto);

  const editor = React.useMemo(() => withReact(createEditor()), []);

  return (
    <React.Fragment>
      <div className={'notification'}>
        <div className={'right_side'}>
          <h1>{props.data.titulo}</h1>

          <Slate editor={editor} value={value} onChange={() => {}}>
            <Editable />
          </Slate>

          <p style={{ fontSize: 10, color: '#AAA' }}>
            Criado dia:{' '}
            {moment(new Date(props.data.criadoAs)).format('DD/MM/YYYY')}
          </p>
        </div>
        <div className={'left_side'}>
          <h3>Enviado a:</h3>
          <p>{props.data.enviar_para === 'all' ? 'Todos' : <></>}</p>
        </div>
        <div
          className={open ? 'indicator opened' : 'indicator'}
          onClick={() => setOpen(!open)}
        >
          <i className={'fas fa-chevron-down'} />
        </div>
      </div>
      <div
        className={open ? 'notification_details open' : 'notification_details'}
      >
        <h3>Visto por:</h3>
        <div className={'vistopor_container'}>
          { props.data.visto_por.length === 0 ? <p style={{fontSize: 12, color: '#888'}}>Ninguém ainda viu essa notificação...</p> : props.data.visto_por.map(user => (< ProfissionalSnack />))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Notification;
