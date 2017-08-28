import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

const allVotes = gql`
query {
  Poll(id: "cj6mtnsgkufou0183q5e6u9jo") {
    id
      options {
        name
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
      id: 'cj6mtnsgkufou0183q5e6u9jo',
    }
  }

  componentDidMount() {
    console.log(allVotes)
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
    if (nextProps.VoteSub) {
      console.log(nextProps)
    }
  }

  render() {
    return (
      <div>
      sup
      </div>
    )
  }
}

const VoteSub = graphql(allVotes, { name: 'allVotesQuery' })(ShowPoll)

export default withRouter(VoteSub)
