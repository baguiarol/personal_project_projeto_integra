/* tslint:disable */
//@ts-nocheck
import React, { useCallback } from 'react';
import ModalParent from '../../modal_parent/modal';
import Button from '../../../button/button';
import InputText from '../../../inputText/input';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Editor, Transforms } from 'slate';
import cx from '@emotion/css';
import css from '@emotion/css';
import './modal_new_notificacao.sass';
import LabelSelect from '../../../LabelSelect/LabelSelect';
import { useSelector } from 'react-redux';
import NotificacaoDAO from '../../../../../DAO/NotificacaoDAO';
import { ActionsFn } from '../../../../../redux/actions/actions';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }
          & > * + * {
            margin-left: 15px;
          }
        `
      )}
    />
  )
);

const ButtonSlate = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'};
        `
      )}
      style={{ marginRight: 20 }}
    />
  )
);

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ButtonSlate
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <i className={icon}></i>
    </ButtonSlate>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ButtonSlate
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <i className={icon}></i>
    </ButtonSlate>
  );
};

const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `
      )}
    />
  )
);

const ModalNewNotificacao = (props: { show; close }) => {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setLoading(true);
    const { titulo, enviar_para, data_expiracao } = form;

    const notification: Notification = {
      titulo: titulo.value,
      texto: textValue,
      visto_por: [],
      criadoAs: new Date(),
      enviar_para: enviar_para.value,
      dataExpiracao: new Date(data_expiracao.value),
    };
    console.log(notification);
    try {
      await NotificacaoDAO.insert(notification);
      const notificacoes = await NotificacaoDAO.findAll();
      dispatch(ActionsFn.setNotifications(notificacoes));
    } catch (e) {
      alert(e);
      console.log(e);
    }
    setLoading(false);
  };

  const editor: any = React.useMemo(() => withReact(createEditor()), []);
  const [textValue, setTextValue] = React.useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const { profissionais } = useSelector((state) => state.profissionais);

  const optionsProfissionais: Array<any> = () => {
    const array = [{ value: 'all', label: 'Todos' }];
    profissionais.forEach((profissional) => {
      array.push({
        value: profissional._id.toString(),
        label: profissional.nome,
      });
    });
    return array;
  };

  const [profissionaisSelect, setProfissionaisSelect] = React.useState([]);
  const [profissionaisSelected, setProfissionaisSelected] = React.useState([]);

  React.useEffect(() => {
    setProfissionaisSelect(optionsProfissionais());
  }, [profissionais]);

  return (
    <ModalParent
      show={props.show}
      onSubmit={onSubmit}
      header={
        <header>
          <div>
            <h1>Nova Notificação</h1>
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
        <div className={'nova_notificacao_body'}>
          <InputText
            label={'Título da Notificação'}
            name={'titulo'}
            placeholder={'Esse título não ficará visível ao Profissional.'}
          />
          <div className={'editor_container'}>
            <Slate
              editor={editor}
              value={textValue}
              onChange={(v: any) => setTextValue(v)}
            >
              <Toolbar>
                <MarkButton format="bold" icon="fas fa-bold" />
                <MarkButton format="italic" icon="fas fa-italic" />
                <MarkButton format="underline" icon="fas fa-underline" />
                <MarkButton format="code" icon="fas fa-code" />
                <BlockButton format={'heading-two'} icon="fas fa-heading" />
              </Toolbar>
              <Editable renderLeaf={renderLeaf} renderElement={renderElement} />
            </Slate>
          </div>
          <LabelSelect
            isMulti={true}
            style={{ marginBottom: 25 }}
            label={'Enviar Para:'}
            onChange={(e) => {
              let all = false;
              e.forEach(({ value }) => {
                if (value === 'all') {
                  all = true;
                }
              });
              console.log(e);
            }}
            name={'enviar_para'}
            options={profissionaisSelect}
          />
          <InputText
            name={'data_expiracao'}
            label={'Data de Expiração'}
            type={'date'}
          />
        </div>
      }
      footer={
        <div className={'footer'}>
          <Button loading={loading} type={'submit'} text={'Confirmar'} />
        </div>
      }
    />
  );
};

export default ModalNewNotificacao;
