import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreatePoll extends React.Component {
  constructor(props) {
    super(props)
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this)

    this.state = {
      title: '',
      options: [{ name: '' }],
    }
  }

  handlePoll = () => {
    const { title } = this.state
    this.props.submit({ title })
      .then(() => {
        console.log('sucess?')
      })
  }

  handleOptionNameChange = (e, idx) => {
    const newOptions = this.state.options.map((option, oidx) => {
      if (idx !== oidx) return option
      return { name: e.target.value }
    })

    this.setState({ options: newOptions })
  }

  handleOptionChange = (e) => {
    this.setState({
      name: e.target.value,
    })
  }

  handleAddOption = () => {
    this.setState({
      options: this.state.options.concat([{ name: '' }]),
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
        {this.state.options.map((option, idx) => (
          <input
            className="w-100 pa3 mv2"
            placeholder={`Option #${idx + 1} name`}
            value={option.name}
            onChange={(e) => this.handleOptionNameChange(e, idx)}
            key={idx}
          />
        ))}
        <button className="btn btn-info btn-lg" onClick={this.handleAddOption}>Add Option</button>
        {this.state.title && this.state.options &&
          <button className="btn btn-info btn-lg" onClick={this.handlePoll}>Add New Poll</button>
        }
      </div>
    )
  }
}

const submitPoll = gql`
  mutation createPoll ($title: String!) {
    createPoll(
      title: $title
    ) {
      title
    }
  }
`

const NewPoll = graphql(submitPoll, {
  props: ({ ownProps, mutate }) => ({
    submit: ({ title }) =>
      mutate({
        variables: { title },
      }),
  }),
})(CreatePoll)

export default withRouter(NewPoll)
