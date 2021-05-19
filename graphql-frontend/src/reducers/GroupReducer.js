const initState = {
    acceptedGroups: [],
    invitedGroups: []
}

const groupReducer = (state = initState, action)=>{
    switch(action.type){
        case 'ADD_GROUPS': {
            return {
                ...state,
                acceptedGroups: action.payload.acceptedGroups || state.acceptedGroups,
                invitedGroups: action.payload.invitedGroups || state.invitedGroups,
            }
        }
        case 'ADD_ACTIVE_GROUP': {
            return {
                ...state,
                acceptedGroups: [
                    ...state.acceptedGroups,
                    ...action.payload,
                ]
            }
        }
        case 'ACCEPT_GROUP_INVITE': {
            return {
                ...state,
                acceptedGroups: [
                    ...state.acceptedGroups,
                    ...action.payload,
                ],
                invitedGroups : state.invitedGroups.filter(group => group.id !== action.payload.id)
            }
        }
        case 'REMOVE_ACTIVE_GROUPS':{
            return {
                ...state,
                acceptedGroups : state.acceptedGroups.filter(group => group.id !== action.payload.id)
            }
        }

        case 'REMOVE_INVITES': {
            return {
                ...state,
                invitedGroups : state.invitedGroups.filter(group => group.id !== action.payload.id)
            }
        }

        case 'ADD_INVITES': {
            return {
                ...state,
                invitedGroups : [
                    ...state.invitedGroups,
                    ...action.payload
                ]
            }
        }

        default: {
            return state;
        }
    }
}

export default groupReducer;
