
import { BO_CONTRACT, PRICE_PROVIDER_CONTRACT, BIOP_CONTRACT, RATECALC_CONTRACT, DGOV_CONTRACT, V2BIOP_CONTRACT, ITCO_CONTRACT } from '../constants'
import { bigNumberStringToInt, greaterThan, subtract } from "./bignumber";


const zeroAddress = "0x0000000000000000000000000000000000000000";

// general functions
export function blockTimestamp(blockNumber: string, web3: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const block = await web3.eth.getBlock(blockNumber);
      console.log(` raw block is ${block}`);
      resolve(block.timestamp * 1000);
    } catch (e) {
      reject(e);
    }
  })
}


export function getETHBalance(address: string, web3: any) {
  return new Promise(async (resolve, reject) => {
    await web3.eth.getBalance(address, (err: any, result: any) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })

  })
}

export function getPriceProviderContract(chainId: number, web3: any, address: any) {
  const pp = new web3.eth.Contract(
    PRICE_PROVIDER_CONTRACT[chainId].abi,
    address != null ? address :
      PRICE_PROVIDER_CONTRACT[chainId].address
  )
  return pp;
}



export function getLatestPrice(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const biop = getPriceProviderContract(chainId, web3, null)
    await biop.methods
      .latestRoundData()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data.answer);
        }
      )
  })
}

export function callCurrentRoundID(chainId: number, web3: any, oracle: any) {
  return new Promise(async (resolve, reject) => {
    const biop = getPriceProviderContract(chainId, web3, oracle)
    await biop.methods
      .latestRoundData()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data.roundId);
        }
      )
  })
}

// rate calc functions
export function getRateCalcContract(chainId: number, web3: any) {
  const rc = new web3.eth.Contract(
    RATECALC_CONTRACT[chainId].abi,
    RATECALC_CONTRACT[chainId].address
  )
  return rc;
}

export function getDirectRate(currentPrice: number, pair: string, dir: boolean, time: number, stack: number, amount: number, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {

    try {
      const bo = getBOContract(chainId, web3)
      const rc = getRateCalcContract(chainId, web3)
      const stack = await optionStack(bo, dir);
      const max = await callPoolMaxAvailable(chainId, web3);
      await rc.methods.
        rate(amount, max, currentPrice, time, dir, stack)
        .call(
          { from: zeroAddress },
          (err: any, data: any) => {
            if (err) {
              reject(err)
            }
            resolve(data);
          }
        )
    } catch (e) {
      console.log(`caught error ${e}`);
      reject(e);
    }

  })
}

function optionStack(bo: any, direction: boolean) {
  return new Promise(async (resolve, reject) => {
    try {
      const oc = bo.methods.oC();
      const op = bo.methods.oP();
      if (direction) {
        // call
        resolve(oc - op >= 1 ? oc - op : 1);
      } else {
        resolve(op - oc >= 1 ? op - oc : 1);
      }
    } catch (e) {
      console.log(`caught error ${e}`);
      reject(e);
    }

  })
}


export function getRate(currentPrice: number, pair: string, dir: boolean, time: number, stack: number, amount: number, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const bo = getBOContract(chainId, web3)
      const max = await callPoolMaxAvailable(chainId, web3);

      console.log(`max is ${max} pair ${pair}, time ${time}, amount ${amount}, chainID: ${chainId}`);
      await bo.methods
        .getRate(pair, max, amount, currentPrice, time, dir)
        .call(
          { from: zeroAddress },
          (err: any, data: any) => {
            if (err) {
              reject(err)
            }
            resolve(data);
          }
        )
    } catch (e) {
      console.log(`caught error ${e}`);
      reject(e);
    }

  })
}

// biop rewards functions
export function getBIOPContract(chainId: number, web3: any) {
  const bp = new web3.eth.Contract(
    BIOP_CONTRACT[chainId].abi,
    BIOP_CONTRACT[chainId].address
  )
  return bp;
}

export function callBIOPBalance(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bp = getBIOPContract(chainId, web3)
    await bp.methods
      .balanceOf(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}


export function callBIOPTotalSupply(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bp = getBIOPContract(chainId, web3)
    await bp.methods
      .totalSupply()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callBIOPAllowance(spender: string, address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bp = getBIOPContract(chainId, web3)
    await bp.methods
      .allowance(address, spender)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function sendBIOPApprove(spender: string, address: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const bp = getBIOPContract(chainId, web3)
    const ts = await callBIOPTotalSupply(chainId, web3);
    await bp.methods
      .approve(spender, ts)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function getDGovContract(chainId: number, web3: any) {
  const dgov = new web3.eth.Contract(
    DGOV_CONTRACT[chainId].abi,
    DGOV_CONTRACT[chainId].address
  );
  return dgov;
}

export function sendDGovStake(amount: string, address: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .stake(amount)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function sendDGovWithdraw(amount: string, address: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .withdraw(amount)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function callDGovStaked(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .staked(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callDGovPendingETH(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .pendingETHRewards(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function callDGovRep(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .rep(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function sendDGovDelegate(rep: string, address: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .delegate(rep)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function sendDGovUnDelegate(address: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const dgov = getDGovContract(chainId, web3)
    await dgov.methods
      .undelegate()
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function getV2TokenContract(chainId: number, web3: any) {
  const token = new web3.eth.Contract(
    V2BIOP_CONTRACT[chainId].abi,
    V2BIOP_CONTRACT[chainId].address
  );
  return token;
}

export function callV2BIOPBalance(address: string, chainId: number, web3: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const bp = getV2TokenContract(chainId, web3)
    await bp.methods
      .balanceOf(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(`${err}`);
          }

          resolve(data)
        }
      )
  })
}

export function callV2BIOPV3Approved(address: string, chainId: number, web3: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const bp = getV2TokenContract(chainId, web3)
    await bp.methods
      .allowance(address, BIOP_CONTRACT[chainId].address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(`${err}`);
          }

          resolve(data)
        }
      )
  })
}

export function callV2BIOPTotalSupply(chainId: number, web3: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const bp = getV2TokenContract(chainId, web3)
    await bp.methods
      .totalSupply()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(`${err}`);
          }
          resolve(data);
        }
      )
  })
}

export function sendV2ApproveV3(amount: any, address: string, chainId: number, web3: any, callback: any) {
  return new Promise(async (resolve, reject) => {
    const bp = getV2TokenContract(chainId, web3);
    await bp.methods
      .approve(BIOP_CONTRACT[chainId].address, amount)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(`${err}`);
          }
        }
      )
      .on('confirmation', callback)
  })
}

export function initiateSwapIfAvailable(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const balance = await callV2BIOPBalance(address, chainId, web3);

    console.log(`biop v2 balance is ${balance} type ${typeof (balance)}`);
    // tslint:disable-next-line
    if (greaterThan(balance, 0)) {
      if (window.confirm("BIOP v2 balance detected. Do you want to swap to v3?")) {

        console.log(`user has v2 balance so we initiate swap`);
        const approved = await callV2BIOPV3Approved(address, chainId, web3);

        console.log(`user has v2approved ${approved} amd balance ${balance}`);

        // user has v2 balance so we initiate swap

        if (approved >= balance) {
          // already approved, just second part
          const v3 = getBIOPContract(chainId, web3);

          // step 2: init swap
          await v3.methods
            .swapv2v3()
            .send(
              { from: address },
              (err: any, data: any) => {
                if (err) {
                  reject(err)
                }
                resolve(data)
              })
        } else {
          // step 1: approve v3 contract
          sendV2ApproveV3(balance, address, chainId, web3, async (d: any) => {
            const v3 = getBIOPContract(chainId, web3);
            // step 2: init swap
            await v3.methods
              .swapv2v3()
              .send(
                { from: address },
                (err: any, data: any) => {
                  if (err) {
                    reject(err)
                  }
                  resolve(data)
                })
          }
          )
        }
      }
    }
  });
}

export function getITCOContract(chainId: number, web3: any) {
  const itco = new web3.eth.Contract(
    ITCO_CONTRACT[chainId].abi,
    ITCO_CONTRACT[chainId].address
  );
  return itco;
}

export function buyFromITCO(amount: number, address: string, chainId: number, web3: any) {
  console.log(`buying itco with amount eth ${amount}`);
  return new Promise(async (resolve, reject) => {
    await web3.eth.sendTransaction({
      from: address,
      to: ITCO_CONTRACT[chainId].address,
      value: amount
    }).then((res: any) => {
      resolve(res);
    });
  });
}

export function callITCOAmountSold(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const itco = getITCOContract(chainId, web3);
    await itco.methods
      .currentTier()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data);
        }
      )
  })
}

export function postBuyBIOP(amount: string, address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const itco = getITCOContract(chainId, web3);
    await itco.methods
      .getPendingClaims(address)
      .send(
        { from: zeroAddress, value: amount },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data);
        }
      )
  })
}

export function getBOContract(chainId: number, web3: any) {
  const pool = new web3.eth.Contract(
    BO_CONTRACT[chainId].abi,
    BO_CONTRACT[chainId].address
  );
  return pool;
}

export function callBIOPPendingBalance(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3);
    await bo.methods
      .getPendingClaims(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data);
        }
      )
  })
}

export function callBetFee(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3);
    await bo.methods
      .devFundBetFee()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(0)
          }
          resolve(data);
        }
      )
  })
}

export function callOpenCalls(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3);
    await bo.methods
      .oC()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(0)
          }
          resolve(data);
        }
      )
  })
}

export function callOpenPuts(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3);
    await bo.methods
      .oP()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(0)
          }
          resolve(data);
        }
      )
  })
}

export function claimRewards(address: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3);
    await pool.methods
      .claimRewards()
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function callSoldAmount(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const biop = getBOContract(chainId, web3)
    await biop.methods
      .totalSupply()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          console.log(`biop raw balance is ${data}`);
          resolve(data)
        }
      )
  })
}

// POOL functions 
export function callPoolTotalSupply(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .totalSupply()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callPoolMaxAvailable(chainId: number, web3: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .getMaxAvailable()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            console.log(err);
            reject(0)
          }
          resolve(data)
        }
      )
  })
}

export function callPoolNextWithdraw(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .nW(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callPoolStakedBalance(address: string, chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .balanceOf(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function sendDeposit(address: string, amount: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3);
    console.log(bigNumberStringToInt(amount));
    await pool.methods
      .stake()
      .send(
        { from: address, value: amount },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function sendWithdrawGuarded(address: string, amount: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    console.log(bigNumberStringToInt(amount));
    const lockedAmount: any = await getPoolLockedAmount(chainId, web3);
    const poolBalance: any = await callPoolTotalSupply(chainId, web3);
    if (greaterThan(amount, subtract(poolBalance, lockedAmount))) {
      alert("Invalid withdraw. Try withdrawing a little less. A portion of the funds you are trying to withdraw are currently locked in open options.");
      resolve("Invalid withdraw. Try withdrawing a little less. A portion of the funds you are trying to withdraw are currently locked in open options.");
      onComplete();
    } else {
      resolve(sendWithdraw(address, amount, chainId, web3, onComplete));
    }
  });

}

export function sendWithdraw(address: string, amount: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const pool = getBOContract(chainId, web3);
    await pool.methods
      .withdraw(amount)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  });
}

export function getPoolLockedAmount(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3)
    await bo.methods
      .lockedAmount()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callMaxRounds(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3)
    await bo.methods
      .maxT()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callMinRounds(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    const bo = getBOContract(chainId, web3)
    await bo.methods
      .minT()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function callMaxMin(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const max = callMaxRounds(chainId, web3);
      const min = callMinRounds(chainId, web3);
      resolve({ max, min });
    } catch (e) {
      console.log(`error loading max min ${e}`);
      reject({ max: 3, min: 1 });
    }
  })
}

// binary options functions
export function makeBet(address: string, amount: string, callOption: boolean, time: number, priceProvider: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    console.log(`make bet 2  senbt vy ${address} priceprovider ${priceProvider}, amount ${amount}`);
    const pool = getBOContract(chainId, web3);

    const formattedAmount = bigNumberStringToInt(amount);

    console.log(`bet amuynt raw type ${typeof (amount)}`);

    console.log(`bet amuynt raw ${amount}`);

    console.log(`bet amuynt raw ${formattedAmount}`);

    const poolLockedAmount = await getPoolLockedAmount(chainId, web3);

    console.log(`pool locked amount${poolLockedAmount}`);

    console.log(`formatted amount ${formattedAmount}`);

    console.log(`${callOption} ${priceProvider} ${time} ${BO_CONTRACT[chainId].address}`);
    await pool.methods
      .bet(callOption, priceProvider, time)
      .send(
        { from: address, value: amount },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function getPossiblePayout(amount: string, web3: any, chainId: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3);
    const formattedAmount = bigNumberStringToInt(amount);

    console.log(`formatted amount ${formattedAmount}`);
    await bin.methods
      .calculatePossiblePayout(formattedAmount)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function getTotalInterchange(web3: any, chainId: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3);
    await bin.methods
      .tI()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}

export function getOptionData(optionId: any, web3: any, chainId: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3);
    await bin.methods
      .options(optionId)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
  })
}


export function sendComplete(address: string, optionId: any, chainId: number, web3: any, onComplete: any) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3);

    console.log(`expiring option #${optionId}`);
    await bin.methods
      .complete(optionId)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function getBlockNumber(web3: any) {
  return new Promise(async (resolve, reject) => {
    web3.eth.getBlockNumber((err: any, result: any) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    })
  })
}


export function getAllEvents(chainId: number, web3: any, blockNum: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3)
    await bin.getPastEvents('allEvents', {// 'create' evemt
      fromBlock: blockNum,
      toBlock: 'latest'
    }, (error: any, events: any) => {
      if (error) {
        reject(error);
      }
      resolve(events);
    })
  })
}

export function getOptionCreation(chainId: number, web3: any, blockNum: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3)
    await bin.getPastEvents('Create', {// 'create' evemt
      fromBlock: blockNum,
      toBlock: 'latest'
    }, (error: any, events: any) => {
      if (error) {
        reject(error);
      }
      resolve(events);
    })
  })
}
export function getOptionExpiration(chainId: number, web3: any, blockNum: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3)
    await bin.getPastEvents('Expire', {
      fromBlock: blockNum,
      toBlock: 'latest'
    }, (error: any, events: any) => {
      resolve(events);
      if (error) {
        reject(error);
      }
      resolve(events);
    })
  })
}

export function getOptionExercise(chainId: number, web3: any, blockNum: number) {
  return new Promise(async (resolve, reject) => {
    const bin = getBOContract(chainId, web3)
    await bin.getPastEvents('Exercise', {
      fromBlock: blockNum,
      toBlock: 'latest'
    }, (error: any, events: any) => {
      resolve(events);
      if (error) {
        reject(error);
      }
      resolve(events);
    })
  })
}

export function getOptionCloses(chainId: number, web3: any, blockNum: number) {
  return new Promise(async (resolve, reject) => {
    try {

      let options: any = await getOptionExpiration(chainId, web3, blockNum);
      options = options.concat(await getOptionExercise(chainId, web3, blockNum));
      resolve(options);
    } catch (e) {
      reject(e);
    }
  })
}

export function getOptionsAndCloses(chainId: number, web3: any) {
  return new Promise(async (resolve, reject) => {
    try {

      let blockNum: any = await getBlockNumber(web3);
      blockNum = subtract(blockNum, 25000);// about two days
      let options: any = await getOptionCreation(chainId, web3, blockNum);
      options = options.concat(await getOptionExpiration(chainId, web3, blockNum));
      options = options.concat(await getOptionExercise(chainId, web3, blockNum));
      resolve(options);
    } catch (e) {
      reject(e);
    }
  })
}
