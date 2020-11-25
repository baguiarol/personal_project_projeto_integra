import React from 'react';
import "./ProfissionalSnack.sass"

const ProfissionalSnack = () => {
  return (
    <div className={'profissional_snack'}>
      <img
        src={
          'https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-2.jpg'
        }
        alt={''}
      />
      <p>Terry Crews</p>
    </div>
  );
};

export default ProfissionalSnack;
