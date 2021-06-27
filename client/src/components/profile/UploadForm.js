import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { setUserItem } from '../../actions/userActions';
import Resizer from "react-image-file-resizer";
import '../../css/Drawer.css';


class UploadForm extends Component {
    constructor(props) {
        super(props);

        this.uploadPictureInput = React.createRef();
        this.uploadPicture = this.uploadPicture.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }


    async resizeFile(file) {
        return new Promise(resolve => {
            Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'base64', 100, 100);
        });
    }
    uploadPicture() {
        this.uploadPictureInput.current.click()
    }
    async changeHandler(e) {
        try {
            const selectedImage = e.target.files[0];
            const resizedImage = await this.resizeFile(selectedImage);

            const user = this.props.user;
            const itemToBeUpdated = 'photo';
            this.props.setUserItem(user._id, itemToBeUpdated, resizedImage, false);


        }
        catch (error) {
            console.error(error);
        }

    }

    render() {
        return (
            <div onClick={this.uploadPicture} >
                Upload profile picture
                <input type="file" ref={this.uploadPictureInput} accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={this.changeHandler} onClick={e => e.stopPropagation()} />
            </div>
        )
    }
}



const mapStateToProps = state => ({
    user: state.user.user,
});

export default connect(mapStateToProps, { setUserItem })(UploadForm);