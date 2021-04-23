import React, { useCallback, useRef } from 'react'
import { BackToSignIn, BackToSignInText, Container, Title } from './styles'
import logoImg from '../../assets/logo.png'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native'

import Input from '../../components/Input'
import Button from '../../components/Button'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

interface SignupFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const passwordInputRef = useRef<TextInput>(null)
  const emailInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()
  const formRef = useRef<FormHandles>(null)

  const handleSignUp = useCallback(
    async (data: SignupFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          email: Yup.string()
            .email('Type a valid email address.')
            .required('Email is required.'),
          password: Yup.string().min(6, 'Password at least 6 characters.')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await api.post('/users', data)

        Alert.alert(
          'Sign up process success!',
          'You may now sign in application.'
        )
        navigation.navigate('SignIn')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return false
        }
      }
    },
    [navigation]
  )

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome Completo"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />
            </Form>
            <Button
              onPress={() => {
                formRef.current?.submitForm()
              }}
            >
              Criar
            </Button>
          </Container>
        </ScrollView>

        <BackToSignIn onPress={() => navigation.navigate('SignIn')}>
          <Icon name="arrow-left" size={16} color="#fff" />
          <BackToSignInText>Voltar para login</BackToSignInText>
        </BackToSignIn>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignUp
