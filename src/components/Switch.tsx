import * as React from 'react'
import styled from 'styled-components'
import { fonts, colors } from "../styles";

interface ISwitchProps {
  on: boolean;
  onTap: any;
  offTap: any;
  onLabel: string;
  offLabel: string;
  vertical: boolean;
}

const SToggleSwitch = styled.div`
    border-radius: 8px;
    height: 44px;
    width: 100%;
    border: 1px solid rgb(${colors.blue});
    display: flex;
    flex-direction: row;
`

const SToggleChild = styled.button`
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-size: ${fonts.size.medium}
`

const Switch = (props: ISwitchProps) => {
  const { on, onTap, offTap, onLabel, offLabel, vertical } = props

  return (
    <SToggleSwitch style={{ flexDirection: vertical ? "column" : "row" }}>
      <SToggleChild onClick={onTap} style={on ? { color: `rgb(${colors.blue})`, backgroundColor: "white" } : { color: "white", backgroundColor: `rgb(${colors.blue})` }}>
        {onLabel}
      </SToggleChild>
      <SToggleChild onClick={offTap} style={!on ? { color: `rgb(${colors.blue})`, backgroundColor: "white" } : { color: "white", backgroundColor: `rgb(${colors.blue})` }}>
        {offLabel}
      </SToggleChild>
    </SToggleSwitch>

  )
}

export default Switch
