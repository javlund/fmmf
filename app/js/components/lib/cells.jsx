import React from 'react';
import FixedDataTable from 'fixed-data-table';
import PayDate from './paydate';

const {Cell} = FixedDataTable;

const TextCell = ({rowIndex, data, col, ...props}) => {
  return (
    <Cell {...props}>
      {data[rowIndex][col]}
    </Cell>
  );
};

TextCell.propTypes = {
  rowIndex: React.PropTypes.number,
  data: React.PropTypes.array,
  col: React.PropTypes.string
};

const AddressCell = ({rowIndex, data, ...props}) => {
  const row = data[rowIndex];
  const address = `${row.address}, ${row.zip} ${row.city}`;
  return (
    <Cell {...props}>
      {address}
    </Cell>
  );
};

AddressCell.propTypes = {
  rowIndex: React.PropTypes.number,
  data: React.PropTypes.array  
};


const PaidCell = ({rowIndex, data, ...props}) => {
  const lastPaid = data[rowIndex].lastpaid;
  return (
    <Cell {...props}>
      <PayDate date={lastPaid} />
    </Cell>
  );
};

PaidCell.propTypes = {
  rowIndex: React.PropTypes.number,
  data: React.PropTypes.array
};

const ApprovedCell = ({rowIndex, data, approve, ...props}) => {
  const row = data[rowIndex];
  const lastApproved = row.approved;
  const approved = lastApproved !== 0 ? 'Ja' : 'Nej';
  const styleColor = lastApproved !== 0 ? '#00ff00' : '#ff0000';
  const style = {color: styleColor};
  const id = row.id;
  const name = row.name;
  const title = `Klik her for at godkende ${name}`;
  const content = lastApproved ? approved : <button className="btn btn-sm btn-default" onClick={() => approve(id)} title={title}>{approved}</button>
  return (
    <Cell style={style} {...props}>
      {content}
    </Cell>
  );
};

ApprovedCell.propTypes = {
  rowIndex: React.PropTypes.number,
  data: React.PropTypes.array,
  approve: React.PropTypes.func
};

const MoreCell = ({rowIndex, data, seeMore, ...props}) => {
  const row = data[rowIndex];
  return (
    <Cell>
      <button className="btn btn-default btn-sm" onClick={() => seeMore(row.id)}>{props.children}</button>
    </Cell>
  )
};

MoreCell.propTypes = {
  rowIndex: React.PropTypes.number,
  data: React.PropTypes.array,
  seeMore: React.PropTypes.func,
  children: React.PropTypes.string
};

export {
  TextCell,
  AddressCell,
  PaidCell,
  ApprovedCell,
  MoreCell
};
