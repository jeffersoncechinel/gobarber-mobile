import React from 'react'
import { Container, ButtonText } from './styles'
import { RectButtonProperties } from 'react-native-gesture-handler'

interface ButtonProps extends RectButtonProperties {
  children?: string
  color?: any
}

const Button: React.FC<ButtonProps> = ({ children, color, ...rest }) => (
  <Container color={color} {...rest}>
    <ButtonText>{children}</ButtonText>
  </Container>
)

export default Button
