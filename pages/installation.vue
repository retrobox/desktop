<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Choose your device</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2">Wifi setup</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 3" step="3">Download image</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 4" step="4">Write image</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5">Verification</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-4">
            <v-card-text>
              <v-radio-group v-model="chosenDrive" class="mt-0" hide-details v-if="drives.length != 0">
                <v-list subheader> 
                  <v-subheader>Choose your device</v-subheader>                 
                  <v-list-tile
                    v-for="(drive, index) in drives"
                    :key="index">
                    <v-radio :label="drive.humanName" :value="drive"></v-radio>
                  </v-list-tile>
                </v-list>
              </v-radio-group>
              <div v-else>
                <v-layout justify-center class="py-2">
                  Searching for devices...
                </v-layout>
              </div>
            </v-card-text>
          </v-card>

          <v-layout justify-end>
            <v-btn color="primary" @click="step = 2">Continue</v-btn>
          </v-layout>

        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-4">
              <v-card-title>
                Setup your wifi network
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field label="Wifi SSID" v-model="wifi.ssid" autofocus />
                  <v-text-field label="Wifi Password" type="password" v-model="wifi.password" />
                  <v-autocomplete
                    v-model="wifi.country"
                    :items="countries"
                    menu-props="auto"
                    label="Select your country"
                    hide-details
                    prepend-icon="map"
                    :loading="loadingCountries"
                    single-line
                  ></v-autocomplete>
                </v-form>
              </v-card-text>
          </v-card>
          
          <v-layout justify-space-between>            
            <v-btn outline @click="step = 1">Previous</v-btn>
            <v-btn color="primary" @click="step = 3">Continue</v-btn>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="3">
            <v-progress-linear 
              v-if="downloadingImage"
              v-model="imageDownloadState.percentHuman"></v-progress-linear>
            <v-progress-linear 
              v-else
              indeterminate></v-progress-linear>            

            <v-layout justify-center align-center class="pt-2">
                <span v-if="downloadingImage">Downloading image... ({{ imageDownloadState.percentHuman }} %)</span>
                <span v-else>Extracting image... </span>
            </v-layout>

            <!-- <v-btn @click="writeImage()">Write</v-btn> -->
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
const drivelist = require('drivelist')
const filesize = require('filesize')
const axios = require('axios')
const fs = require('fs')
const request = require("request")
const path = require("path")
const progress = require("request-progress")
export default {
  data: () => ({
    step: 1,
    chosenDrive: 0,
    drives: [],
    wifi: {
      ssid: '',
      password: '',
      country: ''
    },
    loadingCountries: false,
    countries: [],
    imageDownloadState: {},
    downloadingImage: false,
    unCompressing: false
  }),
  async created() {
    this.$store.commit("SET_TITLE", "Installation");

    this.scanTick()
  },
  watch: {
    step: function (step) {
      if (step === 2) {
        this.fetchCountries()
      }
      if (step === 3) {
        this.downloadImage()
      }
    }
  },
  methods: {
    fetchCountries() {
      this.loadingCountries = true
      axios.get('https://raw.githubusercontent.com/lefuturiste/countries/master/en.json').then((response) => {
        this.countries = response.data.countries.map(country => {
          return { value: country.code, text: country.name }
        })
        this.loadingCountries = false
      })
    },
    scanTick() { 
      drivelist.list((error, drives) => {
        if (error) {
          throw error;
        }

        this.drives = drives.filter((drive) => {
           return drive.isRemovable
        })
        this.drives = this.drives.map((device) => {
          device.humanName = device.device
          device.humanSize = filesize(device.size)
          let realName = device.description.substring(0, device.description.indexOf('('))
          if (realName !== '') {
            device.humanName = device.humanName + ' - ' + realName
          }
          device.humanName = device.humanName + ' - ' + device.humanSize
          return device
        })

        setTimeout(() => {
            this.scanTick()
        }, 1000)
      });      
    },
    downloadImage () {
      let imageUrl = "https://downloads.raspberrypi.org/raspbian_lite_latest"
      let downloadedImage = './dist.zip'
      
      this.downloadingImage = true
      progress(request(imageUrl), {})
          .on("progress", state => {
            console.log("progress", state)
            this.imageDownloadState = state
            this.imageDownloadState.percentHuman = (state.percent * 100).toFixed(2)
          })
          .on("error", function(err) {
            console.log("error with the image download");
            console.log(err);
          })
          .on("end", () => {
            console.log("end of the image download");
            this.downloadingImage = false
            this.unCompressing = true
            this.decompressImage()            
          })
          .pipe(fs.createWriteStream(path.resolve(downloadedImage)))
    },
    decompressImage () {
      const decompress = require('decompress');
      const decompressUnzip = require('decompress-unzip');

      console.log('decompress...')
      decompress(path.resolve('./dist.zip'), 'dist', {
          plugins: [decompressUnzip()]
      }).then(() => {
          this.unCompressing = false
          console.log('Files decompressed');
      });
    },
    writeImage() {
      // const sudo = require('sudo-prompt');
      // var options = {
      //   name: 'Retrobox'
      // };
      // sudo.exec('echo hello', options,
      //   function(error, stdout, stderr) {
      //     if (error) throw error;
      //     console.log('stdout: ' + stdout);
      //   }
      // );
      // const imageWrite = require('etcher-image-write')

      // let emitter = imageWrite.write({
      //   fd: fs.openSync(this.chosenDrive.device, 'rs+'),
      //   device: this.chosenDrive.device,
      //   size: this.chosenDrive.size
      // }, {
      //   stream: fs.createReadStream('/mnt/data/2018-06-27-raspbian-stretch-lite.img'),
      //   size: fs.statSync('/mnt/data/2018-06-27-raspbian-stretch-lite.img').size
      // }, {
      //   check: true
      // });
      
      // emitter.on('progress', (state) => {
      //   console.log(state);
      // });
      
      // emitter.on('error', (error) => {
      //   console.error(error);
      // });
      
      // emitter.on('done', (results) => {
      //   console.log('Success!');
      // });
    },
    // installPm2() {
    //   return new Promise(resolve => {
    //     const { exec } = require("child_process");
    //     exec("./node/bin/npx pm2", (err, stdout, stderr) => {
    //       console.log('pm2 installed?')
    //       console.log(stdout)
    //       console.log(stderr)
    //     })
    //   })
    // },
    // installNode() {
    //   return new Promise(resolve => {
    //     const fs = require("fs");

    //     // check if already install
    //     if (fs.existsSync("./node/bin/node")) {
    //       console.log("do not install node");
    //       return resolve();
    //     }

    //     const request = require("request");
    //     const path = require("path");
    //     const progress = require("request-progress");
    //     // const decompress = require('decompress');
    //     const os = require("os");

    //     let baseUrl = "https://nodejs.org/dist/v10.15.3/";
    //     let binaries = {
    //       windows: {
    //         //.zip
    //         type: "zip",
    //         x32: baseUrl + "node-v10.15.3-win-x86.zip",
    //         x64: baseUrl + "node-v10.15.3-win-x64.zip"
    //       },
    //       darwin: {
    //         //.tar.gz
    //         type: "gz",
    //         x64: baseUrl + "node-v10.15.3-darwin-x64.tar.gz"
    //       },
    //       linux: {
    //         // .tar.xz
    //         type: "xz",
    //         x64: baseUrl + "node-v10.15.3-linux-x64.tar.xz",
    //         arm: {
    //           v6: baseUrl + "node-v10.15.3-linux-armv6l.tar.xz",
    //           v7: baseUrl + "node-v10.15.3-linux-armv7l.tar.xz",
    //           v8: baseUrl + "node-v10.15.3-linux-arm64.tar.xz"
    //         }
    //       }
    //     };
    //     let toDownloadUrl = "";

    //     switch (os.type()) {
    //       case "Windows_NT":
    //         switch (os.arch()) {
    //           case "x64":
    //             toDownloadUrl = binaries.windows.x64;
    //             break;
    //           case "x32":
    //             toDownloadUrl = binaries.windows.x32;
    //             break;
    //         }
    //         break;
    //       case "Linux":
    //         switch (os.arch()) {
    //           case "arm":
    //             console.log("Linux - Arm");
    //             switch (process.config.variables.arm_version) {
    //               case 6:
    //                 toDownloadUrl = binaries.linux.arm.v6;
    //                 break;
    //               case 7:
    //                 toDownloadUrl = binaries.linux.arm.v7;
    //                 break;
    //               case 8:
    //                 toDownloadUrl = binaries.linux.arm.v8;
    //                 break;
    //             }
    //             break;
    //           case "x64":
    //             toDownloadUrl = binaries.linux.x64;
    //             console.log("Linux - x64");
    //             break;
    //         }
    //         break;
    //       case "Darwin":
    //         toDownloadUrl = binaries.darwin;
    //         console.log("darwin");
    //         break;
    //     }

    //     let fileName = toDownloadUrl.replace(baseUrl, "");
    //     console.log(fileName);
    //     progress(request(toDownloadUrl), {})
    //       .on("progress", function(state) {
    //         console.log("progress", state);
    //       })
    //       .on("error", function(err) {
    //         // Do something with err
    //         console.log("error with the installation");
    //         console.log(err);
    //       })
    //       .on("end", function() {
    //         console.log("end of the installation");
    //         switch (os.type()) {
    //           case "Windows_NT":
    //             break;
    //           case "Linux":
    //             const { exec } = require("child_process");
    //             exec("tar -xf " + fileName, (err, stdout, stderr) => {
    //               if (err) {
    //                 console.log(
    //                   "can't extract -xf archive : can't run command"
    //                 );
    //                 return;
    //               }
    //               exec(
    //                 "mv ./" + fileName.replace(".tar.xz", "") + " node",
    //                 (err, stdout, stderr) => {
    //                   console.log("folder renamed");

    //                   return resolve();
    //                 }
    //               );
    //             });
    //             break;
    //           case "Darwin":
    //             break;
    //         }
    //       })
    //       .pipe(fs.createWriteStream(fileName));
    //   });
    // }
  }
};
</script>
