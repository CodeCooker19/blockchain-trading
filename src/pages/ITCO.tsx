import React, { useState, useEffect } from "react";
import styled from "styled-components";
import i18n from "../i18n";
import { getETHBalance, callITCOAmountSold, buyFromITCO, callBIOPBalance } from "../helpers/web3";
import ReactTooltip from 'react-tooltip';
import { DEFAULT_LANG, enabledPricePairs } from "../constants";
import Column from 'src/components/Column';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import ITCOChart from 'src/components/ITCOChart';
import { colors, fonts } from 'src/styles';
import { useActiveWeb3React } from '../hooks';
import { formatFixedDecimals, divide } from 'src/helpers/bignumber';
import { initWeb3 } from '../utils';
import Footer from '../components/Footer';

const SBet = styled.div`
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const SHelper = styled.div`
  font-size: x-small;
`

const SInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: stretch;
`

const SInputBbContainer = styled.div`
  flex: 1;
  height: 100px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  font-weight: bold;
  font-size: 1.05rem;
  border-radius: 40px;
`

const SInput = styled.input`
  background: transparent;
  border: none;
  border-width: 0px;
  color: #707070;
  font-weight: bold;
`

const SRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    item-aligns: 'center';
`;

const SInputRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px; 
  background-color: #E9E9E9;
  border-radius: 20px;
  padding: 10px;
`

const SSelect = styled.select`
    border-radius: 8px;
    height: 44px;
    width: 100%;
    user-select: none;
    flex: 1;
`;

const SInterface = styled.div`
  background: #F6F6F6;
  box-shadow: 0px 11px 10px #00000029;
  padding: 20px;
  border-radius: 35px;
`

const Times = {
  "1 Round": 1,
  "3 Rounds": 3,/*
    "15 MIN": 60*15, */
};

const Trade = () => {
  const { account, chainId } = useActiveWeb3React();

  const [address, setAddress] = useState<string>("")
  const [networkId, setNetworkId] = useState<number>(42);
  const [web3, setWeb3] = useState<any>();
  // @ts-ignore
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // @ts-ignore
  const [spendAmount, setSpendAmount] = useState<number>(0.0);
  const [price, setPrice] = useState<number>(0);
  // @ts-ignore
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  // @ts-ignore
  const [priceInterval, setPriceInterval] = useState<any>();
  const [balance, setBalance] = useState<number>(0);
  // @ts-ignore
  const [biopBalance, setBiopBalance] = useState<number>(0);
  // @ts-ignore
  const [betFee, setBetFee] = useState<number>(0);
  const [tier, setTier] = useState<any>(1);
  // @ts-ignore
  const [round, setRound] = useState<number>(1);
  // @ts-ignore
  const [openOptions, setOpenOptions] = useState<number>(2);
  // @ts-ignore
  const [currentRound, setCurrentRound] = useState<number>(0);

  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(false);
  // @ts-ignore
  const [hasBet, setHasBet] = useState<boolean>(false);
  // @ts-ignore
  const [lastBetCall, setLastBetCall] = useState<boolean>(false);
  // @ts-ignore
  const [betDirection, setBetDirection] = useState<boolean>(true);

  const [toReceive, setToReceive] = useState<any>(0);
  // @ts-ignore
  const [userOptions, setUserOption] = useState<any>([]);
  // @ts-ignore
  const [optionsInterval, setOptionsInterval] = useState<any>();
  // @ts-ignore
  const [pair, setPair] = useState<any>(enabledPricePairs[0]);


  const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : DEFAULT_LANG;

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
    if (!!address && !!web3) {
      getBalance();
      getAmountSold();
    }
  }, [address, web3]);

  const getBalance = async () => {
    const ba = await getETHBalance('0x9292F65c97cea374191Ee8650A098c7E2DF1dCB9', web3);
    const biba = await callBIOPBalance('0x9292F65c97cea374191Ee8650A098c7E2DF1dCB9', networkId, web3);
    setBalance(Number(ba));
    setBiopBalance(Number(biba));
  }

  const getAmountSold = async () => {
    const data: any = await callITCOAmountSold(networkId, web3);
    setPrice(data[0]);
    setTier(data[1]);
  }

  // @ts-ignore
  const handlespendAmountUpdate = async (e: any) => {
    const newBet = e.target.value.split(" ");
    await setSpendAmount(newBet);
  }

  const updateToReceive = async (spend: any) => {
    try {
      setToReceive(divide(web3.utils.toWei(`${spend}`), price));
      setError("");
    } catch (e) {
      setError("Invalid Input");
    }
  }

  // @ts-ignore
  const renderRoundsSelect = () => {
    return (
      <SSelect onChange={async (e: any) => {
        // @ts-ignore
        await this.setState({ rounds: Times[e.target.value] });
      }}>
        {Object.keys(Times).map((key: any, i: number) => {
          return (<option
            key={i}
            value={key}>
            {key}</option>)
        })}
      </SSelect>
    )
  };

  const renderInput = () => {
    return (
      <SInputContainer>
        <Column>
          <SInputBbContainer style={{ height: "100%" }}>
            <SRow style={{ margin: "10px" }}>
              <span style={{ color: '#707070' }}>
                {
                  // @ts-ignore
                  i18n[locale].SELL
                }
              </span>
              <span style={{ color: '#A7A7A7', fontSize: fonts.size.tiny, paddingTop: "5px", cursor: "pointer" }}
                onClick={() => {
                  setSpendAmount(web3.utils.fromWei(`${balance}`, "ether"));
                  updateToReceive(web3.utils.fromWei(`${balance}`, "ether"));
                }}
              >
                {
                  // @ts-ignore
                  i18n[locale].AVAILABLE}: {formatFixedDecimals(web3.utils.fromWei(`${balance}`, "ether"), 6)
                }
              </span>
            </SRow>
            <SInputRow >
              <SInput
                value={spendAmount}
                onChange={(e) => {
                  setSpendAmount(Number(e.target.value));
                  updateToReceive(e.target.value);
                }}
              />
              <span style={{ color: '#707070' }}>ETH</span>
            </SInputRow>
            <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>

            <SRow style={{ margin: "10px" }}>
              <span style={{ color: '#707070' }}>
                {
                  // @ts-ignore
                  i18n[locale].BUY
                }
              </span>
              <span style={{ color: '#A7A7A7', fontSize: fonts.size.tiny, paddingTop: "5px", cursor: "pointer" }} >
                {
                  // @ts-ignore
                  i18n[locale].AVAILABLE}: {formatFixedDecimals(web3.utils.fromWei(`${biopBalance}`, "ether"), 6)
                }
              </span>
            </SRow>
            <SInputRow >
              <SInput
                value={toReceive}
              />
              <span style={{ color: '#707070' }}>BIOP</span>
            </SInputRow>
            <div style={{ height: 15 }} />
            <Button
              onClick={async () => {
                setLoading(true);
                await buyFromITCO(web3.utils.toWei(`${spendAmount}`), address, networkId, web3);
                setLoading(false);
                await getBalance();
              }}
            >
              <div style={{ color: `white` }}>
                {
                  // @ts-ignore
                  i18n[locale].BUY
                }
              </div>
            </Button>
          </SInputBbContainer>
          <ReactTooltip effect="solid" />
        </Column>
      </SInputContainer >
    )
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <>
      <SBet>
        {
          pendingRequest || !web3 || !address ?
            <Loading />
            :
            <SRow style={{ flexDirection: width > height ? "row" : "column" }}>
              <ITCOChart web3={web3} chainId={networkId} tier={tier} />
              <div style={{ width: 150, height: 10 }} />
              <SInterface>
                {renderInput()}
              </SInterface>
            </SRow>
        }
      </SBet >
      <Footer
        locale={locale}
      />
    </>
  )
}

export default Trade
