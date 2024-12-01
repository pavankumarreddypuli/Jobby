import {Link, withRouter} from 'react-router-dom'
import {AiOutlineHome} from 'react-icons/ai'
import {CgWorkAlt} from 'react-icons/cg'
import {IoIosLogOut} from 'react-icons/io'
import Cookies from 'js-cookie'
import '../Home/index.css'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="header-container">
      <div className="logo-container-sm">
        <Link to="/" className="nav-link">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="nav-logo-img-sm"
              alt="website logo"
            />
          </li>
        </Link>
        <div className="header-mobile-view">
          <Link to="/" className="nav-link">
            <li>
              <AiOutlineHome />
            </li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>
              <CgWorkAlt />
            </li>
          </Link>
          <li>
            <button className="nav-link" type="button" onClick={onLogout}>
              <IoIosLogOut />
            </button>
          </li>
        </div>
      </div>

      <div className="header-desktop-view">
        <div className="nav-container">
          <Link to="/" className="nav-link-lg">
            <li> Home</li>
          </Link>
          <Link to="/jobs" className="nav-link-lg">
            <li> Jobs</li>
          </Link>
        </div>
        <li>
          <button className="nav-btn" type="button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </div>
    </ul>
  )
}

export default withRouter(Header)
