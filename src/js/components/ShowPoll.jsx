import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'

import ErrorWrapper from './ErrorWrapper'
import ErrorAlert from './ErrorAlert'
import CopyButton from './CopyButton'

const allVotes = gql`
  query allPollData($id: ID!) {
    Poll(id: $id) {
      id
      title
        options {
          name
          id
          _votesMeta {
            count
          }
        }
      }
    }
  `

const submitVote = gql`
  mutation addVote($id: ID!) {
    createVote(
      optionId: $id
    ) {
      id
    }
  }
`

class ShowPoll extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      options: null,
      title: '',
      errorInfo: { msg: 'Nice!', tip: 'You have already voted on this poll.' },
      invalidPoll: false,
      hasVoted: false,
      triedToVote: false,
      voteSuccessful: null,
    }
  }

  componentWillMount() {
    this.setIdFromUrl()
  }

  componentDidMount() {
    this.voteSubscription = this.props.allVotesQuery.subscribeToMore({
      document: gql`
      subscription watchVotes{
        Vote(filter:
        {
          mutation_in: [CREATED]
          node: {
            option: {
              poll: {
                 id: "${this.state.id}"
              }
            }
        }}
        ) {
          mutation
            node {
              createdAt
                option {
                  id
                    _votesMeta {
                      count
                    }
                  }
                }
              }
            }
      `,
      variables: null,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.allVotesQuery.Poll) {
      this.setState({
        invalidPoll: true,
      })
    }
    if (nextProps.allVotesQuery.Poll.options) {
      const optionsMap = nextProps.allVotesQuery.Poll.options.map(option => ({
        id: option.id,
        name: option.name,
        count: option._votesMeta.count,
      }))
      this.setState({
        options: optionsMap,
      })
    }
    if (nextProps.allVotesQuery.Poll.title !== this.state.title) {
      this.setState({
        title: nextProps.allVotesQuery.Poll.title,
      })
      document.title = `${nextProps.allVotesQuery.Poll.title} | Pollarity.`
    }
  }

  setIdFromUrl = () => {
    const idFromUrl = this.props.match.params.id
    const voted = localStorage.getItem(idFromUrl)
    this.setState({
      id: idFromUrl,
    })
    if (voted === 'voted') {
      this.setState({
        hasVoted: true,
      })
    }
    if (voted === null) {
      localStorage.setItem(idFromUrl, 'visited')
    }
  }

  addVote = ({ option }) => {
    this.setState({
      triedToVote: true,
    })
    const { id } = option
    const { hasVoted } = this.state
    if (!hasVoted) {
      this.props.submitVote({ id })
        .then(() => {
          this.setState({
            hasVoted: true,
            voteSuccessful: true,
          })
          localStorage.setItem(this.state.id, 'voted')
        })
    }
  }

  render() {
    const classes = classNames({
      'option--vote': true,
      'has-voted': this.state.hasVoted,
    })
    const { invalidPoll } = this.state
    return (
      <div className="container full">
        {!this.props.allVotesQuery.loading &&
          <div className="col-12-of-12 fadeInUp results--wrapper">
            <h1 className="result--title">Results for: {this.state.title}</h1>
            { this.state.options && this.state.options.map((option, idx) => (
              <div className="result--wrapper" key={idx}>
                <h2 className="option--name">{ option.name }</h2>
                <span className="option--count">{ option.count } vote(s)</span>
                <button className={classes} onClick={() => this.addVote({ option })}>Vote</button>
              </div>
            ))}
            { this.state.hasVoted &&
              <ErrorAlert
                errorInfo={this.state.errorInfo}
                active=""
              />
            }
            <CopyButton {...this.state} />
          </div>
        }
        {invalidPoll && this.props.allVotesQuery.loading &&
        <ErrorWrapper
          msg="Oof! Looks like something went wrong..."
          tip="Check to make sure you have a valid poll link!"
        />
        }
      </div>
    )
  }
}

const AllFunctions = compose(
  graphql(allVotes, {
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id,
      },
    }),
    name: 'allVotesQuery',
  }),
  graphql(submitVote, {
    props: ({ ownProps, mutate }) => ({
      submitVote: ({ id }) =>
        mutate({
          variables: { id },
        }),
    }),
  }),
)(ShowPoll)

export default withRouter(AllFunctions)
