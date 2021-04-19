import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { setUserItem } from '../../actions/userActions';
import Resizer from "react-image-file-resizer";


class UploadForm extends Component {
    constructor(props) {
        super(props);
        this.changeHandler = this.changeHandler.bind(this);
    }


    async resizeFile(file) {
        return new Promise(resolve => {
            Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'base64', 50, 50);
        });
    }

    // getBase64(file, cb) {
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = function () {
    //         cb(reader.result)
    //     };
    //     reader.onerror = function (error) {
    //         console.log('Error: ', error);
    //     };
    // }

    async changeHandler(e) {
        try {
            const selectedImage = e.target.files[0];
            const resizedImage = await this.resizeFile(selectedImage);

            const user = this.props.user;
            const itemToBeUpdated = 'photo';
            this.props.setUserItem(user._id, itemToBeUpdated, resizedImage);


        }
        catch (error) {
            console.error(error);
        }

    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.changeHandler} />
            </form >
        )
    }
}



const mapStateToProps = state => ({
    user: state.user.user,
});

export default connect(mapStateToProps, { setUserItem })(UploadForm);