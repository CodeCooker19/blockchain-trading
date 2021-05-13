import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getOptionsAndCloses, sendComplete, getLatestPrice, getOptionData, callCurrentRoundID } from "../helpers/web3";
import { add, floorDivide } from '../helpers/bignumber';

import OptionVis from 'src/components/OptionVis';
import OptionTable from 'src/components/OptionTable';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';
import { enabledPricePairs } from "../constants";
import { useActiveWeb3React } from '../hooks';
import { initWeb3 } from '../utils';

const SStake = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
`

const Exercise = () => {

  const { account, chainId } = useActiveWeb3React();

  const [address, setAddress] = useState<string>('');
  const [web3, setWeb3] = useState<any>('');
  const [networkId, setNetworkId] = useState<number>(1);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // @ts-ignore
  const [options, setOptions] = useState<[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceInterval, setPriceInterval] = useState<any>();
  const [optionsInterval, setOptionsInterval] = useState<any>();
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [calls, setCalls] = useState<number>(0);
  const [puts, setPuts] = useState<number>(0);
  const [exercised, setExercised] = useState<number>(0);
  const [expired, setExpired] = useState<number>(0);
  const [avgValue, setAvgValue] = useState<number>(0);

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
      loadOpenOptions();
      loadCurrentPrice();

      if (priceInterval > 0) {
        clearInterval(priceInterval);
      }
      let _priceInterval = setInterval(async () => {
        loadCurrentPrice();
      }, 10000);
      setPriceInterval(_priceInterval);

      if (optionsInterval > 0) {
        clearInterval(optionsInterval);
      }
      let _optionsInterval = setInterval(async () => {
        loadOpenOptions();
      }, 30000);
      setOptionsInterval(_optionsInterval);
    }
  }, [address, web3]);

  const loadCurrentPrice = async () => {
    const latestPrice = await getLatestPrice(networkId, web3);
    setCurrentPrice(Number(latestPrice));
  }

  const loadOpenOptions = async () => {
    const options: any = await getOptionsAndCloses(networkId, web3);
    const cr: any = await callCurrentRoundID(networkId, web3, enabledPricePairs[0].address);

    const optionsObjects = {};
    for (let i = 0; i < options.length; i++) {
      if (options[i].returnValues) {
        if (options[i].returnValues.id !== undefined) {// ensurese we skip other events
          if (options[i].returnValues.sP === undefined) {
            // modifier
            if (optionsObjects[options[i].returnValues.id] !== undefined) {
              optionsObjects[options[i].returnValues.id].complete = true;
              if (options[i].event === "Expire") {
                optionsObjects[options[i].returnValues.id].expired = true;
              }
              if (options[i].event === "Exercise") {
                optionsObjects[options[i].returnValues.id].exercised = true;
              }
            }
          } else {
            const optionData: any = await getOptionData(options[i].returnValues.id, web3, networkId);

            optionsObjects[options[i].returnValues.id] = {
              blockNumber: options[i].blockNumber,
              purchaseRound: options[i].returnValues.pR,
              exp: options[i].returnValues.exp,
              id: options[i].returnValues.id,
              creator: options[i].returnValues.account,
              strikePrice: options[i].returnValues.sP,
              lockedValue: options[i].returnValues.lV,
              purchaseValue: optionData.pV,
              type: options[i].returnValues.dir,
              complete: false
            }
          }
        }
      }
    }

    const sorted = Object.keys(optionsObjects).sort((a: any, b: any) => b - a);

    let _calls = 0;
    let _puts = 0;
    let _exercised = 0;
    let _expired = 0;
    let _avgValue: any = 0;
    const sortedOptions: any = [];
    sorted.forEach((id: any) => {
      if (optionsObjects[id].type === "1") {
        _calls += 1;
      } else {
        _puts += 1;
      }
      if (optionsObjects[id].exercised) {
        _exercised += 1;
      } else if (optionsObjects[id].expired) {
        _expired += 1;
      }

      console.log(`avgValue ${avgValue}`);
      _avgValue = add(avgValue, optionsObjects[id].lockedValue);

      console.log(`avgValue after ${avgValue}. purchase value of option = ${optionsObjects[id].purchaseValue}`);
      sortedOptions.push(optionsObjects[id]);
    });

    console.log(`totalValue ${avgValue}`);
    _avgValue = floorDivide(avgValue, sorted.length);

    console.log(`avgValue ${avgValue}`);
    console.log(sortedOptions);

    setOptions(sortedOptions);
    setCalls(_calls);
    setPuts(_puts);
    setExercised(_exercised);
    setExpired(_expired);
    setAvgValue(_avgValue);
    setCurrentRound(cr);
  }

  const handleComplete = async (optionId: any) => {
    setPendingRequest(true);
    try {
      console.log(`sending exercise for opton ${optionId}`);
      await sendComplete(address, optionId, networkId, web3, (p1: any, p2: any) => {
        console.log(p1, p2);
        loadOpenOptions();
        setError("");
        setPendingRequest(false);
      });
    } catch (e) {
      setError("Exercise Failed");
      setPendingRequest(false);
    }
  }

  return (
    <SStake>
      <h1 style={{ color: `rgb(${colors.black})` }}>Settle Options</h1>
      <p style={{ color: `rgb(${colors.black})` }}>Earn a settlement fee for exercising in-the-money options or unlocking expired options.</p>
      <SHelper style={{ color: `rgb(${colors.black})` }}>Settlement fees shown do not include gas/transaction fees.</SHelper>
      <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
      {
        pendingRequest ?
          <Loading />
          :
          <>
            <OptionTable
              showFee={true}
              web3={web3}
              options={options}
              handleComplete={(optionId: any) => handleComplete(optionId)}
              currentPrice={currentPrice}
              currentRound={currentRound}
            />
          </>
      }
      <OptionVis
        calls={calls}
        puts={puts}
        exercised={exercised}
        expired={expired}
        avgValue={0}
      // avgValue={web3.utils.fromWei(`${avgValue}`, "ether")}
      />
    </SStake>
  )
}

export default Exercise;
