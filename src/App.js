import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ProfileModal from './components/ProfileModal/ProfileModal';
import ViewProfile from './components/Profile/ViewProfile';
import './App.css';

// Backend URL
// Use this url for development
// const serverUrl = 'http://localhost:3000/';
// Use this url for production 
const serverUrl = 'https://evening-refuge-41656.herokuapp.com/'
// Use this url for local machine testing: http://localhost:3000/
// or point to current server localhost url/port

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
  //, interactivity: {
  //   events: {
  //     onhover: {
  //       enable: true,
  //       mode: 'repulse'
  //     }
  //   }
  // }
}

const initialState = {
  input: '',
  imgUrl: '',
  bBoxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    age: 0,
    pet: '',
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  // check token in sessionStorage
  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {    
      fetch(`${serverUrl}signin`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
      .then(resp => resp.json())
      .then(data => {
        if (data && data.id) {
          fetch(`${serverUrl}profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if (user && user.email) {
              this.loadUser(user);
              this.onRouteChange('home');
            }
          })
        }
      })
      .catch(console.log);
    }
  }

  loadUser = (data) => {
    this.setState({
      user:
      {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        age: data.age,
        pet: data.pet,
        joined: data.joined
      }
    });
  }

  calculateFaceLocations = (data) => {
    if (data && data.outputs) {
      const image = document.querySelector('#inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      
      return data.outputs[0].data.regions.map(faces => {
        const clarifaiFace = faces.region_info.bounding_box
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      });
    }
    return;
  }

  displayBoundingBoxes = (boxes) => {
    if (boxes) {
      this.setState({ bBoxes: boxes })
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onImageSubmit = () => {
    this.setState({ imgUrl: this.state.input });
    fetch(`${serverUrl}imageurl`, {
      method: 'post',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('token')
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch(`${serverUrl}image`, {
          method: 'put',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
          },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count++ }))
        })
        .catch(console.log)
      }
      this.displayBoundingBoxes(this.calculateFaceLocations(response))
    })
    .catch(err => console.log(err))
  }

  // remove token on signout
  removeAuthTokenInSession = () => {
    //window.sessionStorage.removeItem('token');
    window.localStorage.removeItem('token');
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      //this.setState({ isSignedIn: false });
      this.removeAuthTokenInSession();
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
    const { isSignedIn, isProfileOpen, imgUrl, route, bBoxes, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} toggleModal={this.toggleModal} removeAuthTokenInSession={this.removeAuthTokenInSession}/>
        { isProfileOpen &&
          <ProfileModal>
          <ViewProfile serverUrl={serverUrl} isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser}/>
          </ProfileModal>
        }
        {route === 'home' ?
          <div>
            <Logo />
            <Rank user={user} />
            <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
            <FaceRecognition imgUrl={imgUrl} bBoxes={bBoxes} />
          </div>
          : (route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} serverUrl={serverUrl} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} serverUrl={serverUrl} />
          )
        }
      </div>
    );
  }
}

export default App;
