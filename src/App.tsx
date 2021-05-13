import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Route, Redirect, Switch } from 'react-router-dom'
import Web3ReactManager from './components/Web3ReactManager'
import Modal from "./components/Modal";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ModalResult from "./components/ModalResult";
import { IAssetData } from "./helpers/types";
import {
  DEFAULT_LANG
} from "./constants";

import { useWalletModalToggle } from './redux/application/hooks'

// Pages
import Rewards from './pages/Rewards';
import Stake from './pages/Stake';
import Trade from './pages/Trade';
import Exercise from './pages/Exercise';
import Landing from './pages/Landing';
import ITCO from './pages/ITCO';
import WalletModal from './components/WalletModal';

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

function App() {
  // @ts-ignore
  const toggleWalletModal = useWalletModalToggle()

  const [locale, setLocale] = useState<string>(DEFAULT_LANG)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  // @ts-ignore
  const [assets, setAssets] = useState<IAssetData[]>([]);
  const [result, setResult] = useState<any | null>();

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const resetApp = async () => {
  };

  useEffect(() => {
    setResult('AAA');
    setPendingRequest(false);
    const locale1 = localStorage.getItem('locale');
    setLocale(locale1 !== null ? locale : DEFAULT_LANG);
  }, [])

  return (
    <Web3ReactManager>
      <SLayout>
        <Header
          locale={locale}
          killSession={resetApp}
          onConnect={toggleWalletModal}
        />

        <Switch>
          <Route exact path="/home" component={Landing} />
          <Route exact path="/buy" component={ITCO} />
          <Route exact path="/trade" component={Trade} />
          <Route exact path="/exercise" component={Exercise} />
          <Route exact path="/stake" component={Stake} />
          <Route exact path="/governance" component={Rewards} />
          <Redirect to={{ ...location, pathname: '/home' }} />
        </Switch>

        <Modal show={showModal} toggleModal={toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>
                  {"Approve or reject request using your wallet"}
                </SModalParagraph>
              </SContainer>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <ModalResult>{result}</ModalResult>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalTitle>{"Call Request Rejected"}</SModalTitle>
            </SModalContainer>
          )}
        </Modal>
        <WalletModal />
      </SLayout>
    </Web3ReactManager>
  );
}

export default App;
