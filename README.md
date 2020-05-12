# Desktop electron app

Build with electron-vue, available in french and english (at this time).

### Preview :

![alt](https://static.retrobox.tech/img/app/desktopapp_preview.png)

#### Build Setup (linux)

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:9080
env WEB_ENDPOINT=https://retrobox.tech WEB_SOCKET_ENDPOINT=https://ws.retrobox.tech API_ENDPOINT=http://api.retrobox.tech yarn run dev

# build electron application for production
yarn run build


```

-------

#### Build Setup (windows)

Environment needed (or recommended) :

1. VS Enterprise 2015 with **all components** (or just community version) (And restart your computer after the installation)
2. Python 2.7 (and ONLY this version)
3. Yarn 1.16.0 (or newer)
4. Node v10.15.0 (or newer)
5. API & web & ws server online on your lan.

``` bash
# install dependencies
yarn install

# install Native Node Modules
yarn install --save-dev electron-rebuild

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build

# Every time you run "yarn install", run this
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

### Dependencies

| See in | [package.json](https://github.com/retrobox/desktop/blob/master/package.json) |
|--|--|
| [vue](https://www.npmjs.com/package/vue) | [crypto](https://www.npmjs.com/package/crypto) |
| [vuetify](https://www.npmjs.com/package/vuetify) | [electron-sudo](https://www.npmjs.com/package/electron-sudo) |
| [drivelist](https://www.npmjs.com/package/drivelist) | [is-admin](https://www.npmjs.com/package/is-admin) |
| [etcher-image-write](https://www.npmjs.com/package/etcher-image-write) | [is-elevated](https://www.npmjs.com/package/is-elevated) |
| [decompress](https://www.npmjs.com/package/decompress) | [socket.io-client](https://www.npmjs.com/package/socket.io-client) |
| [decompress-unzip](https://www.npmjs.com/package/decompress-unzip) | [sudo-prompt](https://www.npmjs.com/package/sudo-prompt) |
| [filesize](https://www.npmjs.com/package/filesize) | [vue-clipboard2](https://www.npmjs.com/package/vue-clipboard2) |
| [request](https://www.npmjs.com/package/request)| [vue-i18n](https://www.npmjs.com/package/vue-i18n) |
| [request-progress](https://www.npmjs.com/package/request-progress) | [vuex](https://www.npmjs.com/package/vuex) |
| [axios](https://www.npmjs.com/package/axios) | [yauzl](https://www.npmjs.com/package/yauzl)  |