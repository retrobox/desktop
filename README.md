# Desktop electron app

Build with electron-vue, available in french and english (at this time).

### Preview :

![alt](https://static.retrobox.tech/img/app/Retrobox_Desktop_App_euyZshYEtp.png)

### Dependencies

- vue
- vuetify
- drivelist
- etcher-image-write
- decompress
- decompress-unzip
- filesize
- request
- request-progress
- axios
- crypto
- electron-sudo
- is-admin
- is-elevated
- socket.io-client
- sudo-prompt
- vue-clipboard2
- vue-i18n
- vuex
- yauzl

#### Build Setup (linux)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

-------

#### Build Setup (windows)

Environment needed (or recommended) :

1. VS Enterprise 2015 with **all components** (or just community version) (And restart your computer after the installation)
2. Python 2.7 (and ONLY this version)
3. Npm v6.4.1 (or newer)
4. Node v10.15.0 (or newer)

``` bash
# install dependencies
npm install

# install Native Node Modules
npm install --save-dev electron-rebuild

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# Every time you run "npm install", run this
./node_modules/.bin/electron-rebuild

```
You will get frequently error with drivelist dependency... So we found the fix : Install VS Enterprise 2015 and everything was functional !

More information's here :

[Natives Node Modules](https://github.com/electron/electron/blob/v0.37.2/docs/tutorial/using-native-node-modules.md#using-native-node-modules)

[Our issue on drivelist](https://github.com/balena-io-modules/drivelist/issues/340)

## sudo prompt

option 1 (most simple):

at the start, verify if the programm was launch under administrative rights, if not ask the user to do so

option 2:

when it come to write image, try to launch the same programm by tring to known where the programm is run

on windows: use more complicated thing while dont elevate with linux
