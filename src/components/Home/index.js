import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="home-containier">
        <Header />
        <div className="home-card-container">
          <div className="discription-container">
            <h1 className="home-main-heading">
              Find The Job that Fits Your Life
            </h1>
            <p className="home-para">
              Millions of people are searching for jobs,salary
              information,company reviews.Find the job thats fits your
              abailities and potential
            </p>
            <Link to="/jobs" className="find-jobs-btn-link">
              <button className="find-jobs-btn" type="button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
