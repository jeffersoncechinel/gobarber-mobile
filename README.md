# GoBarber Mobile

<p align="center">
  <img src="resources/logo.svg" alt="logo" />
</p>

This is the repository for the GoBarber mobile application.
If you don't know what GoBarber is please have a look [here](https://github.com/jeffersoncechinel/gobarber).

The purpose of this project is to provide clients a signup process, sign in, and the ability to schedule an appointment with the desired provider for beauty services.

You may also want to see the [GoBarber API repository](https://github.com/jeffersoncechinel/gobarber-api)  
You may also want to see the [GoBarber Web repository](https://github.com/jeffersoncechinel/gobarber-web)

![Data Flow](resources/gobarber-mobile.png?raw=true "Data Flow")

The application is written in Typescript + React Native + Styled Components.

Features
----
- Animated switch SignUp and Sign In screens.
- Form input validations with visual alerts.
- Alert messages for success and error operations.
- List available service providers.
- Create new appointment using native select input for dates.
- Custom time series divided by morning and afternoon.
- Times are disabled if not available.
- Update user profile and change password.
- Upload an avatar picture from library or direct take a photo using the mobile camera.

Requirements
----
* [GIT](https://git-scm.com/)
* [NodeJS](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* IOS Emulator and/or Android Emulator

Let's get started
----
:exclamation: Before you begin make sure you have the [GoBarber API](https://github.com/jeffersoncechinel/gobarber-api) up and running.

```
# clone the repository
git clone https://github.com/jeffersoncechinel/gobarber-mobile.git

# access the repository folder
cd gobarber-mobile

# install dependencies
yarn install

# install the pods (ios only)
cd ios
pod install

# start the mobile application
yarn run ios
yarn run android
```

License
----

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
