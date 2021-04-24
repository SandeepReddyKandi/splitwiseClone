import axios from "axios";
import {toast} from "react-toastify";

const API_ENDPOINT = `${process.env.REACT_APP_ENDPOINT}/posts`;

class ExpenseBackendAPIService {
    static getToken = () => localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;

    static async getAllPosts(expenseId) {
        const url = `${API_ENDPOINT}/${expenseId}`;
        return {
            success: true,
            data: [{
                id: '1',
                author: 'Mukul',
                comment: 'Is it okay, if I pay you this weekend?',
                createdAt: 'Apr 23 2021',
            }, {
                id: '2',
                author: 'Mukul2',
                createdAt: 'Apr 23 2021',
                comment: 'Yes, sure!'
            }, {
                id: '3',
                author: 'Mukul3',
                createdAt: 'Apr 23 2021',
                comment: 'Cool, thanks Man!'
            }],
        }
        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            toast.error('Something went wrong while getting all posts!');
            return {
                success: false,
            }
        }
    }

    static async createPost(payload) {
        if (!payload.expenseId || !payload.comment) {
            toast.error('Expense id and comment are required to post');
        }
        return {
            success: true,
            data: {
                id: '4',
                author: 'Mukul4',
                createdAt: 'Apr 23 2021',
                comment: payload.comment,
            }
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
            return {
                success: true,
                data: response.data
            }
        } catch (e) {
            toast.error('Something went wrong while adding the post!');
            return {
                success: false,
            }
        }
    }

}

export default ExpenseBackendAPIService;
