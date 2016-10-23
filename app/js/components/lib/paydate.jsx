import React from 'react';
import moment from 'moment';

const DATE_FORMAT = 'DD/MM YYYY';

const PayDate = props => {
  const {date} = props;
  const dateAsNumber = Number(date);
  const dateAsMoment = moment(dateAsNumber);
  const paid = dateAsNumber !== 0 ? dateAsMoment.format(DATE_FORMAT) : 'Aldrig';
  const lastYear = moment().subtract(1, 'years');
  const style = {color: (lastYear.isBefore(dateAsMoment) ? '#00ff00' : '#ff0000')};

  return (
    <span style={style}>{paid}</span>
  );
};

PayDate.propTypes = {
  date: React.PropTypes.string
};

export default PayDate;
