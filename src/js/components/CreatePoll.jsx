import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'

class CreatePoll extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this)

    this.state = {
      title: '',
      options: [{ name: '', valid: false }, { name: '', valid: false }],
      id: '',
      validTitle: false,
      titleText: 'Set Poll Title',
      validOptionSet: false,
    }
  }

  handlePoll = () => {
    console.log('handle poll')
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
    if (this.state.titleText === 'Continue') {
      this.setState({
        validTitle: true,
      })
    }
  }

  handleTitleChange = (e) => {
    const eTitle = e.target.value
    const trimmedTitle = eTitle.replace(/^\s+/, '').replace(/\s+$/, '')
    if (trimmedTitle === '') {
      this.setState({
        title: '',
        titleText: 'Set Poll Title',
      })
    } else {
      this.setState({
        title: eTitle,
        titleText: 'Continue',
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
    const createbuttonClasses = classNames({
      'create--button': true,
      'is-valid': this.state.titleText === 'Continue',
      'is-invalid': this.state.titleText !== 'Continue',
    })
    const submitbuttonClasses = classNames({
      'create--button': true,
      '_submit': true,
      'is-valid': this.state.validOptionSet,
      'is-invalid': !this.state.validOptionSet,
    })
    return (
      <div className="container full">
        { !this.state.validTitle ? (
          <div className="col-6-of-12 push-4 fadeInUp create--wrapper">
            <h1 className="create--title">Create a new Poll</h1>
            <input
              className="create--input"
              value={this.state.title}
              placeholder="Poll Title"
              id="title"
              autoComplete={false}
              onChange={e => this.handleTitleChange(e)}
            />
            <button
              className={createbuttonClasses}
              onClick={this.handleSaveTitle}
            >
              {this.state.titleText}
            </button>
          </div>
        ) : (
          <Motion defaultStyle={{ x: 0 }} style={{ x: spring(1) }}>
            {value =>
              <div className="col-6-of-12 push-4 create--wrapper" style={{ opacity: value.x }}>
                <h2 className="create--title">Add Options to {this.state.title}</h2>
                { this.state.options.map((option, idx) => (
                  <input
                    className="create--input option"
                    placeholder={`Option ${idx + 1}`}
                    value={option.name}
                    onChange={e => this.handleOptionNameChange(e, idx)}
                    key={idx}
                  />
                ))}
                <button
                  className="option--button"
                  onClick={this.handleAddOption}
                >
                  Add Option
                </button>
                <button
                  className={submitbuttonClasses}
                  onClick={this.handlePoll}
                >
                  Submit Poll
                </button>
              </div>
            }
          </Motion>
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
