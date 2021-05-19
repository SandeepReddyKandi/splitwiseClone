import axios from "axios";
import {toast} from "react-toastify";

const API_ENDPOINT = `${process.env.REACT_APP_ENDPOINT}/expenses`;

class ExpenseBackendAPIService {
    static getToken = () => localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;

    static async getAllExpenses() {
        const url = `${API_ENDPOINT}/all`;
        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })
            return response.data;
        } catch (e) {
            toast.error('Something went wrong while getting all groups!');
            return {
                success: false,
            }
        }
    }

    static async getAllExpensesForGroupId(groupId) {
        const url = `${API_ENDPOINT}/all-group/${groupId}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })

            return response.data;
        } catch (e) {
            toast.error('Something went wrong while getting all expenses for this group!');
            return {
                success: false,
            }
        }
    }

    static async getBalanceOfEachUserInGoupId(groupId) {
        const url = `${API_ENDPOINT}/balance-group/${groupId}`;
        try {
            const response = await axios.get(url,{
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            });
            console.log('all users balance : ', response);      // user balance
            return response.data;
        } catch (e) {
            toast.error('Something went wrong while getting the balance of each user in this group!');
            return {
                success: false,
            }
        }
    }

    static async getRecentActivity() {
        const url = `${API_ENDPOINT}/recent`;
        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })
            return response.data;
        } catch (e) {
            toast.error('Something went wrong while getting the recent activities!');
            return {
                success: false,
            }
        }
    }

    // get all the expenses for a user
    static async getUserBalanceByUserId(userId) {
        const url = `${API_ENDPOINT}/balance/${userId}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })
            return response.data;
        } catch (e) {
            toast.error('Something went wrong while getting users balance!');
            return {
                success: false,
            }
        }
    }

    static async createExpense(payload) {
        if (!payload.groupId || !payload.amount || !payload.description) {
            toast.error('Please add both Amount and Description before creating expense!');
        }
        const url = `${API_ENDPOINT}/create`;
        try {
            const response = await axios.post(url, {
                ...payload
            },{
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })
            return response.data;
        } catch (e) {
            toast.error('Something went wrong while adding the expense!');
            return {
                success: false,
            }
        }
    }

    static async settleExpenseWithUser2ID(payload) {
        if (!payload.userId || !payload.user2Id) {
            toast.error('something went wrong while settling the expense!');
        }

        console.log('payload : ', payload);
        const url = `${API_ENDPOINT}/settle/${payload.user2Id}`;
        try {
            const response = await axios.put(url, {
                ...payload
            },{
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong settling expense!');
            return {
                success: false,
            }
        }
    }

}

export default ExpenseBackendAPIService;
