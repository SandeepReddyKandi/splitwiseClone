import axios from "axios";
import {toast} from "react-toastify";

const API_ENDPOINT = `${process.env.REACT_APP_ENDPOINT}/posts`;

class ExpenseBackendAPIService {
    static getToken = () => localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;

    static async getAllPosts(expenseId) {
        const url = `${API_ENDPOINT}/${expenseId}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
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
            toast.error('Expense id and comment are required to create a post');
            return;
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
                data: response.data.data
            }
        } catch (e) {
            toast.error('Something went wrong while adding the post!');
            return {
                success: false,
            }
        }
    }

    static async deletePost(payload) {
        if (!payload.id) {
            toast.error('Please select a post to delete it');
            return;
        }
        const url = `${API_ENDPOINT}/delete/${payload.id}`;
        try {
            const response = await axios.delete(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })
            console.log(response);
            debugger;
            return {
                success: true,
                data: response.data.data
            }
        } catch (e) {
            toast.error('Something went wrong while deleting the post!');
            return {
                success: false,
            }
        }
    }

}

export default ExpenseBackendAPIService;
