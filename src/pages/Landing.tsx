import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Column from 'src/components/Column';
import ConnectButton from "../components/ConnectButton";
import { colors } from 'src/styles';
// @ts-ignore
import logo from "../assets/logo.png";
import i18n from "../i18n";
import { DEFAULT_LANG } from "src/constants";

const SBrand = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  & span {
    color: rgb(${colors.lightGrey});
    font-size: 10vh;
    
  }
`;

const SLogo = styled.div`
  width: 15vh;
  height: 15vh;
  background: url(${logo}) no-repeat;
  background-size: cover;
  background-position: center;
`;


const SLanding = styled(Column)`
  width:100%;
  height:100%;
  font-family: "octarine";
`;
const SReasons = styled(Column)`
  width: 100%;
  justity-content: center;
`;

function Landing() {
  const [locale, setLocale] = useState<string>(DEFAULT_LANG);

  useEffect(() => {
    const locale1 = localStorage.getItem('locale');
    setLocale(locale1 !== null ? locale : DEFAULT_LANG);
  }, [])

  return (
    <SLanding >
      <SReasons >
        <SBrand>
          <SLogo /><span>biopset</span>
        </SBrand>
        <h3 style={{ color: `rgb(${colors.black})`, maxWidth: 600 }}>
          {
            // @ts-ignore
            i18n[locale].LANDING2
          }
        </h3>
        <Link to="/buy" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ConnectButton
            primary={true}
            locale={locale}
            onClick={() => {
            }}
          />
        </Link>
        <ConnectButton
          primary={false}
          locale={locale}
          onClick={() => {
            window.open('https://docs.biopset.com', '_blank');
          }}
        />
      </SReasons>
    </SLanding>

  )
}

export default Landing
