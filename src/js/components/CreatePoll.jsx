import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Motion, spring } from 'react-motion'
import classNames from 'classnames'
import SVG from 'react-svg-inline'

import TitleButton from './TitleButton'
import SubmitButton from './SubmitButton'
import AddButton from './AddButton'
import Options from './Options'
import ErrorAlert from './ErrorAlert'
import LoadingModal from './LoadingModal'

class CreatePoll extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      title: '',
      options: [{ name: '' }, { name: '' }],
      id: '',
      validTitle: false,
      validityError: null,
      errorInfo: [],
      titleText: 'Set Poll Title',
      validOptionSet: false,
      created: false,
      submitting: false,
      transitionOut: false,
    }
  }

  componentDidMount() {
    document.title = 'Pollarity.'
  }

  validOptionCount = (options) => {
    let n = 0
    options.forEach((opt) => {
      const name = opt.name
      const trimmedName = name.replace(/^\s+/, '').replace(/\s+$/, '')
      if (trimmedName !== '') n += 1
    })
    return n
  }

  handlePoll = () => {
    if (this.syntheticTitleSave() && this.simulateOptionSubmission()) {
      this.setState({
        submitting: true,
      })
      const { title } = this.state
      const { options } = this.state
      let optionAdded = 0
      const optionValid = this.validOptionCount(options)
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
            if (trimmedName !== '') {
              this.props.submitOpt({ id, name })
                .then(() => {
                  optionAdded += 1
                  if (optionAdded === optionValid) {
                    this.setState({
                      transitionOut: true,
                    })
                    setTimeout(() => { this.considerSubmitted() }, 301)
                  }
                })
            }
          })
        })
    }
  }

  considerSubmitted = () => {
    this.setState({
      submitting: false,
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
        validCount += 1
      }
    })
    if (validCount >= 2) {
      this.setState({
        validOptionSet: true,
      })
      return true
    }
    const errorInfo = []
    errorInfo.msg = 'Ack!'
    errorInfo.tip = 'You need at least 2 non-empty options!'
    this.setState({
      validityError: true,
      errorInfo,
      titleText: 'Check Options',
    })
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
        errorInfo,
        titleText: 'Set Poll Title',
      })
      return false
    }
    return true
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
        errorInfo,
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
    const wrapperClasses = classNames({
      container: true,
      full: true,
      'dur-3': true,
      fadeOut: this.state.transitionOut,
    })
    const svgs = { display: 'flex', alignItems: 'flex-end' }
    const { created } = this.state
    return (
      <div className={wrapperClasses}>
        { !this.state.validTitle ? (
          <div className="col-12-of-12 fadeInUp create--wrapper">
            <h1 className="create--title">Create a new Poll</h1>
            <input
              className="create--input"
              value={this.state.title}
              placeholder="Poll Title"
              id="title"
              autoComplete="off"
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
                  <SVG style={svgs} svg={'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.963 8.261c-.566-.585-.536-1.503.047-2.07l5.948-5.768c.291-.281.664-.423 1.035-.423.376 0 .75.146 1.035.44l-8.065 7.821zm-9.778 14.696c-.123.118-.185.277-.185.436 0 .333.271.607.607.607.152 0 .305-.057.423-.171l.999-.972-.845-.872-.999.972zm8.44-11.234l-3.419 3.314c-1.837 1.781-2.774 3.507-3.64 5.916l1.509 1.559c2.434-.79 4.187-1.673 6.024-3.455l3.418-3.315-3.892-4.019zm9.97-10.212l-8.806 8.54 4.436 4.579 8.806-8.538c.645-.626.969-1.458.969-2.291 0-2.784-3.373-4.261-5.405-2.29z"/></svg>'} width="65%" />
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
        { created && !this.state.submitting &&
          <Redirect push to={`/poll/${this.state.id}`} />
        }
        { this.state.validityError && this.state.validityError !== null &&
          <ErrorAlert
            errorInfo={this.state.errorInfo}
            active={this.state.titleText}
          />
        }
        { this.state.submitting &&
          <LoadingModal
            active={this.state.submitting}
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
