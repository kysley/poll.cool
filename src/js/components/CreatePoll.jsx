import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreatePoll extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      options: [],
    }
  }

  handlePoll = () => {
    const { title, options } = this.state
    this.props.addPoll({ title, options })
      .then(() => {
        console.log('sucess?')
      })
  }

  render() {
    return (
      <div>
        <label> Movie Title: </label>
        <input
          className=""
          value={this.state.title}
          placeholder="Title of the poll"
          onChange={(e) => this.setState({ title: e.target.value })}
        />
        <label> Movie Cover Image: </label>
        <input
          className="w-100 pa3 mv2"
          value={this.state.options}
          placeholder="poll opt"
          onChange={(e) => this.setState({ options: e.target.value })}
        />

        {this.state.title && this.state.options &&
          <button className="btn btn-info btn-lg" onClick={this.handlePoll}>Add New Poll</button>
        }
      </div>
    )
  }
}

const addMutation = gql`
  mutation addPoll($title: String!, $options: [String!]) {
    createPoll(title: $title, options: $options) {
      id
      title
      options
    }
  }
`

export default graphql(addMutation, {
  props: ({ ownProps, mutate }) => ({
    addPoll: ({ title, options }) =>
      mutate({
        variables: { title, options },
      }),
  }),
})(withRouter(CreatePoll))
