const initialState = {loading: false, members: [], approving: false};

function members(state = initialState, action) {
  switch(action.type) {
    case 'members.loading': {
      return Object.assign({}, state, {loading: true})
    }
    case 'members.loaded': {
      return Object.assign({}, state, {loading: false, members: action.members});
    }
    case 'members.error': {
      return Object.assign({}, state, {loading: false, error: action.error});
    }
    case 'members.approving': {
      return Object.assign({}, state, {approving: true});
    }
    case 'members.approved': {
      const id = action.id;
      const members = state.members.map(member => {
        if(member.id === id) {
          return Object.assign({}, member, {approved: action.approved});
        }
        return member;
      });

      return Object.assign({}, state, {members, approving: false});
    }
    case 'members.approveerror': {
      return Object.assign({}, state, {approving: false, approveerror: action.error});
    }
    case 'members.paying': {
      return {...state, paying: true};
    }
    case 'members.paid': {
      const {id, paid} = action;
      const members = state.members.map(member => {
        if(member.id === id) {
          return {...member, lastpaid: paid};
        }
        return member;
      });
      return {...state, members, paying: false};
    }
    case 'members.payerror': {
      return {...state, paying: false, payerror: action.error};
    }
    default: {
      return state;
    }
  }
}

export default members;
