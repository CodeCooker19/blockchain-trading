import Web3 from "web3";

export function initWeb3(chainID: number) {
  const providerUrl = chainID === 3 ? process.env.REACT_APP_TEST_WEB3_PROVIDER :
    chainID === 42 ? process.env.REACT_APP_KOVAN_WEB3_PROVIDER :
      process.env.REACT_APP_WEB3_PROVIDER

  console.log('===>', providerUrl)
  // @ts-ignore
  const web3: any = new Web3(window.ethereum);
  
  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}