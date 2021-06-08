import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { setUserItem } from '../../actions/userActions';
import Resizer from "react-image-file-resizer";
import Link from '@material-ui/core/Link';
import '../../css/Drawer.css';


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
                }, 'base64', 100, 100);
        });
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
            <div className="center">
                <input type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} id="icon-button-file" onChange={this.changeHandler} />
                <label htmlFor="icon-button-file">
                    <Link>
                        Change profile picture
                    </Link>
                </label>
            </div>
        )
    }
}



const mapStateToProps = state => ({
    user: state.user.user,
});

export default connect(mapStateToProps, { setUserItem })(UploadForm);