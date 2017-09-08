import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import LoadingBar from './LoadingBar'
import ErrorWrapper from './ErrorWrapper'

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

class ShowPoll extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      id: '',
      options: null,
      title: '',
      invalidPoll: false,
    }
  }

  componentWillMount() {
    this.setIdFromUrl()
  }

  componentDidMount() {
    const { id } = this.state
    console.log(this.props)
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
    console.log(nextProps)
    if (nextProps.allVotesQuery.Poll) {
      console.log("there is data")
    } else {
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
    }
  }

  setIdFromUrl = () => {
    const idFromUrl = this.props.match.params.id
    this.setState({
      id: idFromUrl,
    })
  }

  addVote = (id) => {
    console.log(`this is the id: ${id}`)
  }

  render() {
    console.log(this.state.options)
    const { invalidPoll } = this.state
    return (
      <div className="container full">
        {!this.props.allVotesQuery.loading &&
          <div className="col-12-of-12 fadeInUp results--wrapper">
          <h1 className="result--title">Results for: {this.state.title}</h1>
          { !this.props.allVotesQuery.loading && (this.state.options.map((option, idx) => (
            <div className="option"key={idx}>
              <h2 className="option--name">{ option.name }</h2>
              <span className="option--count">{ option.count } vote(s)</span>
              <button className="option--vote" onClick={() => this.addVote(option.id)}>Vote</button>
            </div>
          )))}
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

const VoteSub = graphql(allVotes, {
  options: ownProps => ({
    variables: {
      id: ownProps.match.params.id,
    },
  }),
  name: 'allVotesQuery' })(ShowPoll)

export default withRouter(VoteSub)
