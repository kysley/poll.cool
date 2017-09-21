import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import { ApolloProvider } from 'react-apollo'
import ReactGA from 'react-ga'

import CreatePoll from './components/CreatePoll'
import ShowPoll from './components/ShowPoll'
import Header from './components/Header'

import styles from '../styles/app.css'

ReactGA.initialize('UA-77767358-4')

const GoogleAnalytics = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
  return null
}

const wsClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/cj66g2wto1lbd0187xc4xvdpq`, {
  reconnect: true,
  connectionParams: {

  },
})

const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/cj66g2wto1lbd0187xc4xvdpq`,
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Header />
        <GoogleAnalytics />
        <Switch>
          <Route path="/" exact component={CreatePoll} />
          <Route path="/poll/:id" exact component={ShowPoll} />
        </Switch>
      </div>
    </Router>
  </ApolloProvider>
), document.getElementById('app'))
