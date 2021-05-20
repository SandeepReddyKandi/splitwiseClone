import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Recieve from './Recieve';
import Give from './GivePayment';
import Modal from './Modal';
import '../dashboard.scss';
import './Modal.css'
import "materialize-css/dist/css/materialize.min.css";
import {useLazyQuery} from "@apollo/client";
import {GET_ALL_EXPENSES} from "../../../graphql/Queries";

const Expenses = (props) => {
    const [getAllExpenses, {loading: getAllExpensesLoading, data: allExpensesData}] = useLazyQuery(GET_ALL_EXPENSES);

    const {recieve, pay} = useSelector(state => {
        return {
            recieve: state.expenseState.recieve,
            pay: state.expenseState.recieve,
            token : state.userState.token
        }
    });

    const [allBalance, setBalance] = useState();

    useEffect(() => {
        const userId = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : null;

        getAllExpenses({
            variables: {
                userId,
            }
        });
    },[]);

    useEffect(() => {
       if (!getAllExpensesLoading) {
           if (allExpensesData && allExpensesData.getAllExpenses.success) {
               setBalance(allExpensesData.getAllExpenses.data);
           }
       }
    }, [getAllExpensesLoading]);


    return (
        <div className="container expenses row z-depth-2">
            <nav className="col m12 grey lighten-3 z-depth-0">
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo black-text text-lighten-3">Dashboard</a>
                    <ul id="nav-mobile" className="right">
                        <li className="btnGrp">
                            <a href="#" className="btn orange darken-3">Add a bill</a>
                            <a className=" btn modal-trigger" data-target="modal1">Settle</a>
                            <Modal/>
                        </li>
                    </ul>
                </div>
            </nav>

            <table className="col m12 highlight centered grey lighten-3">
                <tbody>
                    <tr>
                        <td>
                            <div className="user-exp user-total">
                                <p className="grey-text lighten-2">Total balance</p>
                                <span className="green-text">{allBalance !== undefined ? allBalance.totalcost : ''}</span>
                            </div>
                        </td>
                        <td>
                            <div className="user-exp user-total">
                                <p className="grey-text lighten-2">You are owed</p>
                                <span className="green-text">{ allBalance !== undefined ? allBalance.recieve : ''}</span>
                            </div>
                        </td>
                        <td>
                            <div className="user-exp user-total">
                                <p className="grey-text lighten-2">You owe</p>
                                <span className="green-text">{ allBalance !== undefined ? allBalance.pay : ''}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="col m12">
                <div className="row valign-wrappe center-align amtList">
                    <div className="col m6 payingList">
                        <h5 className="grey-text left">YOU ARE OWED</h5>
                        {

                            allBalance && allBalance.recieveExpenses.length > 0 ? (
                                allBalance.recieveExpenses.map((payment)=>{
                                    return(
                                        <Give paymentList={payment} key={payment.id}/>
                                    )
                                })
                            ) : (
                                <div className="container emptyList row valign-wrapper center-align">
                                    <h5 className="col s12 m12 grey-text emptyText">List is empty</h5>
                                </div>
                            )
                        }
                    </div>
                    <div className="col m6 recievingList">
                        <h5 className="grey-text right">YOU OWE</h5>
                        {
                            allBalance && allBalance.getExpenses.length
                                ? allBalance.getExpenses.map((payment)=>{
                                    return(
                                        <Recieve paymentList={payment} key={payment.id}/>
                                    )
                                }) : (
                                <div className="container emptyList row valign-wrapper center-align">
                                  <h5 className="col s12 m12 grey-text emptyText">List is empty</h5>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Expenses;
