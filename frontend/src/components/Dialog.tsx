import { Button } from 'antd'
import { Backdrop } from 'components/Backdrop'
import styled from 'styled-components'
import React, { useCallback, useEffect } from 'react'
import { COLORS } from 'constants/colors'

const Container = styled.div<ContainerProps>`
  width: ${({ width }) => width};
  padding: 25px;
  background-color: ${COLORS.white};
  border: 1px solid ${COLORS.gray2};
  border-radius: 4px;
`

const Buttons = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: min-content min-content;
  justify-content: end;
`

const Text = styled.div`
  margin-bottom: 25px;
  white-space: initial;
`

export const DialogContainer = styled.div<{ top?: string; left?: string }>`
  position: relative;

  ${Container} {
    position: fixed;
    z-index: 200;
    margin-top: ${({ top }) => (top ? top : '0')};
    margin-left: ${({ left }) => (left ? left : '0')};
  }
`

export interface DialogProps {
  width?: string
  showBackdrop?: boolean
  text?: React.ReactNode | React.ReactNodeArray
  confirm?: React.ReactNode | React.ReactNodeArray
  cancel?: React.ReactNode | React.ReactNodeArray
  onConfirm?: () => void
  onCancel?: () => void
  className?: string
}

export type ContainerProps = Pick<DialogProps, 'width'>

export const Dialog: React.FC<DialogProps> = ({
  width = '18rem',
  showBackdrop = false,
  text,
  confirm,
  cancel,
  onConfirm,
  onCancel,
  className,
}) => {
  const keyDownComponent = () => window

  const handleCancel = useCallback(
    (event: any) => {
      if (onCancel) {
        if (event instanceof KeyboardEvent) {
          //  Call onClose prop on ESC key down
          if (event.keyCode === 27) {
            onCancel()
          }
        } else {
          if (event.target === event.currentTarget) {
            onCancel()
          }
        }
      }
    },
    [onCancel]
  )

  useEffect(() => {
    if (onCancel) {
      keyDownComponent().addEventListener('keydown', handleCancel, true)
    }

    return () => {
      if (onCancel) {
        keyDownComponent().removeEventListener('keydown', handleCancel, true)
      }
    }
  }, [onCancel, handleCancel])

  return (
    <>
      <Container width={width} className={className}>
        <Text>{text}</Text>
        <Buttons>
          <Button onClick={onConfirm} size="small" type="primary">
            {confirm}
          </Button>
          <Button onClick={handleCancel} size="small">
            {cancel}
          </Button>
        </Buttons>
      </Container>

      {showBackdrop && <Backdrop show onClick={handleCancel} />}
    </>
  )
}
