import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ModalParent from '../../modal_parent/modal';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import NotificacaoDAO, { Notificacao } from '../../../../../DAO/NotificacaoDAO';
import Button from '../../../button/button';
import { RootState } from '../../../../../redux/storeTypes';
import {ActionsFn} from "../../../../../redux/actions/actions";

const ModalNotificacao = ({
  open,
  close,
}: {
  open: boolean;
  close: () => any;
}) => {
  const [loading, setLoading] = React.useState(false);

  const editor = React.useMemo(() => withReact(createEditor()), []);
  const renderElement = React.useCallback(
    ({ attributes, children, element }) => {
      switch (element.type) {
        case 'heading-one':
          return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
          return <h2 {...attributes}>{children}</h2>;
        default:
          return <p {...attributes}>{children}</p>;
      }
    },
    []
  );

  const renderLeaf = React.useCallback(({ attributes, children, leaf }) => {
    return (
      <span
        {...attributes}
        style={{
          fontWeight: leaf.bold ? 'bold' : 'normal',
          fontStyle: leaf.italic ? 'italic' : 'normal',
        }}
      >
        {children}
      </span>
    );
  }, []);

  const {
    notificationSelected,
  }: { notificationSelected: Notificacao } = useSelector(
    (state: RootState) => state.notifications
  );

  const { userLogged } = useSelector((state: RootState) => state.general);
  const dispatch = useDispatch()

  return (
    <ModalParent
      show={open}
      close={close}
      onSubmit={(e) => {
        e.preventDefault();
        alert('clicked');
      }}
      header={
        <header style={{margin: 0, marginTop: '2%'}}>
          <h1>Notificação</h1>
          <div className={'close_container'} onClick={close}>
            <i className={'fa fa-times'} />
          </div>
        </header>
      }
      body={
        <div>
          <p>
            <Slate
              editor={editor}
              onChange={() => {}}
              value={
                notificationSelected?.texto ? notificationSelected?.texto : []
              }
            >
              <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
            </Slate>
          </p>
        </div>
      }
      footer={
        <footer style={{ textAlign: 'right', marginBottom: '15px' }}>
          <Button
            onClick={async () => {
              setLoading(true);
              await NotificacaoDAO.ciente(
                notificationSelected._id,
                userLogged._id
              );
              const notificacoes = await NotificacaoDAO.findAll();
              dispatch(ActionsFn.setNotifications(notificacoes));
              setLoading(false);
            }}
            loading={loading}
            width={'45%'}
            text={'Entendido, Ciente'}
          />
        </footer>
      }
    />
  );
};

export default ModalNotificacao;
