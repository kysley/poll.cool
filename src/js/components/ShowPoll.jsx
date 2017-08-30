import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

const allVotes = gql`
  query allPollData($id: ID!) {
    Poll(id: $id) {
      id
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
    }
  }

  componentWillMount() {
    this.setIdFromUrl()
  }

  componentDidMount() {
    const { id } = this.state
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
      updateQuery: (previousState, { subscriptionData }) => {
        if (subscriptionData.data) {
          console.log(subscriptionData.data)
        }
      },
    })
  }

  componentWillReceiveProps(nextProps) {
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
    if (nextProps.VoteSub) {
      console.log(nextProps)
    }
  }

  setIdFromUrl = () => {
    const idFromUrl = this.props.match.params.id
    this.setState({
      id: idFromUrl,
    })
  }

  render() {
    console.log(this.state.options)
    return (
      <div>
        { (this.state.options.map((option, idx) => (
          <div key={idx}>
            { option.name }
            <button>Vote</button>
          </div>
        )))}
      </div>
    )
  }
}

// const VoteSub = graphql(allVotes, { name: 'allVotesQuery' })(ShowPoll)

const VoteSub = graphql(allVotes, {
  options: ownProps => ({
    variables: {
      id: ownProps.match.params.id,
    },
  }),
  name: 'allVotesQuery' })(ShowPoll)

export default withRouter(VoteSub)
