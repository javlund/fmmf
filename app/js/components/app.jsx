import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Menu from './menu';
import News from './news';
import About from './about';
import Membership from './membership';
import Admin from './admin';
import Contact from './contact';
import danishIcon from '../../images/small/Denmark.png';
import englishIcon from '../../images/small/United_Kingdom.png';

let currentLocation;

function getNewLocation(lang) {
  let locationLenght = currentLocation.length - 2;
  let location = locationLenght > 1 ? currentLocation.slice(0, locationLenght) : '/news/';
  return location + lang;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'da'
    };
    let routes = <Route path="/" component={Menu} getLanguage={this.getLanguage.bind(this)}>
      <Route path="/news/:lang" component={News} />
      <Route path="/about/:lang" component={About} />
      <Route path="/membership/:lang" component={Membership} />
      <Route path="/contact/:lang" component={Contact} />
      <Route path="/admin" component={Admin} />
      <IndexRoute component={News} />
    </Route>;
    this.router = <Router history={hashHistory}>
      {routes}
    </Router>;
    this.router.props.history.listen((location) => currentLocation = location.pathname);
  }

  render() {
    return (
      <div className="container">
        <div className="languages">
          <img src={danishIcon} onClick={this.toDanish.bind(this)} />
          <img src={englishIcon} onClick={this.toEnglish.bind(this)} />
        </div>
        {this.router}
      </div>
    )
  }

  getLanguage() {
    return this.state.lang;
  }

  toDanish() {
    this.changeLanguage('da');
  }

  toEnglish() {
    this.changeLanguage('en');
  }

  changeLanguage(lang) {
    this.setState({
      lang: lang
    });
    this.router.props.history.push(getNewLocation(lang));
  }
}

export default App;
