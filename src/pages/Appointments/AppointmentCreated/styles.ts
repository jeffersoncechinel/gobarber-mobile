import styled from 'styled-components/native'
import { RectButton } from 'react-native-gesture-handler'
export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 32px;
  color: #f4ede8;
  text-align: center;
  margin-top: 48px; ;
`

export const Description = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #999591;
  margin-top: 16px;
`

export const OkButton = styled(RectButton)`
  background: #ff9000;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 12px 24px;
  margin-top: 30px;
`

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`
