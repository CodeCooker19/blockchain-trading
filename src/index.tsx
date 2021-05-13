import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'
import App from "./App";
import { Provider } from 'react-redux'
import store from './redux'
// @ts-ignore
import { BrowserRouter as Router } from 'react-router-dom'
import ApplicationUpdater from './redux/application/updater'
import UserUpdater from './redux/user/updater'
import { globalStyle } from "./styles";
import getLibrary from './utils/getLibrary'
import { NetworkContextName } from './constants'

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})

function Updaters() {
  return (
    <>
      <UserUpdater />
      <ApplicationUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <Provider store={store}>
        <Updaters />
        <GlobalStyle />
        <Router>
          <App />
        </Router>
      </Provider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById("root")
);
