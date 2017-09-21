import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Motion, spring } from 'react-motion'

import TitleButton from './TitleButton'
import SubmitButton from './SubmitButton'
import AddButton from './AddButton'
import Options from './Options'
import ErrorAlert from './ErrorAlert'

class CreatePoll extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      title: '',
      options: [{ name: ''}, { name: ''}],
      id: '',
      validTitle: false,
      validityError: null,
      errorInfo: [],
      titleText: 'Set Poll Title',
      validOptionSet: false,
      created: false,
    }
  }

  handlePoll = () => {
    if (this.syntheticTitleSave() && this.simulateOptionSubmission()) {
      const { title } = this.state
      const { options } = this.state
      let optsProcessed = 0
      this.props.submit({ title })
        .then((res) => {
          this.setState({
            id: res.data.createPoll.id,
          })
        })
        .then(() => {
          const { id } = this.state
          options.forEach((opt) => {
            const name = opt.name
            const trimmedName = name.replace(/^\s+/, '').replace(/\s+$/, '')
            if (trimmedName === '') {
              return;
            } else {
              this.props.submitOpt({ id, name })
                .then(() => {
                  optsProcessed++
                  if (optsProcessed === options.length-1) this.countAsSubmitted()
                })
            }
          })
        })
    } else {
      return
    }
  }

  countAsSubmitted = () => {
    this.setState({
      created: true,
    })
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

  simulateOptionSubmission = () => {
    const { options } = this.state
    let validCount = 0

    options.forEach((opt) => {
      const name = opt.name
      const trimmedName = name.replace(/^\s+/, '').replace(/\s+$/, '')
      if (trimmedName !== '') {
        validCount++
      }
    })
    if (validCount >= 2) {
      this.setState({
        validOptionSet: true,
      })
      return true
    } else {
      const errorInfo = []
      errorInfo.msg = 'Ack!'
      errorInfo.tip = 'You need at least 2 non-empty options!'
      this.setState({
        validityError: true,
        errorInfo: errorInfo,
        titleText: 'Check Options',
      })
    }
  }

  syntheticTitleSave = () => {
    const { title } = this.state
    const trimmedTitle = title.replace(/^\s+/, '').replace(/\s+$/, '')
    if (trimmedTitle === '') {
      const errorInfo = []
      errorInfo.msg = 'Ack!'
      errorInfo.tip = 'The Title can\'t be empty.'
      this.setState({
        validityError: true,
        errorInfo: errorInfo,
        titleText: 'Set Poll Title',
      })
      return false
    } else {
      return true
      setTimeout(() => { this.setState({validityError: false, titleText: 'Continue',}) }, 301);
    }
  }

  syntheticTitleEdit = (e) => {
    const eTitle = e.target.value
    this.setState({
      title: eTitle,
      titleText: 'Continue',
    })
  }

  saveTitleCallback = (data) => {
    this.setState({ validTitle: data.validTitle })
    if (!data.validTitle) {
      const errorInfo = []
      errorInfo.msg = 'Ack!'
      errorInfo.tip = 'The Title can\'t be empty.'
      this.setState({
        validityError: true,
        errorInfo: errorInfo,
      })
    }
  }

  optionNameChangeCallback = (data) => {
    this.setState({ options: data, titleText: 'Continue' })
  }

  optionChangeCallback = (data) => {
    this.setState({ name: data.name })
  }

  addOptionCallback = (data) => {
    this.setState({ options: data })
  }

  removeOptionCallback = (data) => {
    this.setState({ options: data })
  }


  render() {
    const { created } = this.state
    return (
      <div className="container full">
        { !this.state.validTitle ? (
          <div className="col-12-of-12 fadeInUp create--wrapper">
            <h1 className="create--title">Create a new Poll</h1>
            <input
              className="create--input"
              value={this.state.title}
              placeholder="Poll Title"
              id="title"
              autoComplete={false}
              autoFocus={true}
              maxLength={84}
              onChange={e => this.handleTitleChange(e)}
            />
            <TitleButton
              saveTitleCallback={this.saveTitleCallback}
              titleText={this.state.titleText}
            >
              {this.state.titleText}
            </TitleButton>
          </div>
        ) : (
          <Motion defaultStyle={{ x: 0 }} style={{ x: spring(1) }}>
            {value =>
              <div className="col-12-of-12 create--wrapper" style={{ opacity: value.x }}>
                <div className="title--editor-wrapper">
                  <h2 className="edit--title">Add Options to </h2>
                  <input
                    className="edit--input"
                    value={this.state.title}
                    onChange={e => this.syntheticTitleEdit(e)}
                    onBlur={() => this.syntheticTitleSave()}
                  />
                </div>
                <Options
                  options={this.state.options}
                  optionNameChangeCallback={this.optionNameChangeCallback}
                  removeOptionCallback={this.removeOptionCallback}
                  addOptionCallback={this.addOptionCallback}
                />
                <AddButton
                  options={this.state.options}
                  addOptionCallback={this.addOptionCallback}
                />
                <SubmitButton
                  onClick={this.handlePoll}
                  validOptions={this.state.validOptionSet}
                  titleText={this.state.titleText}
                />
              </div>
            }
          </Motion>
        )}
        {created &&
          <Redirect push to={`/poll/${this.state.id}`} />
        }
        { this.state.validityError && this.state.validityError !== null &&
          <ErrorAlert
            errorInfo={this.state.errorInfo}
            active={this.state.titleText}
          />
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
