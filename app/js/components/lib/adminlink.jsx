import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {logout} from '../../actions/auth';
import cogIcon from '../../../images/cog.png';
import exitIcon from '../../../images/exit.png';

class AdminLink extends React.Component {
  render() {
    const {loggedIn, isAdminPage, logout} = this.props;
    const canLogout = loggedIn && isAdminPage;
    return (
      <div className="admin-link">
        {!canLogout && (
          <Link to="/admin">
            <img src={cogIcon} />
          </Link>
        )}
        {canLogout && (
          <img onClick={logout} src={exitIcon} />
        )}
      </div>
    );
  }
}

AdminLink.propTypes = {
  loggedIn: React.PropTypes.bool,
  isAdminPage: React.PropTypes.bool,
  logout: React.PropTypes.func
};

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn,
    isAdminPage: state.auth.isAdminPage
  };
};

const mapDispatchToProps = {
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminLink);
