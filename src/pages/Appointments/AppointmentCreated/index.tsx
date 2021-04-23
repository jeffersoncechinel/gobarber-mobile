import React, { useCallback, useMemo } from 'react'
import { Container, Title, Description, OkButton, OkButtonText } from './styles'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { format } from 'date-fns'

interface RouteParams {
  date: number
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation()
  const { params } = useRoute()

  const routeParams = params as RouteParams
  const formattedDate = useMemo(() => {
    return format(routeParams.date, "EEEE dd 'of' MMMM yyyy 'at' HH:mm'h'")
  }, [routeParams.date])
  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard'
        }
      ],
      index: 0
    })
  }, [reset])

  return (
    <Container>
      <Icon name={'check'} size={80} color={'#04d361'} />
      <Title>Appointment success</Title>
      <Description>{formattedDate}</Description>
      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  )
}

export default AppointmentCreated
