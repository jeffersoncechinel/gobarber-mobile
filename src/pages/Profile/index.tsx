import React, { useCallback, useRef } from 'react'
import {
  Button as SignOutButton,
  Alert,
  // Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native'
import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  Header
} from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/Auth'
import Icon from 'react-native-vector-icons/Feather'
import ImagePicker from 'react-native-image-picker'

interface ProfileFormData {
  name: string
  email: string
  password: string
  old_password: string
  password_confirmation: string
}

const SignUp: React.FC = () => {
  const { user, updateUser, signOut } = useAuth()
  const navigation = useNavigation()

  const passwordInputRef = useRef<TextInput>(null)
  const newPasswordInputRef = useRef<TextInput>(null)
  const confirmPasswordInputRef = useRef<TextInput>(null)
  const emailInputRef = useRef<TextInput>(null)
  const formRef = useRef<FormHandles>(null)

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Select an avatar',
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Camera',
        chooseFromLibraryButtonTitle: 'Library'
      },
      (response) => {
        if (response.didCancel) {
          return true
        }

        if (response.error) {
          Alert.alert('Could not update avatar.')
          return true
        }

        const data = new FormData()

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri
        })

        api.patch('users/avatar', data).then((response) => {
          updateUser(response.data)
        })
      }
    )
  }, [updateUser, user.id])

  const handleProfileUpdate = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          email: Yup.string()
            .email('Type a valid email.')
            .required('Email is required.'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val,
            then: Yup.string().required('Password is required.'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val,
              then: Yup.string().required('Password is required.'),
              otherwise: Yup.string()
            })
            .oneOf(
              [Yup.ref('password'), ''],
              'Incorrect password confirmation.'
            )
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {})
        }

        const response = await api.put('/profile', formData)
        updateUser(response.data)

        Alert.alert('Profile updated!')
        navigation.goBack()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return false
        }

        Alert.alert(
          'Profile update error.',
          'There was a problem updating the profile.'
        )
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
            <Header>
              <BackButton onPress={handleGoBack}>
                <Icon name={'chevron-left'} size={24} color={'#999591'} />
              </BackButton>
              <SignOutButton title="SignOut" onPress={signOut} />
            </Header>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>My profile</Title>
            </View>
            <Form
              initialData={user}
              ref={formRef}
              onSubmit={handleProfileUpdate}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Name"
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
                containerStyle={{ marginTop: 16 }}
                name="old_password"
                icon="lock"
                placeholder="Current Password"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  newPasswordInputRef.current?.focus()
                }}
              />
              <Input
                ref={newPasswordInputRef}
                name="password"
                icon="lock"
                placeholder="New Password"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus()
                }}
              />
              <Input
                ref={confirmPasswordInputRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Password confirmation"
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
              Confirm changes
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignUp
