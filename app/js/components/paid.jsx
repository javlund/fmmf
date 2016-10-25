import React from 'react';
import T from 'i18n-react';
import io from 'socket.io-client';
import setLanguage from '../languages';

const socket = io('http://localhost');

class Paid extends React.Component {
  constructor() {
    super();
    this.state = {
      status: 'Awaiting'
    };
  }
  
  componentDidMount() {
    const {id} = this.props.params;
    socket.on('statusChange', data => {
      if(data.id === id) {
        this.setState({
          status: data.status
        });
      }
    })
  }

  render() {
    const {status} = this.state.status;
    const {lang} = this.props.params;
    setLanguage(lang);

    return (
      <div>
        <h1 className="headline"><T.text text="paid.headline" /></h1>
        <p><T.text text="paid.text" /></p>
        <p><T.text text="paid.status" /> {status}</p>
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
