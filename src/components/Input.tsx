import * as React from 'react'
import styled from 'styled-components'

interface IInputProps {
  onChange: any;
  id: string;
  placeholder: string;
  value: any;

}


const SInput = styled.input`
border-radius: 8px;
  height: 44px;
  width: 100%;
  max-width: 175px;
  margin: 2px;
`

const Input = (props: IInputProps) => {
  const { onChange, placeholder, id, value } = props
  return (
    <SInput
      placeholder={placeholder}
      onChange={onChange}
      id={id}
      value={value}
    />
  )
}




export default Input
