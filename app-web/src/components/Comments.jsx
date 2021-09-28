import './Comments.css';
import * as React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';
import API from '../Api';
import axios from 'axios';

const Comments = ({ card, comeBack, group }) => {

    const [comment, setComment] = React.useState("");
    const [comments, setComments] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const response = await axios.get(API.API_BASE + "groups/" + group.id + "/card/" + card.id + "/comments", { headers: API.AUTH_HEADER() });
            setComments(response.data);
        }
        fetchData()
    }, []);

    async function addComment() {
        const commentObj = {
            text: comment
        }
        console.log(commentObj);
      const response = await axios.post(API.API_BASE + "groups/" + group.id + "/card/" + card.id + "/addComment", commentObj, { headers: API.AUTH_HEADER() });
      const newComments = comments.concat([response.data]);
      setComments(newComments);
      setComment("");
    }
    
    return (

        <div className="comments-container">
            <div className="com-title-container">
                <button className="com-arrow-back" onClick={() => comeBack()}>
                    <ArrowBackIcon style={{ color: "#f89520", padding: 5 }} />
                </button>
                <h1 className="com-title">Comments</h1>
            </div>
            <div className="com-card-container">
                <div className="com-card-image-container">
                    <img src={card.image} alt="card-image" className="com-card-image" />
                </div>
                <div className="com-card-desc-container">
                    <p className="com-card-name">{card.name}</p>
                    <p className="com-card-desc">{card.description}</p>
                </div>
            </div>
            <div className="com-comments">
                {
                    comments.map(comment => (
                        <div className="com-comment">
                        <table>
                            <tr>
                                <th><img className="com-comment-user-img" src={comment.image_url || "/img/user.png"} alt="user" /> </th>
                                <th className="com-th-comment-user-name"><p className="com-comment-user-name">{comment.name}</p></th>
                            </tr>
                            <tr>
                                <th></th>
                                <th className="com-th-comment"><p className="com-comment">{comment.content}</p></th>
                            </tr>
                        </table>
                    </div>    
                    ))
                }
            </div>
            <div className="com-add-comment-cont">
                <table style={{width:'100%'}}>
                    <tr>
                        <th><img className="com-add-comment-img" src="/img/circle-logo.png" alt="user" /> </th>
                        <th className="com-th-comment-user-name"><p className="com-add-comment-name">Add comment</p></th>
                    </tr>
                    <tr>
                        <th></th>
                        <th className="com-th-comment">
                            <input type="text" onChange={e => setComment(e.target.value)} value={comment} className="com-add-comment-input" placeholder="Comment text"/>
                            <button type="button" onClick={addComment} className="sent-comment" style={{backgroundColor: 'white', borderWidth: 0, color: '#F59120'}}>
                                <SendIcon></SendIcon>
                            </button>
                        </th>
                    </tr>
                </table>
            </div>
        </div>


    );
}

export default Comments;