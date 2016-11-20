import React from 'react';
import T from 'i18n-react';
import database from '../data/database';
import setLanguage from '../languages';

class Paid extends React.Component {
  constructor() {
    super();
    this.state = {
      status: 'awaiting'
    };
  }
  
  componentDidMount() {
    const {id} = this.props.params;
    database.ref(`members/${id}/lastpaid`).on('value', snapshot => {
      if(snapshot.val()) {
        this.setState({
          status: 'completed'
        });
      }
    });
  }

  render() {
    const {status} = this.state;
    const {lang} = this.props.params;
    setLanguage(lang);

    return (
      <div>
        <h1 className="headline"><T.text text="paid.headline" /></h1>
        <p><T.text text="paid.text" /></p>
        <p><T.text text="paid.status" /> <T.text text={`paid.${status}`} /></p>
      </div>
    );
  }
}

Paid.propTypes = {
  params: React.PropTypes.shape({
    lang: React.PropTypes.string,
    id: React.PropTypes.string
  }),
  query: React.PropTypes.shape({
    member_id: React.PropTypes.string
  })
};

export default Paid;
