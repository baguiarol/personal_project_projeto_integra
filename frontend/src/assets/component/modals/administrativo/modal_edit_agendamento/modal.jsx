import React from 'react';
import ModalParent from "../../modal_parent/modal";
import Button from "../../../button/button";

const ModalEditAgendamento = props => {
    //Modal para fazer trocar pagamento, execução ou cancelar.
    return (
        <ModalParent
            header={<header>
                <div>
                    <h1>Adicionar Reserva</h1>
                    <h3>Sexta, 27 de Janeiro de 2019</h3>
                </div>
                <div className={'close_container'} onClick={close}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            body={<div>
            </div>}
            footer={
                <div className={'footer'}>
                    {'nome' in administradorSelected ?
                        <div className={'flex crud_ops'}>
                            <Button text={'Remover'} type={'button'} onClick={async () => {
                                if (window.confirm("Tem certeza que deseja apagar esse administrador do sistema?")) {
                                    await removeAdministrativo();
                                    closeModal();
                                    setEditing(false);
                                }
                            }}/>
                            <Button editing={editing}
                                    onClick={() => setEditing(true)}
                                    text={'Editar'}
                                    type={'button'}/>
                        </div> : <></>}
                    <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                </div>
            }
        />
    )
};

export default ModalEditAgendamento;