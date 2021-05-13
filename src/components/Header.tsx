import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import Blockie from './Blockie'
import Banner from './Banner'
import { ellipseAddress } from '../helpers/utilities'
import { transitions, colors } from '../styles'
import Nav from './Nav'
import { useActiveWeb3React } from '../hooks'

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  height: 70px;
  display: flex;
  align-items: center;
  opacity: 100%;
  background-color: ${colors.navBackground};
  justify-content: space-between;
  box-shadow: 0px 3px 6px #00000029;
`

const SActiveAccount = styled.div`
  background-color: ${colors.connectButtonColor};
  width: 240px;
  height: 50px;
  border-radius: 23px
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-left: 30px;
  margin-right: 30px;
`

const SActiveChain = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`

const SBlockie = styled(Blockie)`
  margin-right: 10px;
`

interface IHeaderStyle {
  account: string | null | undefined
}

const SDisconnect = styled.div<IHeaderStyle>`
  color: ${colors.text6}
  transition: ${transitions.button};
  font-size: ${({ account }) => account ? '12px' : '15px'};
  font-weight: ${({ account }) => account ? 500 : 900};
  font-family: monospace;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  pointer-events: auto;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`


interface IHeaderProps {
  killSession: () => void
  onConnect: () => void
  locale: string
}

const Header = (props: IHeaderProps) => {
  const { killSession, onConnect, locale } = props

  const { account } = useActiveWeb3React()


  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <>
      <SHeader {...props}>
        <SActiveChain>
          <Banner />
        </SActiveChain>
        <Nav locale={locale} />
        {
          account ?
            <SActiveAccount>
              <SBlockie address={account} />
              <SDisconnect
                account={account}
                onClick={() => killSession()}
              >
                {width > height ? ellipseAddress(account) : ""}
              </SDisconnect>
            </SActiveAccount>
            :
            <SActiveAccount>
              <SDisconnect
                account={account}
                onClick={() => onConnect()}
              >
                Connect Wallet
              </SDisconnect>
            </SActiveAccount>
        }
      </SHeader>
    </>
  )
}

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
}

export default Header
