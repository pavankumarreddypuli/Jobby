import {Component} from 'react'
import Cookie from 'js-cookie'
import {HiOutlineLocationMarker} from 'react-icons/hi'
import {BsStar} from 'react-icons/bs'
import {CgWorkAlt} from 'react-icons/cg'
import {RiShareBoxFill} from 'react-icons/ri'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const JobsItemApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsItem extends Component {
  state = {
    jobsApiStatus: JobsItemApiConstants.initial,
    jobItemData: {},
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const jwtToken = Cookie.get('jwt_token')
    this.setState({jobsApiStatus: JobsItemApiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const getJObItemUrl = ` https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(getJObItemUrl, options)
    const getJobItemDetails = await response.json()
    if (response.ok === true) {
      const jobDetails = getJobItemDetails.job_details
      const similarJobs = getJobItemDetails.similar_jobs
      const updatedjobItemData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        title: jobDetails.title,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
      }
      this.setState({
        jobItemData: updatedjobItemData,
        similarJobsData: similarJobs,
        jobsApiStatus: JobsItemApiConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: JobsItemApiConstants.failure})
    }
  }

  createSkillItem = (skillItem, key) => {
    const updatedSkillItem = {
      imageUrl: skillItem.image_url,
      name: skillItem.name,
    }
    const {imageUrl, name} = updatedSkillItem
    return (
      <li className="skill-item" key={key}>
        <img src={imageUrl} className="skill-img" alt="name" />
        <h1 className="skill-heading">{name}</h1>
      </li>
    )
  }

  createSimilarJobCard = (similarJobsItem, key) => {
    const updatedSimilarJobInfo = {
      companyLogoUrl: similarJobsItem.company_logo_url,
      employmentType: similarJobsItem.employment_type,
      id: similarJobsItem.id,
      jobDescription: similarJobsItem.job_description,
      location: similarJobsItem.location,
      rating: similarJobsItem.rating,
      title: similarJobsItem.title,
    }
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
    } = updatedSimilarJobInfo
    return (
      <li className="similar-job-card" key={key}>
        <div className="job-item-logo-container">
          <img
            src={companyLogoUrl}
            className="company-logo-img"
            alt="similar job company logo"
          />
          <div className="title-rating-container">
            <h1 className="job-item-title">{title}</h1>
            <div className="rating-container">
              <button className="job-item-rating-btn" type="button">
                <BsStar />
              </button>
              <p className="job-item-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-discripiton-container">
          <h1 className="dis-heading">Description</h1>
          <p className="job-item-discripiton-para">{jobDescription}</p>
        </div>
        <div className="loc-emp-container">
          <div className="loc-emp-section">
            <HiOutlineLocationMarker />
            <p className="loc-emp-icon-text">{location}</p>
          </div>
          <div className="loc-emp-section">
            <CgWorkAlt />
            <p className="loc-emp-icon-text">{employmentType}</p>
          </div>
        </div>
      </li>
    )
  }

  renderJobsItemSuccess = () => {
    const {jobItemData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemData

    return (
      <>
        <div className="jobsItem-job-item">
          <div className="jobsItem-job-item-logo-container">
            <img
              src={companyLogoUrl}
              className="jobsItem-company-logo-img"
              alt="job details company logo"
            />
            <div className="jobsItem-title-rating-container">
              <h1 className="job-item-title">{title}</h1>
              <div className="rating-container">
                <button className="job-item-rating-btn" type="button">
                  <BsStar className="job-item-rating-icon" />
                </button>
                <p className="job-item-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="loc-empType-pac-container">
            <div className="loc-emp-container">
              <div className="loc-emp-section">
                <HiOutlineLocationMarker className="loc-job-icon-style" />
                <p className="loc-emp-icon-text">{location}</p>
              </div>
              <div className="loc-emp-section">
                <CgWorkAlt className="loc-job-icon-style" />
                <p className="loc-emp-icon-text">{employmentType}</p>
              </div>
            </div>
            <p className="pacakage-heading">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="job-item-discripiton-container">
            <div className="description-vist-container">
              <h1 className="dis-heading">Description</h1>
              <a className="vist-link-container" href={companyWebsiteUrl}>
                <h1 className="vist-heading">Visit</h1>
                <button className="share-icon-btn" type="button">
                  <RiShareBoxFill />
                </button>
              </a>
            </div>
            <p className="job-item-discripiton-para">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="dis-heading">Skills</h1>
            <ul className="skills-section">
              {skills.map(eachItem =>
                this.createSkillItem(eachItem, eachItem.name),
              )}
            </ul>
          </div>
          <div className="life-at-company-section">
            <div className="life-at-company-discripiton">
              <h1 className="dis-heading">Life at Company</h1>
              <p className="job-item-discripiton-para">
                {lifeAtCompany.description}
              </p>
            </div>
            <img
              src={lifeAtCompany.image_url}
              className="life-at-company-img"
              alt="lifeAtCompany"
            />
          </div>
        </div>
        <div className="similar-jobs-sections">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobsData.map(similarJobsItem =>
              this.createSimilarJobCard(similarJobsItem, similarJobsItem.id),
            )}
          </ul>
        </div>
      </>
    )
  }

  renderJobsItemLoader = () => (
    <div
      className="jobsItem-nojob-failure-loader-container"
      data-testid="loader"
    >
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retrygetJobItemDetails = () => this.getJobItemDetails()

  renderJobsItemFailure = () => (
    <div className="jobsItem-nojob-failure-loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobsItem-nojob-img"
        alt="failure view"
      />
      <h1 className="jobsItem-nojob-heading">Oops! Something Went Wrong</h1>
      <p className="jobsItem-nojob-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        onClick={this.retrygetJobItemDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsItem = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case JobsItemApiConstants.inProgress:
        return this.renderJobsItemLoader()
      case JobsItemApiConstants.success:
        return this.renderJobsItemSuccess()
      case JobsItemApiConstants.failure:
        return this.renderJobsItemFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-item-container">
        <Header />
        {this.renderJobsItem()}
      </div>
    )
  }
}
export default JobsItem
