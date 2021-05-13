import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { callPoolTotalSupply, callPoolStakedBalance, callPoolNextWithdraw, sendDeposit, sendWithdrawGuarded, getPoolLockedAmount, getETHBalance } from "../helpers/web3";
import { BO_CONTRACT } from "../constants/contracts";
import Input from 'src/components/Input';
import Switch from 'src/components/Switch';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';
import { convertAmountFromRawNumber, convertToDecimals, formatFixedDecimals, subtract } from 'src/helpers/bignumber';
import { useActiveWeb3React } from '../hooks';
import { initWeb3 } from '../utils';
import Footer from '../components/Footer';
import { DEFAULT_LANG } from "../constants";

const height = window.innerHeight;

const SStake = styled.div`
  width:100%;
  height: ${height - 70}px;
  display: flex;
  justify-content: center;
  align-items:center;
  flex-direction: column;
`
const SHelper = styled.div`
  font-size: x-small;
`

const Stake = () => {
  const { account, chainId } = useActiveWeb3React();
  const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : DEFAULT_LANG;

  const [address, setAddress] = useState<string>('');
  const [web3, setWeb3] = useState<any>('');
  const [networkId, setNetworkId] = useState<number>(1);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // @ts-ignore
  const [staked, setStaked] = useState<number>(0);
  const [totalStaked, setTotalStaked] = useState<number>(0);
  const [staking, setStaking] = useState<boolean>(false);
  const [nextWithdraw, setNextWithdraw] = useState<number>(0);
  const [locktotalLocked, setLocktotalLocked] = useState<number>(0);
  const [poolBalance, setPoolBalance] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);

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

  // @ts-ignore
  useEffect(() => {
    if (web3 && address) {
      getStaked();
    }
  }, [address, web3]);

  const getStaked = async () => {
    const _staked = await callPoolStakedBalance(address, networkId, web3);
    const _nextWithdraw = await callPoolNextWithdraw(address, networkId, web3);
    const _totalStaked = await callPoolTotalSupply(networkId, web3);
    const _locktotalLocked = await getPoolLockedAmount(networkId, web3);
    const _poolBalance = await getETHBalance(BO_CONTRACT[networkId].address, web3);

    setTotalStaked(Number(_staked));
    setNextWithdraw(Number(_nextWithdraw));
    setTotalStaked(Number(_totalStaked));
    setLocktotalLocked(Number(_locktotalLocked));
    setPoolBalance(Number(_poolBalance));
  }

  const handleWithdraw = async () => {
    if (changeAmount > 0) {
      await sendWithdrawGuarded(address, web3.utils.toWei(changeAmount, "ether"), networkId, web3, (param1: any, param2: any) => {
        getStaked();
        setPendingRequest(false);
        setError("");
        setChangeAmount(0);
      });
    } else {
      setPendingRequest(false);
      setError("Can't withdraw 0");
    }

  }

  const handleDeposit = async () => {
    setPendingRequest(true);

    // tslint:disable-next-line
    alert("Your deposit amount will be (soft) locked for 14 days.");
    await sendDeposit(address, web3.utils.toWei(changeAmount, "ether"), networkId, web3, (param1: any, param2: any) => {
      getStaked();
      setPendingRequest(false);
      setError("");
      setChangeAmount(0);
    });
  }

  const renderWithdrawAvailable = () => {
    if (nextWithdraw !== 0) {
      const unlock = new Date(nextWithdraw * 1000);// add 1 days
      const now = new Date();
      const lockInPlace = unlock.getTime() > now.getTime();
      return (
        <div>
          <SHelper style={{ color: `rgb(${colors.red})` }}>
            {lockInPlace ? `Early Withdraw incure a 1%  penalty. Next fee free withdraw is ${unlock.toLocaleString()}` : ""}
          </SHelper>
          <br />
          <Button onClick={() => handleWithdraw()}>
            Withdraw
          </Button>
        </div>
      )
    } else {
      return null;
    }

  }

  const renderStakeWithdrawSwitch = () => {
    return (
      <Switch
        vertical={false}
        on={staking}
        onTap={() => {
          setStaking(true);
          setChangeAmount(0);
          setError("");
        }}
        onLabel="Stake"
        offTap={() => {
          setStaking(false);
          setChangeAmount(0);
          setError("");
        }}
        offLabel="Withdraw"
      />
    )
  }

  const renderStake = () => {
    if (changeAmount > 0) {
      return (
        <div>
          <Button onClick={() => handleDeposit()}>
            Stake
          </Button>
        </div>
      )
    } else {
      return null;
    }
  }

  return (
    <SStake>
      <div style={{
        backgroundColor: '#F6F6F6',
        boxShadow: '0px 5px 6px #00000029',
        borderRadius: 20,
        padding: 20,
        color: '#3F3F4F',
        width: '60%',
        minWidth: 480
      }}
      >
        <div style={{ fontSize: 36 }}>
          <b>Sell Options</b>
        </div>
        <div style={{ fontSize: 22, marginTop: 10 }}>
          Contribute to the liquidity pool and passively earn premiums.
          </div>
      </div>
      <div style={{
        backgroundColor: '#F6F6F6',
        boxShadow: '0px 5px 6px #00000029',
        borderRadius: 20,
        padding: 20,
        marginTop: 50,
        marginBottom: 150,
        color: '#3F3F4F',
        fontSize: 22,
        width: '60%',
        minWidth: 480
      }}
      >
        <div style={{ color: `rgb(${colors.black})` }}>
          <b>{web3 ? convertToDecimals(`${formatFixedDecimals(`${web3.utils.fromWei(`${poolBalance}`, "ether")}`, 5)}`, 2) : '0.00'} ETH</b> Total Staked
            (<b>{web3 ? formatFixedDecimals(`${web3.utils.fromWei(`${subtract(poolBalance, locktotalLocked)}`, "ether")}`, 5) : '0.00'}</b> Available)
          </div>
        <div style={{ color: `rgb(${colors.black})` }}>
          Your contribution: <b>{convertAmountFromRawNumber(staked, 18)} ETH</b>
        </div>
        <div style={{ color: `rgb(${colors.black})` }}>
          <b>{convertToDecimals(`${((staked / totalStaked)) * 100}`, 2)}%</b> of total staked.
          </div>
        {renderStakeWithdrawSwitch()}
        <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
        {
          pendingRequest ?
            <Loading />
            :
            <>
              <Input value={changeAmount} placeholder={`Amount To ${staking ? "Stake" : "Withdraw"}`}
                onChange={(e: any) => {
                  setChangeAmount(e.target.value);
                }}
                id="amountStake" />
              <SHelper style={{ color: `rgb(${colors.black})` }}>
                Amount In ETH
                </SHelper>
              {staking ?
                renderStake()
                :
                renderWithdrawAvailable()
              }
            </>
        }
      </div>
      <Footer
        locale={locale}
      />
    </SStake >
  )
}

export default Stake
