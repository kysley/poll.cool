import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class CreatePoll extends React.Component {
  constructor(props) {
    super(props)
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this)

    this.state = {
      title: '',
      options: [{ name: '' }, { name: '' }],
      id: '',
      validTitle: false,
    }
  }

  handlePoll = () => {
    const { title } = this.state
    const { options } = this.state
    this.props.submit({ title })
      .then((res) => {
        console.log('success!')
        this.setState({
          id: res.data.createPoll.id,
        })
      })
      .then(() => {
        const { id } = this.state
        options.forEach((opt) => {
          const name = opt.name
          this.props.submitOpt({ id, name })
            .then((res) => {
              console.log('opt success' + res)
            })
        })
      })
      .then(() => {
        const redirectUrl = `/poll/${this.state.id}`
        this.props.history.push(redirectUrl)
      })
  }

  handleSaveTitle = () => {
    if (this.state.title) {
      this.setState({
        validTitle: true,
      })
    }
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
        { !this.state.validTitle ? (
          <div>
            <label htmlFor="title"> Title: </label>
            <input
              className=""
              value={this.state.title}
              placeholder="Title of your poll"
              id="title"
              onChange={e => this.setState({ title: e.target.value })}
            />
            <button
              className="btn btn-info btn-lg"
              onClick={this.handleSaveTitle}
            >
              Save Poll Title
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="options"> Poll Options: </label>
            { this.state.options.map((option, idx) => (
              <input
                className="w-100 pa3 mv2"
                placeholder={`Option #${idx + 1} name`}
                value={option.name}
                onChange={e => this.handleOptionNameChange(e, idx)}
                key={idx}
              />
            ))}
            <button
              className="btn btn-info btn-lg"
              onClick={this.handleAddOption}
            >
              Add Option
            </button>
            {this.state.title && this.state.options &&
              <button
                className="btn btn-info btn-lg"
                onClick={this.handlePoll}
              >
                Add New Poll
              </button>
            }
          </div>
        )}
      </div>
    )
  }
}

const submitPoll = gql`
  mutation createPoll ($title: String!) {
    createPoll(
      title: $title
    ) {
      id
      title
    }
  }
`

const submitOption = gql`
  mutation addOption ($id: ID!, $name: String!) {
    createOption(
      pollId: $id,
      name: $name
     ) {
      id
      name
    }
  }
`

const AllMutations = compose(
  graphql(submitOption, {
    props: ({ ownProps, mutate }) => ({
      submitOpt: ({ id, name }) =>
        mutate({
          variables: { id, name },
        }),
    }),
  }),
  graphql(submitPoll, {
    props: ({ ownProps, mutate }) => ({
      submit: ({ title }) =>
        mutate({
          variables: { title },
        }),
    }),
  }),
)(CreatePoll)

export default withRouter(AllMutations)
