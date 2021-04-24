 const initState = {
    recentActivities: [],
    recieve: [],
    groupExpensesMap: {},
    pay: [],
}

const expenseReducer = (state = initState, action)=>{
    switch(action.type) {
        case 'ADD_RECENT_ACTIVITIES': {
            return {
                ...state,
                recentActivities: payload,
            }
        }
        case 'TO_RECIEVE':
            const totalRecievedAmt = [...state.toTake, action.newUser];
            return {
                ...state,
                toTake: totalRecievedAmt
            }

        case 'TO_PAY':
            const totakPayableAmt = [...state.toGive, action.newUser];
            return {
                ...state,
                toGive: totakPayableAmt
            }

        case "DELETE_USER":
            const username = action.payload.userName;

            console.log('action: ', username);

            const recieveList = state.recieve.filter((user) => user.name !== username);
            const payingList = state.pay.filter((user) => user.name !== username);

            return {
                ...state,
                recieve: recieveList,
                pay: payingList
            }
        case "ADD_GROUP_EXPENSE": {
            return {
                ...state,
                groupExpensesMap: {
                    ...state.groupExpensesMap,
                    [action.payload.groupId]: [
                        ...state.groupExpensesMap[action.payload.groupId],
                        ...action.payload.expenses,
                    ]
                }
            }
        }
        case "ADD_GROUP_EXPENSES": {
            return {
                ...state,
                groupExpensesMap: {
                    ...state.groupExpensesMap,
                    [action.payload.groupId]: [
                        ...action.payload.expenses,
                    ]
                }
            }
        }
        default:
            return state;
    }
}

export default expenseReducer;
