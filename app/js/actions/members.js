import 'whatwg-fetch';

function loadMembers(token) {
  return dispatch => {
    dispatch({type: 'members.loading'});
    fetch('/private/members?token=' + token)
      .then(response => {
        if(!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(r => r.json())
      .then(response => {
        dispatch({type: 'members.loaded', members: response});
      })
      .catch(err => {
        console.log(err);
        dispatch({type: 'members.error', error: err});
      });
  };
}

function approve(token, id) {
  return dispatch => {
    dispatch({type: 'members.approving'});
    fetch(`/private/members/${id}/approve?token=${token}`, {
      method: 'POST'
    }).then(response => response.json())
      .then(json => {
        dispatch({type: 'members.approved', id: id, approved: json.approvedate});
      }).catch(err => {
        dispatch({type: 'members.approveerror', error: err});
      });
  };
}

function pay(token, id, date) {
  return dispatch => {
    dispatch({type: 'members.paying'});
    fetch(`/private/members/${id}/pay?token=${token}&date=${date}`, {
      method: 'POST'
    }).then(response => response.json())
      .then(json => {
        dispatch({type: 'members.paid', id: id, paid: json.paiddate})
      }).catch(err => {
        dispatch({type: 'members.payerror', error: err});
      });
  };
}

export {
  loadMembers,
  approve,
  pay
};
