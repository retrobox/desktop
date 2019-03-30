# Desktop electron app

Build with electron-vue

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

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

## sudo prompt

option 1 (most simple):

at the start, verify if the programm was launch under administrative rights, if not ask the user to do so

option 2:

when it come to write image, try to launch the same programm by tring to known where the programm is run

on windows: use more complicated thing while dont elevate with linux