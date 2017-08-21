import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class ShowPoll extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
    }
  }

  componentWillMount() {
    console.log("it will mount")
  }

  render() {
    return (
      <div>
      sup
      </div>
    )
  }


}

export default withRouter(ShowPoll)
