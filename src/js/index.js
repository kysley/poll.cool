import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import App from './components/CreatePoll'


const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj66g2wto1lbd0187xc4xvdpq',
})

const client = new ApolloClient({
  networkInterface,
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </ApolloProvider>
), document.getElementById('app'))
