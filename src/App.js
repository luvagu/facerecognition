import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const serverUrl = 'https://evening-refuge-41656.herokuapp.com/';

const particlesOptions = {
  particles: {
    number: {
      value: 120,
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
  bBox: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  // Test connection to the server
  // componentDidMount() {
  //   fetch('http://localhost:3001')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({
      user:
      {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.querySelector('#inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayBoundingBox = (box) => {
    // console.log(box)
    this.setState({ bBox: box })
  }

  onInputChange = (event) => {
    if (event.target.value !== null || event.target.value !== '') {
      this.setState({ input: event.target.value });
    }
  }

  onImageSubmit = () => {
    this.setState({ imgUrl: this.state.input });
    fetch(`${serverUrl}imageurl`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${serverUrl}image`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
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
        this.displayBoundingBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      //this.setState({ isSignedIn: false });
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imgUrl, route, bBox, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank user={user} />
            <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
            <FaceRecognition imgUrl={imgUrl} bBox={bBox} />
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
