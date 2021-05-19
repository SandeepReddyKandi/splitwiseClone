import React, {useEffect, useState} from 'react';
import ExpenseList from './ExpenseList';
import '../dashboard.scss';
import Modal from './Modal';
import './Modal.css'
import "materialize-css/dist/css/materialize.min.css";
import ExpenseBackendAPIService from "../../../services/ExpenseBackendAPIService";
import GroupBackendAPIService from "../../../services/GroupBackendAPIService";
import UserBackendAPIService from '../../../services/UserBackendAPIService';
import {useDispatch, useSelector} from "react-redux";

const UserGroups = (props)=>{
    const [group, setGroup] = useState({
        name: '',
    });
    const [groupId, setGroupId] = useState(props.match.params.id);
    const [allUserExpense, setAllUserExpenses] = useState('');
    const [showUsers, getShowUsers] = useState('');
    const [remainingUsers, getHiddeUsers] = useState('');

    const dispatch = useDispatch();

    const { groupExpensesRedux } = useSelector(state => {
        return {
            groupExpensesRedux: state.expenseState.groupExpensesMap,
        }
    });

    useEffect(() => {
        setGroupId(props.match.params.id);
    }, [])

    useEffect(()=>{
        document.querySelector("#extraInfo").classList.add('vanish');
        document.querySelector("#openDetailsLink").classList.remove('vanish');
        document.querySelector("#closeDetailsLink").classList.add('vanish');

        GroupBackendAPIService.getGroupInfo(groupId).then(({data, success}) => {
            setGroup(data);
        });

        // getting all the expenses
        ExpenseBackendAPIService.getAllExpensesForGroupId(groupId).then(({data, success})=>{
            if (success) {
                updateGroupExpense(data);
            }
        });

        ExpenseBackendAPIService.getBalanceOfEachUserInGoupId(groupId).then(({data, success})=>{
            if(success){
                console.log('balance of each user : ',data);
                setAllUserExpenses(data);
                getShowUsers(data.splice(0, 1));
                getHiddeUsers(data.splice(1, data.length));
            }
        });
    }, [groupId]);

    const updateGroupExpense = (expenses) => {
        dispatch({
            type: 'ADD_GROUP_EXPENSES',
            payload: {
                groupId,
                expenses,
            }
        });
    }

    return (
        <div className="container user-groups">
            <div className="row">
                <div className="expense-list-col col m8 z-depth-1">
                    <div className="header row valign-wrapper grey lighten-2">
                        <div className="col m6 valign-wrapper">
                                <img className="responsive-img" src="https://img.icons8.com/flat-round/64/000000/home--v1.png"/>
                                <span className="center-align">{group.name}</span>
                        </div>
                        <div className="col m6 valign-wrapper expenseBtn">
                            <Modal groupId={groupId}/>
                        </div>
                    </div>
                    {
                        groupExpensesRedux[groupId] ?
                            (
                                <div className='expense-list-cont'>
                                    <table className="centered highlight expenses-list-table">
                                        <tbody>
                                        {
                                            groupExpensesRedux[groupId].length && groupExpensesRedux[groupId].map((expenses)=>{
                                                return (
                                                    <ExpenseList expenselist={expenses} key={expenses.id}/>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            ):
                            (
                                <div>No Group expenses :) </div>
                            )
                    }
                </div>
                 <div className="col m4">
                    <div className="row">
                        <div className="col m12 s12 sidebar-header ">
                            <h6 className="grey-text">GROUP BALANCES</h6>
                        </div>
                        <div className="col m12 s12" id="main-list">
                            <ul className="collection users-collection" id="mainInfo">
                                {
                                    allUserExpense !== undefined ? (
                                        showUsers.length ?
                                            (
                                                showUsers.map((usr) =>{
                                                    return (
                                                        <li className="collection-item">
                                                            <div className="row valign-wrapper" style={{marginBottom: "0px"}}>
                                                                <img className="col m3" src="https://img.icons8.com/fluent/50/000000/user-male-circle.png"/>
                                                                <div className="col m9 left-align">
                                                                    <h6 style={{marginBottom: "0px"}}>{usr.user}</h6>
                                                                    {
                                                                        usr.amt > 0 ?
                                                                            <p className="orange-text" style={{marginTop: "0px"}}>Owes USD {usr.amt}</p> :
                                                                            <p className="green-text" style={{marginTop: "0px"}}>Owes USD {-usr.amt}</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            ):
                                            (
                                                <div>Loading...</div>
                                            )
                                    ):(
                                        ''
                                    )
                                }
                            </ul>
                            <ul className="collection users-collection vanish" id="extraInfo">
                                {
                                    allUserExpense !== undefined ? (
                                        remainingUsers.length ?
                                            (
                                                remainingUsers.map((usr) =>{
                                                    return (
                                                        <li className="collection-item">
                                                            <div className="row valign-wrapper" style={{marginBottom: "0px"}}>
                                                                <img className="col m3" src="https://img.icons8.com/fluent/50/000000/user-male-circle.png"/>
                                                                <div className="col m9 left-align">
                                                                    <h6 style={{marginBottom: "0px"}}>{usr.user}</h6>
                                                                    {
                                                                        usr.amt > 0 ?
                                                                            <p className="orange-text" style={{marginTop: "0px"}}>Owes USD {usr.amt}</p> :
                                                                            <p className="green-text" style={{marginTop: "0px"}}>Owes USD {-usr.amt}</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            ):
                                            (
                                                <div>Loading...</div>
                                            )
                                    ):(
                                        ''
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="view-details">
                        <p id="openDetailsLink" className="contentLink row" onClick={()=>{
                            document.querySelector("#extraInfo").classList.toggle('vanish');
                            document.querySelector("#openDetailsLink").classList.toggle('vanish');
                            document.querySelector("#closeDetailsLink").classList.toggle('vanish');
                        }}><span className="col m12">view more >> </span></p>

                        <p id="closeDetailsLink" className="contentLink vanish row" onClick={()=>{
                            document.querySelector("#extraInfo").classList.toggle('vanish');
                            document.querySelector("#openDetailsLink").classList.toggle('vanish');
                            document.querySelector("#closeDetailsLink").classList.toggle('vanish');
                        }}><span className="col m12">X</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserGroups;
