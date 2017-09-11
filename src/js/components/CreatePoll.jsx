import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'

import TitleButton from './TitleButton'
import SubmitButton from './SubmitButton'
import AddButton from './AddButton'
import Options from './Options'

class CreatePoll extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      title: '',
      options: [{ name: ''}, { name: ''}],
      id: '',
      validTitle: false,
      titleText: 'Set Poll Title',
      validOptionSet: false,
      created: false,
    }
  }

  handlePoll = () => {
    console.log('handle poll')
    const { title } = this.state
    const { options } = this.state
    this.props.submit({ title })
      .then((res) => {
        console.log('poll created!')
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
            .then((res) => {
              console.log('opt success' + res)
            })
          }
        })
      })
      .then(() => {
        setTimeout(function() { this.setState({created: true,}); }.bind(this), 500);
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

  saveTitleCallback = (data) => {
    this.setState({ validTitle: data.validTitle })
  }

  optionNameChangeCallback = (data) => {
    this.setState({ options: data })
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
                <h2 className="create--title">Add Options to {this.state.title}</h2>
                <Options
                  options={this.state.options}
                  optionNameChangeCallback={this.optionNameChangeCallback}
                  removeOptionCallback={this.removeOptionCallback}
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
