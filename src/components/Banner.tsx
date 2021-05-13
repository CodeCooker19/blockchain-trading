import * as React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { fonts, colors } from "../styles";

const SBannerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 5px;
  & span {
    font-family: "octarine";
    color: rgb(${colors.brandGrey});
    font-size: ${fonts.size.h3};
  }
`;

const SLogo = styled.div`
  width: 60px;
  height: 60px;
  background: url(${logo}) no-repeat;
  background-size: cover;
  background-position: center;
`;

const Banner = () => (
  <SBannerWrapper>
    <SLogo />
    <span style={{}}>{`biop`}</span>
  </SBannerWrapper>
);

export default Banner;
