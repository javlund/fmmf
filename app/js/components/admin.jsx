import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import FixedDataTable from 'fixed-data-table';
import {TextCell, AddressCell, CountryCell, PaidCell, MoreCell} from './lib/cells';
import PayDate from './lib/paydate';
import {login, getToken, setAdminPage} from '../actions/auth';
import {loadMembers, approve, pay} from '../actions/members';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'whatwg-fetch';

import loadingIndicator from '../../images/ajax-loader.gif';
import 'fixed-data-table/dist/fixed-data-table.min.css';


const {Table, Column, Cell} = FixedDataTable;

const DATE_FORMAT = 'DD/MM YYYY';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreInfo: false,
      member: {}
    };
    this.seeMore = this.seeMore.bind(this);
    this.mailAllMembers = this.mailAllMembers.bind(this);
  }

  componentWillMount() {
    this.props.getToken();
  }

  componentDidMount() {
    this.props.setAdminPage(true);
  }

  componentWillUnmount() {
    this.props.setAdminPage(false);
  }

  componentWillUpdate(nextProps) {
    const oldToken = this.props.token;
    const newToken = nextProps.token;
    if(!oldToken && newToken) {
      this.props.loadMembers(newToken);
    }
  }

  mailAllMembers() {
    
  }

  seeMore(id) {
    this.setState({
      moreInfo: true,
      memberId: id
    });
  }

  login() {
    const {login, loadMembers} = this.props;
    login()
      .then(token => {
        loadMembers(token);
      });
  }

  render() {
    const {loggedIn, loading, token, login, members, approve, pay} = this.props;
    if(loading) {
      return (
        <div>
          <img src={loadingIndicator} />
        </div>
      );
    }
    if(!loggedIn) {
      return (
        <div>
          <button className="btn btn-default" onClick={login}>Log ind</button>
        </div>
      );
    }
    const modalStyle = {
      content: {
        top: '100px',
        left: '200px',
        right: '200px',
        bottom: '100px',
        border: 'solid 1px black'
      }
    };
    const {memberId} = this.state;
    const member = memberId && members.find(entry => entry.id === memberId);

    const DatePickerButton = props => {
      return <button className="btn btn-sm btn-default" onClick={props.onClick}>{props.text}</button>;
    };

    return (
      <div>
        <p style={{float: 'right'}}>
          {members.length} medlemmer i foreningen 
          <button className="btn btn-default btn-sm left-space" onClick={this.mailAllMembers}>Send mail til alle</button>
        </p>
        <Table
          rowClassNameGetter={() => 'admin-table'}
          width={1180}
          height={400}
          rowHeight={50}
          headerHeight={50}
          rowsCount={members.length}
          {...this.props}
        >
          <Column
            header={<Cell className="admin-table-header">ID</Cell>}
            width={100}
            cell={<TextCell data={members} col="id" />}
          />
          <Column
            header={<Cell className="admin-table-header">Navn</Cell>}
            width={200}
            cell={<TextCell data={members} col="name" />}
          />
          <Column
            header={<Cell className="admin-table-header">E-mail</Cell>}
            width={200}
            cell={<TextCell data={members} col="email" />}
          />
          <Column
            header={<Cell className="admin-table-header">Adresse</Cell>}
            width={300}
            cell={<AddressCell data={members} />}
          />
          <Column
            header={<Cell className="admin-table-header">Land</Cell>}
            width={100}
            cell={<CountryCell data={members} />}
          />
          <Column
            header={<Cell className="admin-table-header">Betalt</Cell>}
            width={60}
            cell={<PaidCell data={members} />}
          />
          <Column
            header={<Cell className="admin-table-header">Mere</Cell>}
            width={60}
            cell={<MoreCell data={members} seeMore={this.seeMore}>Mere</MoreCell>}
          />
        </Table>
        {member && 
          <Modal
            style={modalStyle}
            isOpen={this.state.moreInfo}
            onRequestClose={() => this.setState({moreInfo: false, memberId: null})}
          >
            <h4>{member.name}</h4>
            <a href="mailto:{member.email}">{member.email}</a><br />
            {member.address}<br />
            {member.zip} {member.city}<br />
            {member.country.label}<br />
            Godkendt: {
              member.approved ?
                <span style={{color: '#00ff00'}}>{moment(member.approved).format(DATE_FORMAT)}</span> :
                <button className="btn btn-default btn-sm" onClick={() => approve(token, member.id)}>Aldrig</button>
            }<br />
            Sidst betalt: <PayDate date={member.lastpaid} /> 
            <DatePicker 
              customInput={<DatePickerButton text="Betal" />}  
              startDate={moment()} 
              onChange={date => pay(token, memberId, date.valueOf())}
            />
            
          </Modal>
        }
      </div>
    );
  }
}

Admin.propTypes = {
  loggedIn: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  token: React.PropTypes.string,
  members: React.PropTypes.array,
  getToken: React.PropTypes.func,
  login: React.PropTypes.func,
  setAdminPage: React.PropTypes.func,
  loadMembers: React.PropTypes.func,
  approve: React.PropTypes.func,
  pay: React.PropTypes.func
};

const mapStateToProps = state => {
  return {...state.auth, ...state.members};
};

const mapStateToDispatch = {
  getToken,
  login,
  setAdminPage,
  loadMembers,
  approve,
  pay
};

export default connect(mapStateToProps, mapStateToDispatch)(Admin);
