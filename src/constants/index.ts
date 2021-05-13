export * from './actions'
export * from './contracts'
export * from './functions'
export * from './tooltips'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import { AbstractConnector } from '@web3-react/abstract-connector'

export const DEFAULT_LANG = "EN🇨🇦";

// pages
export const BUY_BIOP = "BIOP";
export const STAKE = "Stake";
export const HOME_PAGE = "Home";
export const BUY_SELL = "Exchange";
export const TRADE = "Trade";
export const EXERCISE_EXPIRE = "Settle";
export const GOVERNANCE = "Governance";

export const BIOP_ROUTE = [
  '/buy',
  '/stake',
  '/trade',
  '/exercise',
  '/governance',
];

// time frames
export const HOUR = "HOUR";
export const MINUTE = "MINUTE";
export const NetworkContextName = 'NETWORK'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}


// price pairs
export const enabledPricePairs = [
  {
    symbol: "LINK",
    name: "chainlink",
    pair: "LINKUSDT",// switched to TradingView pair syntax
    address: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0"// "0x9326BFA02ADD2366b30bacB125260Af641031331"// "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
  },
  /* {
      symbol: "BTC",
      name: "wrapped-bitcoin",
      pair: "BTC/USD",
      address: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
  }, */
]


