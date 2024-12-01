import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showErrorMsg: false}

  sumbitOnSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
    this.setState({showErrorMsg: false})
  }

  sumbitOnFailure = errorMassage => {
    this.setState({errorMsg: errorMassage, showErrorMsg: true})
  }

  onSumbitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.sumbitOnSuccess(data.jwt_token)
    } else {
      this.sumbitOnFailure(data.error_msg)
    }
  }

  setDemoDetails = () => {
    this.setState({username: 'rahul', password: 'rahul@2021'})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg, showErrorMsg} = this.state
    return (
      <div className="login-container">
        <div className="card-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="logo-img"
              alt="website logo"
            />
          </div>
          <form className="from-container" onSubmit={this.onSumbitForm}>
            <label htmlFor="usernameLabel">Username</label>
            <input
              placeholder="Username"
              className="username-ip"
              type="text"
              value={username}
              onChange={this.onChangeUsername}
              id="usernameLabel"
            />
            <label htmlFor="passwordLabel">Password</label>
            <input
              placeholder="Password"
              className="username-ip"
              type="password"
              value={password}
              onChange={this.onChangePassword}
              id="passwordLabel"
            />
            <button className="login-btn" type="submit">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">**{errorMsg}**</p>}
          </form>
          <button
            className="demo-btn"
            type="button"
            onClick={this.setDemoDetails}
          >
            Demo
          </button>
        </div>
      </div>
    )
  }
}
export default Login
