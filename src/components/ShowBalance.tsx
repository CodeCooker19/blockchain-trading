import * as React from 'react'
import styled from 'styled-components'
import Icon from './Icon'
import biopIcon from '../assets/logo.png'
import {
  convertAmountFromRawNumber
} from '../helpers/bignumber'

const SAssetRow = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`
const SAssetRowLeft = styled.div`
  display: flex;
`
const SAssetName = styled.div`
  display: flex;
  margin-left: 10px;
`
const SAssetRowRight = styled.div`
  display: flex;
`
const SAssetBalance = styled.div`
  display: flex;
`

const ShowBalance = (props: any) => {
  const { balance, decimals } = props
  const nativeCurrencyIcon = biopIcon
  return (
    <SAssetRow {...props}>
      <SAssetRowLeft>
          <Icon src={nativeCurrencyIcon} />
        <SAssetName>BIOP</SAssetName>
      </SAssetRowLeft>
      <SAssetRowRight>
        <SAssetBalance>
          {`${
            convertAmountFromRawNumber(balance, decimals)} BIOP`}
        </SAssetBalance>
      </SAssetRowRight>
    </SAssetRow>
  )
}

export default ShowBalance
