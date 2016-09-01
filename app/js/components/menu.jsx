import React from 'react';
import NavLink from './navlink';
import T from 'i18n-react';
import setLanguage from '../languages';

class Menu extends React.Component {
  render() {
    let lang = this.props.route.getLanguage();
    setLanguage(lang);
    return (
      <div className="fmmf-menu">
        <ul className="nav-justified nav-pills">
          <li><NavLink to={"/news/" + lang} className="menu-text"><T.text text="news.headline" /></NavLink></li>
          <li><NavLink to={"/about/" + lang} className="menu-text"><T.text text="about.headline" /></NavLink></li>
          <li><NavLink to={"/membership/" + lang} className="menu-text"><T.text text="membership.headline" /></NavLink></li>
          <li><NavLink to={"/contact/" + lang} className="menu-text"><T.text text="contact.headline" /></NavLink></li>
        </ul>
        <div className="content">
        {this.props.children}
        </div>
      </div>
    )
  }
}

Menu.propTypes = {
  children: React.PropTypes.object,
  route: React.PropTypes.object
};

export default Menu;
