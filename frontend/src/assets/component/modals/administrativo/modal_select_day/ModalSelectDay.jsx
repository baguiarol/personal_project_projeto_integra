import React from 'react';
import PropTypes from 'prop-types';
import ModalParent from '../../modal_parent/modal';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/pt-br';
import './ModalSelectDay.sass';

const ModalSelectDay = (props) => {
  return (
    <ModalParent
      show={props.show}
      header={
        <header>
          <div>
            <h1>Alternar Data</h1>
          </div>
          <div className={'close_container'} onClick={props.close}>
            <i className={'fa fa-times'} />
          </div>
        </header>
      }
      body={
        <div className={'body_modal_select_day'}>
          <DayPicker
            localeUtils={MomentLocaleUtils}
            locale={'pt-br'}
            numberOfMonths={2}
            onDayClick={(day, { selected }) => {
              props.onChangeDay(selected ? null : day);
            }}
          />
        </div>
      }
    />
  );
};

ModalSelectDay.propTypes = {
  onChangeDay: PropTypes.func.isRequired,
  show: PropTypes.bool,
  close: PropTypes.func.isRequired,
};

export default ModalSelectDay;
