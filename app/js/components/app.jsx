import React from 'react';
import {connect} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Menu from './menu';
import News from './news';
import About from './about';
import Membership from './membership';
import Contact from './contact';
import Admin from './admin';
import Payment from './payment';
import Paid from './paid';
import Cancelled from './cancelled';
import danishIcon from '../../images/dk.png';
import englishIcon from '../../images/uk.png';

let currentLocation;

function getNewLocation(lang) {
  const locationLenght = currentLocation.length - 2;
  const location = locationLenght > 1 ? currentLocation.slice(0, locationLenght) : '/news/';
  return location + lang;
}

function getLangFromPath() {
  const pathname = window.location.pathname;
  const lastpath = pathname.substr(pathname.lastIndexOf('/') + 1, pathname.length);
  return ['da', 'en'].indexOf(lastpath) !== -1 ? lastpath : 'da'  
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.getLanguage = this.getLanguage.bind(this);
    const routes = <Route path="/" component={Menu} getLanguage={this.getLanguage}>
      <Route path="/news/:lang" component={News} />
      <Route path="/about(/:thanks)/:lang" component={About} />
      <Route path="/membership/:lang" component={Membership} />
      <Route path="/contact/:lang" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/payment/:id/:lang" component={Payment} />
      <Route path="/paid/:id/:lang" component={Paid} />
      <Route path="/cancelled/:id/:lang" component={Cancelled} />
      <IndexRoute component={News} />
    </Route>;
    this.router = (
      <Router history={browserHistory}>
        {routes}
      </Router>
    );
    this.state = {
      lang: getLangFromPath()
    };
    this.router.props.history.listen((location) => currentLocation = location.pathname);
  }

  render() {
    const {isAdminPage} = this.props;
    return (
      <div className="container">
        {!isAdminPage && (
          <ul className="languages">
            <li><a href="#" onClick={this.toDanish.bind(this)}><img src={danishIcon} /></a></li>
            <li><a href="#" onClick={this.toEnglish.bind(this)}><img src={englishIcon} /></a></li>
          </ul>
        )}
        {this.router}
      </div>
    )
  }

  getLanguage() {
    return this.state.lang;
  }

  toDanish(event) {
    event.preventDefault();
    this.changeLanguage('da');
  }

  toEnglish(event) {
    event.preventDefault();
    this.changeLanguage('en');
  }

  changeLanguage(lang) {
    this.setState({
      lang: lang
    });
    this.router.props.history.push(getNewLocation(lang));
  }
}

App.propTypes = {
  isAdminPage: React.PropTypes.bool
};

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn,
    isAdminPage: state.auth.isAdminPage
  };
};

export default connect(mapStateToProps)(App);
