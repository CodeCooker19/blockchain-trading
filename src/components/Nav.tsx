import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import DarkModeToggle from './DarkModeToggle';
import LocaleToggle from './LocaleToggle';
import { colors } from "../styles";
import {
  TRADE,
  STAKE,
  EXERCISE_EXPIRE,
  GOVERNANCE,
  BUY_BIOP,
  BIOP_ROUTE
} from "../constants";
import Button from './Button';
import i18n from "../i18n";

const SNav = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-direction: row;
  justify-content: flex-end;
`

const SMobileContainer = styled.div`
  background-color: rgb(${colors.white});
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  padding-top: 10%;
  margin-top: 0%;
  font-size: x-large;
  cursor: pointer;
`

const SMobileNavItem = styled.li`
  color: rgb(${colors.black});
  padding: 5px;
`

const STogglie = styled.li` 
  padding: 5px;
  border-radius: 0 0 10px 0;
`

const SNavLink = styled.div`
  cursor: pointer;
  color: ${colors.navFontColor};
  margin-left: 30px;
  margin-right: 30px;
  font-size: 1.10rem;
  font-weight: bold;
`

interface INavProps {
  locale: string
}

const Nav = (props: INavProps) => {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(BUY_BIOP);

  function navLink(page: string, currentPage: string, index: number, length: number) {
    return (
      <SNavLink
        onClick={() => { setCurrentPage(page), history.push(BIOP_ROUTE[index]); }}
        style={page === currentPage ?
          {
            color: `${colors.navActiveFontColor}`,
            borderBottom: `3px solid ${colors.borderRed}`,
          }
          :
          {}
        }
        key={page}>
        {page}
      </SNavLink>
    );
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const pages = [
    STAKE,
    TRADE,
    EXERCISE_EXPIRE,
    GOVERNANCE,
    BUY_BIOP,
  ]
  if (width > height) {
    return (
      <SNav>
        {pages.map((page, i) => navLink(page, currentPage, i, pages.length))}
        <STogglie>
          <LocaleToggle />
        </STogglie>
        <div style={{ paddingLeft: "25px" }}><DarkModeToggle /></div>
      </SNav>
    )
  } else {
    return (
      <div>
        <SMobileContainer >
          <ul>
            {pages.map(page => {
              return (
                <SMobileNavItem
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    history.push('/stak')
                  }}
                  style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
                >
                  {page}
                </SMobileNavItem>
              )
            })}
            <LocaleToggle />
            <DarkModeToggle />
          </ul>
        </SMobileContainer>
        :
        <Button
        >
          <span style={{ color: `white` }}>
            {
              // @ts-ignore
              i18n[locale].MENU
            }
          </span>
        </Button>
      </div>
    )
  }
}


Nav.propTypes = {}

export default Nav;