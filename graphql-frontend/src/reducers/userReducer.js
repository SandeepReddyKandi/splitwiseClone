const initState = {
  user: {
    name: '',
    currency: '',
    email: '',
    id: '',
    imageURL: '',
    language: '',
    phone: '',
    timezone: '',
    token: '',
  },
  usersList: [],
  usersToIdMap: {}
};

const userReducer = (state = initState, action)=> {
  switch (action.type) {
    case 'ADD_USER_DATA' : {
      localStorage.setItem('token', JSON.stringify(action.payload.token));
      localStorage.setItem('userId', JSON.stringify(action.payload.id));
      return {
        ...state,
        user: {
          ...action.payload,
          id: action.payload.id,
        }
      }
    }

    case 'UPDATE_USER_DATA' : {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        }
      }
    }

    case 'ADD_USER_LISTS': {
      const usersToIdMap = {};
      const usersList = action.payload || [];
      usersList.map(user => {
        usersToIdMap[user.id] = user.name
      })
      return {
        ...state,
        usersList,
        usersToIdMap
      }
    }

    case 'LOG_OUT': {
      localStorage.clear();
      return {
        ...initState,
      };
    }

    default: {
      return {
        ...state,
      }
    }
  }
}

export default userReducer;
