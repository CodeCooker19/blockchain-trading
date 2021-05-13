import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import Button from "./Button";
import { colors } from "../styles";
import i18n from "../i18n";
import { DEFAULT_LANG } from "../constants";


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
    margin: 10px;
`

export default () => {
  const [lang, setLang] = useState(() => DEFAULT_LANG);
  const [locales, setLocales] = useState(() => [DEFAULT_LANG]);
  const [showPanel, setShow] = useState(false);
  useEffect(() => {

    const locale = localStorage.getItem('locale');
    const isLang = locale !== null ? locale : DEFAULT_LANG;
    setLang(isLang)

    setLocales(Object.keys(i18n));

  }, []);


  return (
    <>
      <div style={{ alignSelf: "center" }}>
        <Button
          onClick={() => setShow(!showPanel)}>
          <span style={{ color: "white" }}>
            {lang}
          </span>
        </Button>
      </div>
      {showPanel ?
        <SMobileContainer >
          <ul>

            {locales.map(lcl => {
              return <SMobileNavItem
                key={lcl}
                onClick={() => {
                  setLang(lcl);
                  localStorage.setItem("locale", lcl);
                  window.location.reload(true);
                }}
                style={{ fontWeight: lcl === lang ? "bold" : "normal" }}
              >
                {lcl}
              </SMobileNavItem>
            })}
          </ul>


        </SMobileContainer>
        : <></>
      }
    </>
  );
};