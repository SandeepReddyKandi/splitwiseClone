import React, {useState} from 'react';
import dayjs from "dayjs";
import BillImage from '../../../bill.png';
import ChatImage from '../../../chat.png';
import {useSelector} from "react-redux";
import PostBackendAPIService from "../../../services/PostBackendAPIService";
import {toast} from "react-toastify";

const ExpenseList = (props) => {
    const [expList, setExpList] = useState(props.expenselist);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showChatSection, setShowChatSection] = useState(false);
    const [selectedPost, setSelectedPost] = useState('');

    const {usersToIdMap, user} = useSelector(state => {
        const usersToIdMap =  state.userState.usersToIdMap;
        return {
           user: state.userState.user,
           usersToIdMap
        }
    });

    const toggleShowChatSection = () => {
        console.log(expList);
        getExpensePosts().then(() => {
            setShowChatSection(prevValue => !prevValue);
        });
    }

    const getExpensePosts = async () => {
        if (!commentList.length) {
            const postsRes = await PostBackendAPIService.getAllPosts(expList._id);
            if (postsRes.success) {
                setCommentList(postsRes.data || []);
            }
        }
    }
    const handlePostChange = (e) => {
        setComment(e.target.value);
    }

    const postComment = async () => {
        const postCommentRes = await PostBackendAPIService.createPost({
            expenseId: expList._id,
            comment,
        });
        if (postCommentRes.success) {
            setComment('');
            setCommentList((prevState => {
                return [
                    ...prevState,
                    postCommentRes.data
                ]
            }));
            toast.success('Comment Added Successfully!');
        }
    }
    const handleShowDeletePopup = (comment) => {
        setSelectedPost(comment._id);
        setShowDeletePopup(true);
    }

    const handleDeletePost = async () => {
        const updatedPostsRes = await PostBackendAPIService.deletePost({
            id: selectedPost
        });

        if (updatedPostsRes.success) {
            setCommentList(updatedPostsRes.data || []);
            toast.success('Deleted Post successfully!');
        }
    }

    return (
        <>
            <tr key={expList._id} className='expense-list-row' onClick={toggleShowChatSection}>
                <div>
                    <div className='date-img-cont'>
                        <div className="date">
                            <span className="month grey-text">{dayjs(expList.createdAt).format('MMMM') }</span>
                            <span className="day grey-text">{dayjs(expList.createdAt).format('DD')}</span>
                        </div>
                        <div className='img-cont'>
                            <img src={BillImage} alt={'i'} />
                        </div>
                    </div>
                </div>
                <div className='exp-description'>{expList.description}</div>
                <div className='exp-amount'>
                    <span className="month grey-text">Paid by</span>
                    <span className="month black-text">{usersToIdMap[expList.byUser]}</span>
                </div>
                <td style={{border: "none"}}>{user.currency||''} {expList.amount}</td>
            </tr>
            {
                showChatSection && (
                    <tr className='chat-section-row'>
                        <div className='chat-section'>
                            <div className='expense-detail-cont'>
                                <div className='img-cont'>
                                    <img src={BillImage} alt={'i'} />
                                </div>
                                <div className='expense-detail'>
                                    <p>{expList.description}</p>
                                    <h5>{user.currency||''} {expList.amount}</h5>
                                    <p className='added-info'>Added by {usersToIdMap[expList.byUser]} on {dayjs(expList.createdAt).format('MMMM DD, YYYY')}</p>
                                    <button>Edit Expense</button>
                                </div>
                            </div>
                            <div className='chat-area-cont'>
                                <div className='comments'>
                                    <h4>
                                        <img src={ChatImage} alt=""/>
                                        Notes and comments
                                    </h4>
                                    {
                                        commentList.map(comment => {
                                            return (
                                                <div className='comment'>
                                                    <div className='post-block'>
                                                        <span className='author'>
                                                            <b>{comment.author}</b> &nbsp; <i>{dayjs(comment.createdAt).format('MMMM DD, YYYY')}</i>
                                                        </span>
                                                        {comment.comment}
                                                        {user.name !== comment.author && (
                                                            <span className='delete-button' onClick={() => handleShowDeletePopup(comment)}>X</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='add-comment'>
                                        <textarea placeholder="Add a comment" cols="40" rows="2" value={comment} onChange={handlePostChange}/>
                                        <br/>
                                        <button onClick={postComment} disabled={!comment}>Post</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            showDeletePopup && (
                                <div className='delete-popup-cont'>
                                    <div className='delete-popup'>
                                        <h6>Do you want to delete the selected Post?</h6>
                                        <div className='button-cont'>
                                            <button className='delete' onClick={handleDeletePost}>Delete</button>
                                            <button className='cancel' onClick={() => setShowDeletePopup(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </tr>
                )
            }
        </>
    )

}

export default ExpenseList;
