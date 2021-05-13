import * as React from 'react'
import styled from 'styled-components'
// @ts-ignore
import logo from "../assets/logo.png";

const SLoading = styled.div`
  background: url(${logo}) no-repeat;
  background-size: cover;
  background-position: center;
  height:30vh;
  width:20vh;
  margin: 0 auto;
  -webkit-animation: spin 4s infinite linear;
`

const Loading = () => {
  return (
    <SLoading />
  )
}

export default Loading