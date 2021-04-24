import axios from "axios";
import {toast} from "react-toastify";

const API_ENDPOINT = `${process.env.REACT_APP_ENDPOINT}/user`;

class UserBackendAPIService {
    static getToken = () => localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;

    static async getAllUsers() {
        const url = `${API_ENDPOINT}/all`;
        try {
            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${this.getToken()}`
                }
            })
            return response.data.data.map(user => {
                return {
                    ...user,
                    imageURL: user.imageURL ? `${process.env.REACT_APP_ENDPOINT}/file/${user.imageURL}` : null,
                }
            });
        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message);
            } else {
                toast.error(`Something went wrong while getting all users!`);
            }
            return {
                success: false,
            }
        }
    }

    static async getUserDetails(payload) {
        const url = `${API_ENDPOINT}/me`;
        // if token is not present return the error state
        if (!this.getToken()) {
            return {
                success: false,
                data: {},
            }
        }

        try {
            const {data} = await axios.post(url,
                {
                    ...payload
                },{
                    headers: {
                        authorization: `Bearer ${this.getToken()}`
                    }
            });
            return {
                data: {
                    ...data.data,
                    imageURL: data.data.imageURL ? `${process.env.REACT_APP_ENDPOINT}/file/${data.data.imageURL}` : null,
                },
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                data: {},
            }
        }
    }

    static async updateUserDetails(payload) {
        const url = `${API_ENDPOINT}/update`;
        try {
            const response = await axios.put(url,
                payload,
                {
                    headers: {
                        authorization: `Bearer ${this.getToken()}`,
                        contentType: 'multipart/form-data',
                    }
                });
            return {
                success: true,
                data: {
                    ...response.data.data,
                    imageURL: response.data.data.imageURL ? `${process.env.REACT_APP_ENDPOINT}/file/${response.data.data.imageURL}` : null,
                }
            };
        } catch (e) {
            toast.error('Something went wrong while getting user info!');
            return {
                success: false,
                data: {},
            }
        }
    }
    static async login(payload) {
        try {
            const {data} = await axios.post(`${API_ENDPOINT}/login/`, {
                ...payload
            });
            if (data.reason) {
                return {
                    data,
                    success: false
                }
            }
            localStorage.setItem('token', JSON.stringify(data.data.token));
            return {
                data: {
                    ...data.data,
                    imageURL: data.data.imageURL ? `${process.env.REACT_APP_ENDPOINT}/file/${data.data.imageURL}` : null,
                },
                success: true,
            }
        } catch (e) {
            toast.error('Something went wrong while Logging you in!');
            return {
                success: false,
                data: {},
            }
        }
    }
}

export default UserBackendAPIService;
