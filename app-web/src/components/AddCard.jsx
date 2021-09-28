import * as React from 'react';
import axios from 'axios';
import API from '../Api';
import S3 from 'react-aws-s3';
import './AddCard.css';
import { v4 as uuidv4 } from 'uuid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';

const AddCard = ({ deckId, goBack }) => {

    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [image, setImage] = React.useState();
    const [imageSelected, setImageSelected] = React.useState(false);
    const [imageURL, setImageURL] = React.useState('https://squeet-cards.s3.amazonaws.com/default.png');

    async function add(e) {
        e.preventDefault();
        try {
            // console.log(file);
            const ReactS3Client = new S3(options);
            console.log(image);
            var newImageURL;
            try {
                const data = await ReactS3Client.uploadFile(image, uuidv4())
                newImageURL = data.location;
                if (data.location) {
                    setImageURL(data.location);
                }    
            } catch (err) {
                console.log(err)
                console.log("s3 error", err);
            }
            console.log(1);
            await axios.post(API.API_BASE + "decks/" + deckId + "/addCard", { title: title, image: newImageURL || imageURL, notes: desc, link: '' }, { headers: API.AUTH_HEADER() });
            window.location.reload();
            // .then( async data => {
            // }).catch((e) => {
            //     console.log('Unable to upload data\n', e);
            //     alert("An error occurred while adding a card. Please try again later.");
            // })

        } catch (err) {
            console.log(err);
            alert("An error occurred while adding a card. Please try again later.");
        }
    }

    return (
        <div className="add-card-container">
            <div className="add-card-return">
                <button onClick={() => goBack()} className="add-card-btn-back" type="button">
                    <ArrowBackIcon></ArrowBackIcon>
                </button>
            </div>
            {/* <form  className="add-card-form"> */}
                <div className="add-card-card">
                    <label htmlFor="image" className="add-card-image-label">
                        {!imageSelected && <AddIcon fontSize="large"></AddIcon>}
                        {imageSelected && <p>An image has been selected</p>}
                    </label>
                    <input
                        className="add-card-image"
                        onChange={(e) => {
                            setImageSelected(true);
                            console.log(e.target.files[0]);
                            setImage(e.target.files[0]);
                        }}
                        id="image"
                        type="file"
                        name="image"
                        required
                    />
                    <label htmlFor="name" className="add-card-title-label">Title</label>
                    <input
                        className="add-card-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        id="name"
                        type="text"
                        name="name"
                        required
                    />
                    <label htmlFor="description" className="add-card-desc-label">Description</label>
                    <input
                        className="add-card-desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Description"
                        id="description"
                        type="text"
                        name="description"
                        required
                    />
                </div>
                <button onClick={add} type="submit" className="add-card-btn">Save</button>
            {/* </form> */}
        </div>
    );
}

export default AddCard;