import React from 'react';
import { Button } from 'reactstrap';
import './ViewProfile.css';

class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            age: this.props.user.age,
            pet: this.props.user.pet
        }
    }

    onProfileUpdate = (data) => {
        fetch(`${this.props.serverUrl}profile/${this.props.user.id}`, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('token')
            },
            body: JSON.stringify({ formInput: data })
        })
        .then(resp => {
            if (resp.status === 200 || resp.status === 304) {
                this.props.toggleModal();
                this.props.loadUser({...this.props.user, ...data});
            }
        })
        .catch(console.log('Update success'))
    }

    onFormChange = (event) => {
        switch (event.target.name) {
            case 'user-name':
                this.setState({ name: event.target.value })
                break;
            case 'user-age':
                this.setState({ age: event.target.value })
                break;
            case 'user-pet':
                this.setState({ pet: event.target.value })
                break;
            default:
                return;
        }
    }

    render() {
        const { user, toggleModal } = this.props;
        const { name, age, pet } = this.state;
        return (
            <div className='view-profile-modal'>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white position-relative">
                    <main className="pa4 black-80 w-80">
                        <img
                            src="http://tachyons.io/img/logo.jpg"
                            className="br-100 h3 w3 dib"
                            alt="avatar" />
                        <h1>{name}</h1>
                        <h4>{`Images Submited: ${user.entries}`}</h4>
                        <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                        <hr />
                        <label className="mt2 fw6" htmlFor="user-name">Name</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.name}
                            type="text"
                            name="user-name"
                            id="user-name" />
                        <label className="mt2 fw6" htmlFor="user-age">Age</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.age}
                            type="text"
                            name="user-age"
                            id="user-age" />
                        <label className="mt2 fw6" htmlFor="user-pet">Pet</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.pet}
                            type="text"
                            name="user-pet"
                            id="user-pet" />
                        <div className='mt4' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            {/* <button className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20'>Save</button>
                        <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'>Save</button> */}
                            <Button color="primary" className="w-40" onClick={() => this.onProfileUpdate({ name, age, pet })}>Save</Button>
                            <Button color="danger" className="w-40" onClick={toggleModal}>Cancel</Button>
                        </div>
                    </main>
                    <div className='modal-close' onClick={toggleModal}>&times;</div>
                </article>
            </div>
        )
    }
}

export default ViewProfile;
