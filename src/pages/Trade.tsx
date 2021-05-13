import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  callCurrentRoundID,
  callBetFee,
  sendComplete,
  callPoolTotalSupply,
  getLatestPrice,
  callPoolStakedBalance,
  callPoolMaxAvailable,
  getDirectRate,
  getOptionCreation,
  getOptionCloses,
  getTotalInterchange,
  callOpenCalls,
  callOpenPuts,
  getBlockNumber
} from "../helpers/web3";
import PriceChart from "../components/PriceChart";
import { makeBet } from "../helpers/web3";
import { enabledPricePairs } from "../constants";
// import OptionTable from 'src/components/OptionTable';
import BetButton from 'src/components/BetButton';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';
import {
  subtract,
  convertAmountFromRawNumber,
  formatFixedDecimals,
  divide,
  greaterThan,
  convertToDecimals
} from 'src/helpers/bignumber';
import { useActiveWeb3React } from '../hooks';
import { initWeb3 } from '../utils';

const height = window.innerHeight;

const SBet = styled.div`
  background-color: #F6F6F6;
  width:100%;
  height: ${height - 70}px;
`
const SHelper = styled.div`
  font-size:< x-small;
  color: rgb(${colors.black});>
`

const SBetter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const SInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: stretch;
  padding-left: 20px;
  padding-top: 50px;
`

// const SInputBbContainer = styled.div`
//   flex: 1;
//   height: 100px;
//   text-transform: uppercase;
//   box-sizing: border-box;
//   -moz-box-sizing: border-box;
//   font-weight: bold;
//   font-size: 1.05rem;
//   margin-top: 10px;
//   border-radius: 8px;
// `
const SInputBb = styled.input`
  background-color: transparent;
  text-align: center;
  border: none;
  margin-left: 10%;
  margin-right: 10%;
  height: 30px;
  font-weight: bold;
  font-size: 1.3rem;
  width: 80%;
  display: block;
  margin-bottom:1px;
`

const SInputBox = styled.div`
position: relative;
`

// const SOutlined = styled.span`
//   -webkit-text-stroke-width: 0.5px;
//   -webkit-text-stroke-color: white;
// `

const SBetButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// const SRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// `;

// const SColumn = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
//   height: 100%;
// `;

const SSelect = styled.select`
  background-color: #F6F6F6;
  height: 41px;
  width: 140px;
  margin-right: 40px;
  box-shadow: 0px 3px 6 px #00000029;
  border-radius: 5px;
  padding: 5px;
  user-select: none;
`;

const SInterface = styled.div`
  padding: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
`

const Times = {
  "1 Round": 1,
  "3 Rounds": 3,/*
    "15 MIN": 60*15, */
};

const Trade = () => {
  const { account, chainId } = useActiveWeb3React();
  // @ts-ignore
  const [address, setAddress] = useState<string>('');
  // @ts-ignore
  const [web3, setWeb3] = useState<any>();
  // @ts-ignore
  const [networkId, setNetworkId] = useState<number>(1);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(0.1);
  const [maxBet, setMaxBet] = useState<number>(1);
  const [amountToWin, setAmountToWin] = useState<any>(0);
  // @ts-ignore
  const [hasBet, setHasBet] = useState<boolean>(false);
  const [pair, setPair] = useState<any>(enabledPricePairs[0]);
  const [rounds, setRounds] = useState<number>(1);
  // @ts-ignore
  const [userOptions, setUserOptions] = useState<any>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  // @ts-ignore
  const [priceInterval, setPriceInterval] = useState<any>();
  // @ts-ignore
  const [optionsInterval, setOptionsInterval] = useState<any>();
  // @ts-ignore
  const [lastBetCall, setLastBetCall] = useState<boolean>(false);
  // @ts-ignore
  const [totalInterchange, setTotalInterchange] = useState<number>(0);
  const [betDirection, setBetDirection] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<number>(2);
  const [betFee, setBetFee] = useState<number>(0);
  // @ts-ignore
  const [currentRound, setCurrentRound] = useState<number>(0);
  // @ts-ignore
  const [staked, setStaked] = useState<number>(0);
  // @ts-ignore
  const [maxTotalStaked, setMaxTotalStaked] = useState<number>(0);

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
    async function fetchData() {
      await updateBetDirection(betDirection);
      await getStaked();

      updateRate();
      loadUserOptions();
      getTI();
      loadBetFee();
      loadCurrentPrice();

      setPriceInterval(
        setInterval(() => {
          loadCurrentPrice()
        }, 10000)
      );
      setOptionsInterval(
        setInterval(() => {
          loadUserOptions()
        }, 30000)
      );
    }
    if (address && web3) {
      fetchData();
    }
  }, [address, web3]);

  const getTI = async () => {
    const ti = await getTotalInterchange(web3, networkId);
    setTotalInterchange(Number(ti));
  }

  const loadBetFee = async () => {
    const fee = await callBetFee(networkId, web3);
    setBetFee(Number(fee));
  }

  const loadCurrentPrice = async () => {
    const latestPrice = await getLatestPrice(networkId, web3);
    setCurrentPrice(Number(latestPrice));
  }

  const loadUserOptions = async () => {
    let blockNum: any = await getBlockNumber(web3);
    blockNum = subtract(blockNum, 25000);

    const options: any = await getOptionCreation(networkId, web3, blockNum);
    // TODO replace with dynamic price provider
    const cr: any = await callCurrentRoundID(networkId, web3, enabledPricePairs[0].address);
    const massagedOptions = {};
    for (let i = 0; i < options.length; i++) {
      console.log(`loaded event ${options[i].returnValues.account} purchase round:${options[i].pR} ${address}`);
      console.log(options[i]);

      if (options[i].returnValues) {
        if (options[i].returnValues.account === address) {
          massagedOptions[options[i].returnValues.id] = {
            blockNumber: options[i].blockNumber,
            purchaseRound: options[i].returnValues.pR,
            exp: options[i].returnValues.exp,
            id: options[i].returnValues.id,
            creator: options[i].returnValues.account,
            strikePrice: options[i].returnValues.sP,
            lockedValue: options[i].returnValues.lV,
            type: options[i].returnValues.dir,
            complete: false
          }
        }
      }
    }

    console.log("massaged options");
    console.log(massagedOptions);

    // load exercise/expire events
    const completeEvents: any = await getOptionCloses(networkId, web3, blockNum);
    for (let i = 0; i < completeEvents.length; i++) {
      console.log(`found option #1 ${completeEvents[i].returnValues}`);
      console.log(completeEvents[i]);

      if (completeEvents[i].returnValues) {
        if (massagedOptions[completeEvents[i].returnValues.id] !== undefined) {
          massagedOptions[completeEvents[i].returnValues.id].complete = true;
          if (completeEvents[i].event === "Expire") {
            massagedOptions[completeEvents[i].returnValues.id].expired = true;
          }
          if (completeEvents[i].event === "Exercise") {
            massagedOptions[completeEvents[i].returnValues.id].exercised = true;
          }
        }
      }
    }

    const sorted = Object.keys(massagedOptions).sort((a: any, b: any) => b - a);

    console.log(`sorted $`);
    console.log(sorted);
    const sortedOptions: any = [];
    sorted.forEach((id: any) => {
      if (massagedOptions[id].exp) {
        sortedOptions.push(massagedOptions[parseInt(id, 10)]);
      }
    });

    setUserOptions(sortedOptions);
    setCurrentRound(cr);
  }

  const getStaked = async () => {
    const staked = await callPoolStakedBalance(address, networkId, web3);
    const totalStaked = await callPoolTotalSupply(networkId, web3);
    let _maxBet: string = await callPoolMaxAvailable(networkId, web3);
    _maxBet = divide(_maxBet, 10);
    _maxBet = divide(_maxBet, openOptions);
    setMaxTotalStaked(Number(totalStaked));
    setStaked(Number(staked));
    setMaxBet(Number(_maxBet));
  }

  const updateBetDirection = async (dir: boolean) => {
    let open: any;
    if (dir) {
      open = await callOpenCalls(networkId, web3);
    } else {
      open = await callOpenPuts(networkId, web3);
    }

    setBetDirection(dir);
    if (open > 2) {
      setOpenOptions(open);
    } else {
      setOpenOptions(2);
    }
  }

  const handleBetAmountUpdate = async (e: any) => {
    const newBet = e.target.value.split(" ");
    await setBetAmount(newBet)
    await updateRate();
  }

  const updateRate = async () => {
    if (greaterThan(betAmount, convertAmountFromRawNumber(maxBet, 18))) {
      setAmountToWin("invalid");
    } else {
      const amountToWin = await getDirectRate(currentPrice, pair.address, betDirection, rounds, openOptions, web3.utils.toWei(`${betAmount}`, "ether"), networkId, web3);
      console.log(`new amountToWin ${amountToWin}.`);
      // this.setState({ amountToWin: formatFixedDecimals(`${web3.utils.fromWei(`${amountToWin}`, "ether")}`, 5) });
      setAmountToWin(formatFixedDecimals(`${web3.utils.fromWei(`${amountToWin}`, "ether")}`, 5))
      loadBetFee();
    }
  }

  const handleMakeBet = async (direction: boolean) => {
    setPendingRequest(true);
    setLastBetCall(direction);
    try {
      await makeBet(address, web3.utils.toWei(`${betAmount}`, "ether"), direction, rounds, pair.address, networkId, web3, (param1: any, param2: any) => {
        console.log(`makeBet ${param1} maxBet`);
        console.log(param1, param2);
        getStaked();
        setError("");
        setPendingRequest(false);
        setHasBet(true);
      });

    } catch (e) {
      console.log(e);
      setError("Betting Failed");
      setPendingRequest(false);
    }
  }

  // @ts-ignore
  const handleComplete = async (optionId: any) => {
    setPendingRequest(true);
    try {
      console.log(`sending exercise for opton ${optionId}`);
      await sendComplete(address, optionId, networkId, web3, (p1: any, p2: any) => {
        console.log(p1, p2);
        loadUserOptions();
        setError("");
        setPendingRequest(false);
      });
    } catch (e) {
      setError("Exercise Failed");
      setPendingRequest(false);
    }
  }

  // @ts-ignore
  const renderMaxBet = () => {
    if (maxBet === 0) {
      return <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>Pool Maxed Out</SHelper>
    } else {
      return <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>Max Trade Size: {convertToDecimals(`${convertAmountFromRawNumber(maxBet, 18)}`, 6)} ETH</SHelper>
    }
  }

  // @ts-ignore
  const renderRoundsSelect = () => {
    return (
      <SSelect onChange={async (e: any) => {
        await setRounds(Times[e.target.value]);
        await updateRate()
      }}>
        {Object.keys(Times).map((key: any, i: number) => {
          return (
            <option
              key={i}
              value={key}>
              {key}
            </option>
          )
        })}
      </SSelect>
    )
  };

  const renderPairSelect = () => {
    return (
      <SSelect onChange={(e) => {
        setPair(JSON.parse(e.target.value));
      }}>
        {enabledPricePairs.map((nPair: any) => {
          return <option
            key={nPair.pair}
            selected={pair === nPair}
            value={JSON.stringify(nPair)}>
            {nPair.pair}
          </option>
        })}
        <option disabled value="MORE SOON">MORE SOON</option>
      </SSelect>
    )
  };

  const openBettingAlert = () => {
    alert("You are taking a risk!\nBy using BIOPset to make any trade you are risking 100% of the capital you deposit.\nThe rate shown in the win total is the maximum potential value you can win. It is also shown as a percentage in 'Potential Yield'. This is the amount you can win. If it's not enough for you, don't make the trade.");
  }

  const renderInput = () => {
    // const width = window.innerWidth;
    // const height = window.innerHeight;
    // const wideGirl = width > height;

    // <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>STRIKE PRICE: {formatFixedDecimals(web3.utils.fromWei(floorDivide(currentPrice, 100), "lovelace"), 8)} USD</SHelper>

    return (
      <div style={{ color: '#707070', textAlign: 'left', margin: 50 }}>
        {/* <SInputContainer style={{ flexDirection: "row" }}>
          <ReactTooltip effect="solid" />
          <SInputBbContainer style={{ backgroundColor: `rgb(${colors.fadedBlue})`, color: `rgb(${colors.white})` }}>
            <SRow>
              <SColumn style={{ textAlign: "left" }}>
                <span style={{ marginLeft: "20px", color: `white` }}>Maximium Yield:</span>
                <span style={{ marginLeft: "20px", color: `white` }}>Minimum Yield:</span>
              </SColumn>
              <SColumn style={{ textAlign: "right" }}>
                {
                  greaterThan(divide(multiply(divide(amountToWin, betAmount), 100), 2), 5) ?
                    <span style={{ marginRight: "20px", color: `rgb(${colors.white})` }}>{greaterThan(multiply(divide(amountToWin, 2), 100), 0) ? divide(multiply(divide(amountToWin, betAmount), 100), 2) : "100"}%</span>
                    :
                    <SOutlined style={{ marginRight: "20px", color: greaterThan(divide(multiply(divide(amountToWin, betAmount), 100), 2), 5) ? `rgb(${colors.white})` : `rgb(${colors.red})` }}>{greaterThan(multiply(divide(amountToWin, 2), 100), 0) ? divide(multiply(divide(amountToWin, betAmount), 100), 2) : "100"}%</SOutlined>
                }
                <span style={{ marginRight: "20px", color: `white` }}>-100%</span>
              </SColumn>
            </SRow>
          </SInputBbContainer>
        </SInputContainer> */}

        <div style={{ width: 300 }}>
          <div style={{ fontSize: 20, fontWeight: 700, textAlign: 'left' }}>
            Price:
          </div>
          <div style={{ backgroundColor: '#E9E9E9', height: 50, borderRadius: 5, display: 'flex', alignItems: 'center' }} >
            <SInputBox>
              <SInputBb style={{ color: `rgb(${colors.black})` }} value={betAmount} placeholder={`Amount To Bet`} onChange={(e) => handleBetAmountUpdate(e)} id="amountStake" />
              {/* {renderMaxBet()} */}
            </SInputBox>
          </div>
          <div style={{ fontSize: 14 }}>Trading Fee: <span> {divide(betFee, 1000)}%</span></div>
        </div>

        <div style={{ marginTop: 50 }}>
          <div style={{ fontSize: 20, fontWeight: 700, textAlign: 'left' }}>
            TOTAL Win <span style={{ cursor: "pointer", color: '#FF7700' }} onClick={() => openBettingAlert()}>ⓘ</span> :
          </div>
          <div style={{ backgroundColor: '#E9E9E9', color: `rgb(${colors.black})`, height: 50, borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            {amountToWin}
          </div>
        </div>

        <SBetButtonContainer style={{ flexDirection: "row", marginTop: 80 }}>
          <div style={{ backgroundColor: '#F6F6F6', boxShadow: '0px 3px 6px #0000005F', borderRadius: 5, padding: 20 }}>
            <BetButton up={true} onClick={() => { updateBetDirection(true) }} active={betDirection} />
          </div>
          <div style={{ backgroundColor: '#F2D8D8', boxShadow: '0px 3px 6px #0000005F', borderRadius: 5, padding: 20 }}>
            <BetButton up={false} onClick={() => { updateBetDirection(false) }} active={!betDirection} />
          </div>
        </SBetButtonContainer>

        <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button color={betDirection ? `blue` : `red`}
            borderRadius={5}
            onClick={() => { handleMakeBet(betDirection) }}
          >
            <span style={{ color: `white` }}>
              Buy {betDirection ? "Call" : "Put"}
            </span>
          </Button>
        </div>
      </div>
    )
  }

  const renderBetApprove = () => {
    console.log(`rerender chart with pair ${pair} currentPrice ${currentPrice}`);

    return (
      <SBetter>
        <PriceChart pair={pair.pair} currentPrice={currentPrice} />
      </SBetter>
    )
  }

  return (
    <SBet>
      <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
      {
        pendingRequest ?
          <Loading />
          :
          <div style={{ width: '100%', height: '100%' }}>
            <SInputContainer>
              {renderPairSelect()}
              {renderRoundsSelect()}
            </SInputContainer>
            <SInterface>
              {renderBetApprove()}
              {renderInput()}
            </SInterface>
          </div>
      }
      {/* <SHelper >Trading Volume: {formatFixedDecimals(web3.utils.fromWei(`${totalInterchange}`, "ether"), 8)} ETH</SHelper>
        {
          hasBet ?
            <SHelper>Share your price prediction with the world:
                <a
                href={`https://twitter.com/share?ref_src=twsrc%5Etfw&text=I%20bought%20a%20binary%20${lastBetCall ? "Call📈" : "Put📉"}%20option%20on%20%40biopset!%20%0A%0AThink%20you%20can%20pick%20the%20price%20direction%3F%0Abiopset.com%20%0A%0AWanna%20make%20money%3F%20%0AHit%20the%20exercise%20tab%20and%20score%20some%20risk%20free%20%23ETH%0A%0A%23binaryoptions%20%23defi%20%23ethereum%20`}
                className="twitter-share-button" target="_" >
                <b>TWEET IT!</b>
              </a>
            </SHelper>
            :
            null
        }
        <br />
        {userOptions.length > 0 ?
          <>
            <h4 style={{ color: `rgb(${colors.black})` }}>Options Purchased</h4>
            <br />
            <OptionTable
              showFee={false}
              web3={web3}
              options={userOptions}
              handleComplete={(optionId: any) => handleComplete(optionId)}
              currentPrice={currentPrice}
              currentRound={currentRound}
            />
          </>
          :
          <></>
        } */}
    </SBet>
  )
}

export default Trade
