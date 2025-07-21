import {Component} from 'react'
import './index.css'
import Cookie from 'js-cookie'
import {Link} from 'react-router-dom'
import {HiOutlineLocationMarker} from 'react-icons/hi'
import {BsStar, BsSearch} from 'react-icons/bs'
import {CgWorkAlt} from 'react-icons/cg'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const ProfileApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const JobsApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsPage extends Component {
  state = {
    profileApiStatus: ProfileApiConstants.initial,
    profileApiDetails: {},
    JobsApiStatus: JobsApiConstants.initial,
    jobsList: [],
    employmentType: [],
    minimumPackage: '',
    searchIp: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: ProfileApiConstants.inProgress})
    const jwtToken = Cookie.get('jwt_token')

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    const profileData = await response.json()
    const profileDetails = profileData.profile_details
    if (response.ok === true) {
      const updatedProfileData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileApiDetails: updatedProfileData,
        profileApiStatus: ProfileApiConstants.success,
      })
    } else {
      this.setState({profileApiStatus: ProfileApiConstants.failure})
    }
  }

  getJobsDetails = async () => {
    const jwtToken = Cookie.get('jwt_token')
    this.setState({JobsApiStatus: JobsApiConstants.inProgress})
    const {employmentType, minimumPackage, searchIp} = this.state
    let employmentTypeQuery = ''
    if (employmentType.length > 0) {
      employmentTypeQuery = employmentType.join(',')
    }
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeQuery}&minimum_package=${minimumPackage}&search=${searchIp}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    const jobsData = await response.json()

    if (response.ok === true) {
      const {jobs} = jobsData
      const updatedJobsData = jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        JobsApiStatus: JobsApiConstants.success,
      })
    } else {
      this.setState({JobsApiStatus: JobsApiConstants.failure})
    }
  }

  updateSearch = event => this.setState({searchIp: event.target.value})

  searchIpSumbit = () => this.getJobsDetails()

  updateEmploymentType = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const {employmentType} = prevState

      if (checked) {
        return {employmentType: [...employmentType, value]}
      }
      return {
        employmentType: employmentType.filter(type => type !== value),
      }
    }, this.getJobsDetails)
  }

  createEmployeTypeFilter = (empType, keyID) => (
    <li className="emptype-link" key={keyID}>
      <input
        type="checkbox"
        id={empType.employmentTypeId}
        value={empType.employmentTypeId}
        onChange={this.updateEmploymentType}
      />
      <label htmlFor={empType.employmentTypeId}>{empType.label}</label>
      <br />
    </li>
  )

  updateSalaryType = event =>
    this.setState({minimumPackage: event.target.value}, this.getJobsDetails)

  createSalaryTypeFilter = (salType, keyId) => (
    <li className="emptype-link" key={keyId}>
      <input
        type="radio"
        id={salType.salaryRangeId}
        name="salaryRange"
        value={salType.salaryRangeId}
        onChange={this.updateSalaryType}
      />
      <label htmlFor={salType.salaryRangeId}>{salType.label}</label>
      <br />
    </li>
  )

  retryProfileFailureView = () => this.getProfileDetails()

  renderProfileFailureView = () => (
    <div className="profile-section-loading-failure">
      <button
        className="retry-btn"
        onClick={this.retryProfileFailureView}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileApiDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileApiDetails
    return (
      <div className="profile-section">
        <img src={profileImageUrl} className="profile-img" alt="profile" />
        <h1 className="name-heading">{name}</h1>
        <p className="short-bio-para">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoderView = () => (
    <div className="profile-section-loading-failure" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsLoderView = () => (
    <div className="nojob-failure-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsItem = (jobItem, key) => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItem
    return (
      <Link to={`/jobs/${id}`} className="link-style">
        <li className="job-item" key={key}>
          <div className="job-item-logo-container">
            <img
              src={companyLogoUrl}
              className="company-logo-img"
              alt="company logo"
            />
            <div className="title-rating-container">
              <h1 className="job-item-title">{title}</h1>
              <div className="rating-container">
                <button
                  className="job-item-rating-btn"
                  data-testid="searchButton"
                  type="button"
                >
                  <BsStar />
                </button>
                <p className="job-item-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="loc-empType-pac-container">
            <div className="loc-emp-container">
              <div className="loc-emp-section">
                <HiOutlineLocationMarker className="loc-emp-icon" />
                <p className="loc-emp-icon-text">{location}</p>
              </div>
              <div className="loc-emp-section">
                <CgWorkAlt className="loc-emp-icon" />
                <p className="loc-emp-icon-text">{employmentType}</p>
              </div>
            </div>
            <h1 className="pacakage-heading">{packagePerAnnum}</h1>
          </div>
          <hr className="hr-line" />
          <div className="job-item-discripiton-container">
            <h1 className="dis-heading">Description</h1>
            <p className="job-item-discripiton-para">{jobDescription}</p>
          </div>
        </li>
      </Link>
    )
  }

  retryNojobsView = () => this.getJobsDetails()

  renderNojobsView = () => (
    <div className="nojob-failure-loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="nojob-img"
        alt="no jobs"
      />
      <h1 className="nojob-heading">No Jobs Found</h1>
      <p className="nojob-para">
        We could not find any jobs. Try other filters
      </p>
      <button
        className="retry-btn"
        onClick={this.retryNojobsView}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNojobsView()
    }
    return (
      <ul className="job-items-container">
        {jobsList.map(jobItem => this.renderJobsItem(jobItem, jobItem.id))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div className="nojob-failure-loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="nojob-img"
        alt="failure view"
      />
      <h1 className="nojob-heading">OOPS! something went wrong </h1>
      <p className="nojob-para">
        We can&apos;t seem to find the page which you are looking for
      </p>
      <button className="retry-btn" onClick={this.getJobsDetails} type="button">
        Retry
      </button>
    </div>
  )

  renderJobsDetails = () => {
    const {JobsApiStatus} = this.state
    switch (JobsApiStatus) {
      case JobsApiConstants.inProgress:
        return this.renderJobsLoderView()
      case JobsApiConstants.success:
        return this.renderJobsSuccessView()
      case JobsApiConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  renderProfileDetails = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case ProfileApiConstants.inProgress:
        return this.renderProfileLoderView()
      case ProfileApiConstants.success:
        return this.renderProfileSuccessView()
      case ProfileApiConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />
        <div className="jodPage-container">
          <div className="jobs-filter-container">
            <div className="serach-container-sm">
              <input
                type="search"
                className="job-serach-container"
                onChange={this.updateSearch}
              />
              <button
                className="serach-btn"
                onClick={this.searchIpSumbit}
                data-testid="searchButton"
                type="button"
              >
                <BsSearch />
              </button>
            </div>
            {this.renderProfileDetails()}
            <hr className="hr-line" />
            <h1 className="category-heading">Type of Employment</h1>
            <ul className="empType-list-container">
              {employmentTypesList.map(eachItem =>
                this.createEmployeTypeFilter(
                  eachItem,
                  eachItem.employmentTypeId,
                ),
              )}
            </ul>
            <hr className="hr-line" />
            <h1 className="category-heading">Salary Range</h1>
            <ul className="empType-list-container">
              {salaryRangesList.map(eachItem =>
                this.createSalaryTypeFilter(eachItem, eachItem.salaryRangeId),
              )}
            </ul>
          </div>
          <div className="jobs-data-section">
            <div className="serach-container-lg">
              <input
                type="search"
                className="job-serach-container"
                onChange={this.updateSearch}
              />
              <button
                className="serach-btn"
                onClick={this.searchIpSumbit}
                data-testid="searchButton"
                type="button"
              >
                <BsSearch />
              </button>
            </div>
            {this.renderJobsDetails()}
          </div>
        </div>
      </div>
    )
  }
}
export default JobsPage
