import React from 'react';
import ReactDOM from 'react-dom';
import './ProfileModal.css';

const profileModalRoot = document.getElementById('profile-modal-root');

class ProfileModal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        profileModalRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        profileModalRoot.removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el)
    }
}

export default ProfileModal;