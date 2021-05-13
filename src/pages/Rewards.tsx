import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { callBIOPPendingBalance, callBIOPBalance, claimRewards } from "../helpers/web3";

import Button from "../components/Button";
import Loading from "../components/Loading";
import ClaimETHRewards from "../components/governance/ClaimETHRewards";
import Delegate from "../components/governance/Delegate";
import StakeBIOP from "../components/governance/StakeBIOP";
import { convertAmountFromRawNumber } from 'src/helpers/bignumber';
import { colors } from "../styles";
import { useActiveWeb3React } from '../hooks';
import { initWeb3 } from '../utils';

const height = window.innerHeight;

const SRewards = styled.div`
  height: ${height - 70}px;
`
const SHelper = styled.div`
    font-size: x-small;
`

const Stake = () => {
  const { account, chainId } = useActiveWeb3React();

  const [address, setAddress] = useState<string>('');
  const [web3, setWeb3] = useState<any>('');
  const [networkId, setNetworkId] = useState<number>(1);
  // @ts-ignore
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  // @ts-ignore
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [biopPendingBalance, setBiopPendingBalance] = useState<number>(0);
  const [biopBalance, setBiopBalance] = useState<number>(0);

  useEffect(() => {
    if (!!account) {
      setAddress(account);
    }
  }, [account]);

  useEffect(() => {
    if (!!chainId) {
      setNetworkId(chainId)
      setWeb3(initWeb3(chainId));
    }
  }, [chainId]);

  useEffect(() => {
    if (web3 && address) {
      getAvailableClaims();
      getCurrentBalance();
    }
  }, [address, web3]);

  const getAvailableClaims = async () => {
    const _biopBalance = await callBIOPBalance(address, networkId, web3);
    setBiopBalance(Number(_biopBalance));
  }

  const getCurrentBalance = async () => {
    const _biopPendingBalance = await callBIOPPendingBalance(address, networkId, web3);
    setBiopPendingBalance(Number(_biopPendingBalance));
  }

  const handleClaimRewards = () => {
    setLoading(true);
    claimRewards(address, networkId, web3, (res: any) => {
      getCurrentBalance();
      getAvailableClaims();
      setLoading(false);
    });
  }

  const showClaimButton = () => {
    if (biopPendingBalance > 0) {
      return <Button onClick={() => handleClaimRewards()}>Claim rewards</Button>
    } else {
      return null;
    }
  }

  return (
    <SRewards>
      <div style={{ paddingTop: 200, fontSize: 40, color: `rgb(${colors.black})` }}><b>Earn Rewards</b></div>
      <div style={{ color: `rgb(${colors.black})` }}>BIOP governance tokens earned for utilizing the protocol.</div>
      {loading ?
        <Loading />
        :
        <div>
          <div style={{ color: `rgb(${colors.black})` }}>Claims: <b>{convertAmountFromRawNumber(biopPendingBalance, 18)} BIOP</b></div>
          <div style={{ color: `rgb(${colors.black})` }}>Balance: <b>{convertAmountFromRawNumber(biopBalance, 18)} BIOP</b></div>
          {showClaimButton()}
        </div>
      }
      <br />
      <SHelper style={{ color: `rgb(${colors.black})` }}>Governance will be available here soon</SHelper>

      <div style={{ display: "none" }}>
        {
          web3 && address ?
            <div>
              <div style={{ border: "1px solid black" }}>
                <StakeBIOP web3={web3} chainId={chainId} address={address} />
              </div>

              <div style={{ border: "1px solid black" }}>
                <ClaimETHRewards web3={web3} chainId={chainId} address={address} />
              </div>

              <div style={{ border: "1px solid black" }}>
                <Delegate web3={web3} chainId={chainId} address={address} />
              </div>
            </div>
            :
            null
        }
        <div style={{ border: "1px solid black" }}>
          <h3>Governance🏦</h3>
          <SHelper>Governance actions will be available here soon.</SHelper>
          <h4>Tier 1: 50%</h4>
          <Button disabled>Update Max Option Time</Button>
          <Button disabled>Update Min Option Time</Button>
          <h4>Tier 2: 66%</h4>
          <Button disabled>Update Exercise/Expire Fee</Button>
          <Button disabled>Update Trade Pairs and RateCalcs</Button>
          <h4>Tier 3: 75%</h4>
          <Button disabled>Update Bet Fee</Button>
          <Button disabled>Update pool lock time</Button>
          <Button disabled>Update staking rewards length epoch</Button>
          <h4>Tier 4: 90%</h4>
          <Button disabled>Change Governance Tier Levels</Button>
          <Button disabled>Close Pool From New Deposits</Button>
        </div>
      </div>
    </SRewards>
  )
}

export default Stake
