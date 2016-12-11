import React from 'react';
import T from 'i18n-react';
import NavLink from './navlink';
import AdminLink from './lib/adminlink';
import setLanguage from '../languages';


class Menu extends React.Component {

  render() {
    const {getLanguage} = this.props.route;
    const lang = getLanguage();
    setLanguage(lang);
    return (
      <div className="fmmf-menu">
        <ul className="nav-justified nav-pills">
          <li><NavLink to={"/news/" + lang} className="menu-text"><T.text text={{key: 'news.headline'}} /></NavLink></li>
          <li><NavLink to={"/about/" + lang} className="menu-text"><T.text text={{key: 'about.headline'}} /></NavLink></li>
          <li><NavLink to={"/membership/" + lang} className="menu-text"><T.text text={{key: 'membership.headline'}} /></NavLink></li>
          <li><NavLink to={"/contact/" + lang} className="menu-text"><T.text text={{key: 'contact.headline'}} /></NavLink></li>
        </ul>
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {this.props.children}
            </div>
          </div>
        </div>
        <AdminLink />
      </div>
    )
  }
}

Menu.propTypes = {
  children: React.PropTypes.object,
  route: React.PropTypes.shape({
    getLanguage: React.PropTypes.func
  })
};

export default Menu;
