import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const requiredApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class ProjectsShowCase extends Component {
  state = {
    actId: categoriesList[0].id,
    data: [],
    apiStatus: requiredApiStatus[0],
  }

  componentDidMount = () => {
    this.fetchData()
  }

  fetchData = async () => {
    // this.setState({apiStatus: requiredApiStatus.inProgress})
    const {actId} = this.state
    const fetchUrl = `https://apis.ccbp.in/ps/projects?category=${actId}`
    const response = await fetch(fetchUrl)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({data: updatedData, apiStatus: requiredApiStatus.success})
    } else {
      this.setState({apiStatus: requiredApiStatus.failure})
    }
  }

  changeSelector = event => {
    this.setState({actId: event.target.value}, this.fetchData)
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="ul-card">
        {data.map(each => (
          <li className="li-card" key={each.id}>
            <img className="image" src={each.imageUrl} alt={each.name} />
            <p className="heading">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderInProgressView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="card">
      <img
        className="image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.Retry} className="retry-button">
        Retry
      </button>
    </div>
  )

  Retry = () => {
    this.fetchData()
  }

  renderPageView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case requiredApiStatus.success:
        return this.renderSuccessView()
      case requiredApiStatus.failure:
        return this.renderFailureView()
      case requiredApiStatus.inProgress:
        return this.renderInprogressView()
      default:
        return null
    }
  }

  render() {
    const {actId} = this.state

    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="list-container">
          <select
            className="select"
            onChange={this.changeSelector}
            value={actId}
          >
            {categoriesList.map(eachList => (
              <option key={eachList.id} value={eachList.id}>
                {eachList.displayText}
              </option>
            ))}
          </select>
          {this.renderPageView()}
        </div>
      </div>
    )
  }
}
export default ProjectsShowCase
