import * as React from 'react'

import Up from "../assets/up.png";
import Down from "../assets/down.png";
import MobileUp from "../assets/mobile_up.png";
import MobileDown from "../assets/mobile_down.png";
interface IBetButtonProps {
  up: boolean
  onClick: any
  active: boolean
}

const BetButton = (props: IBetButtonProps) => {
  const { up, onClick, active } = props;
  const wide = window.innerWidth > window.innerHeight;

  function pickImage() {
    if (wide) {
      if (up) {
        return Up;
      } else {
        return Down;
      }
    } else {
      if (up) {
        return MobileUp;
      } else {
        return MobileDown;
      }
    }
  }

  return (
    <div style={{
      width: wide ? "45px" : "100%",
      height: wide ? "45px" : "50px",
      background: `url(${pickImage()}) no-repeat`,
      backgroundSize: `cover`,
      backgroundPosition: 'center',
      margin: '3px',
      cursor: "pointer",
      color: "white",
      fontSize: '0.65rem',
      fontWeight: 'bold',
      verticalAlign: 'middle',
      opacity: active ? "100%" : "40%"
    }}
      onClick={() => onClick()}
    >
    </div>

  )
}
export default BetButton;