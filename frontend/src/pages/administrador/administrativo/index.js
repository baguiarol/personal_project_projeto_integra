import React from 'react';
import './admin.sass';
import AdministradorTopbar from '../../../assets/component/adm_topbar/adm_topbar';
import CardAdministrativo from '../../../assets/component/card_administrativo/cardAdministrativo';
import Fab from '../../../assets/component/Fab/Fab';
import { ActionsFn } from '../../../redux/actions/actions';
import ModalTypes from '../../../assets/modal_types';
import ModalNewAdministrativo from '../../../assets/component/modals/administrativo/modal_new_administrativo/modal_new_administrativo';
import { useDispatch, useSelector } from 'react-redux';
import administradorDAO from '../../../DAO/administradorDAO';
import { Redirect, useHistory } from 'react-router';

const AdministrativoPage = () => {
  const hist = useHistory();

  const { mongoClient, userLogged, modalType, showModal } = useSelector(
    (state) => state.general
  );
  const { administradores } = useSelector((state) => state.administradores);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (administradorDAO.db) {
      administradorDAO.findAll().then((adms) => {
        dispatch(ActionsFn.setAdministrativo(adms));
      });
    }
    if ('ocupacao' in userLogged) {
      hist.push('/');
    }
  }, [mongoClient, hist]);

  return 'nome' in userLogged ? (
    <div>
      <ModalNewAdministrativo
        close={() => dispatch(ActionsFn.closeModal())}
        show={showModal && modalType === ModalTypes.adicionarAdministrador}
      />
      <AdministradorTopbar pageSelected={'administrativo'} />
      <div className={'container_adms'}>
        {administradores.map((adm, index) => (
          <CardAdministrativo key={index} administrador={adm} />
        ))}
      </div>
      <Fab
        onClick={() => {
          dispatch(ActionsFn.openModal(ModalTypes.adicionarAdministrador));
        }}
      />
    </div>
  ) : (
    <Redirect to={'/'} />
  );
};

export default AdministrativoPage;
