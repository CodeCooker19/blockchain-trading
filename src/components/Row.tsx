import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

interface IRowStyleProps {
  spanHeight: boolean
  maxWidth: number
  center: boolean
}

interface IRowProps extends IRowStyleProps {
  children: React.ReactNode
}

const SRow = styled.div<IRowStyleProps>`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? '100%' : 'auto')};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`

const RowBetween = (props: IRowProps) => {
  const { children} = props
  return (
    <SRow
      {...props}
    >
      {children}
    </SRow>
  )
}

RowBetween.propTypes = {
  children: PropTypes.node.isRequired,
  spanHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
  center: PropTypes.bool
}

RowBetween.defaultProps = {
  spanHeight: false,
  maxWidth: 600,
  center: false
}

export default RowBetween
