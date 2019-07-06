<template>
  <v-layout>
    <!-- <v-layout class="mb-3" justify-center align-center>
            <v-img src="https://raw.githubusercontent.com/retrobox/web/master/assets/images/nav.png" height="40" contain />
    </v-layout>-->

    <!-- <div v-html="debug"></div> -->

    <!-- <v-btn color="success" @click="trySmth()">Run script</v-btn> -->
    <v-stepper v-model="step" style="width:100%">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Choose your device</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2">Wifi setup</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 3" step="3">Download image</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 4" step="4">Write image</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5">Done</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-4">
            <v-card-text>
              <v-radio-group
                v-model="chosenDrive"
                class="mt-0"
                hide-details
                v-if="drives.length != 0"
              >
                <v-list subheader>
                  <v-subheader>Choose your device</v-subheader>
                  <v-list-tile v-for="(drive, index) in drives" :key="index">
                    <v-radio :label="drive.humanName" :value="drive"></v-radio>
                  </v-list-tile>
                </v-list>
              </v-radio-group>
              <div v-else>
                <v-layout justify-center class="py-2">Searching for devices...</v-layout>
              </div>
            </v-card-text>
          </v-card>

          <v-layout justify-end>
            <v-btn outline color="success" @click="scanTick(true)">
              <v-icon left>refresh</v-icon>Refresh
            </v-btn>
            <v-spacer />
            <v-btn color="primary" @click="step = 2" :disabled="chosenDrive == 0">Continue</v-btn>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-4">
            <v-card-title>Setup your wifi network</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field label="Wifi SSID" v-model="wifiSsid" autofocus max="32" />
                <v-text-field
                  label="Wifi Password"
                  v-model="wifiPassword"
                  min="6"
                  :append-icon="isWifiPasswordVisible ? 'visibility_off' : 'visibility'"
                  v-on:click:append="isWifiPasswordVisible = !isWifiPasswordVisible"
                  :type="isWifiPasswordVisible ? 'text' : 'password'"
                />
                <v-autocomplete
                  v-model="country"
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
            <v-btn
              color="primary"
              @click="step = 3"
              :disabled="!(isWifiPasswordCorrect && isWifiSsidCorrect && country != '')"
            >Continue</v-btn>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-progress-linear v-if="downloadingImage" v-model="imageDownloadState"></v-progress-linear>
          <v-progress-linear v-else indeterminate></v-progress-linear>

          <v-layout justify-center align-center class="pt-2">
            <span v-if="downloadingImage">Downloading image... ({{ imageDownloadState }} %)</span>
            <span v-if="extractingImage">Extracting image...</span>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-progress-linear v-if="writingImage" v-model="writingImageState.percentHuman"></v-progress-linear>
          <v-progress-linear v-if="checkingImage" v-model="checkingImageState.percentHuman"></v-progress-linear>
          <v-progress-linear v-if="!checkingImage && !writingImage" indeterminate></v-progress-linear>

          <v-layout justify-center align-center class="pt-2">
            <span v-if="writingImage">Writing image... ({{ writingImageState.percentHuman }} %)</span>
            <span v-if="checkingImage">Checking image... ({{ checkingImageState.percentHuman }} %)</span>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="5">
          <v-layout justify-center wrap align-center fill-height class="text-xs-center">
            <v-flex xs12 md4>
              <v-layout fill-height justify-center align-center>
                <v-icon color="success" style="font-size:3em">check_circle</v-icon>
              </v-layout>
            </v-flex>
            <v-flex xs12 md8>
              <v-layout fill-height justify-center align-center column class="py-3">
                <div class="display-2">Success!</div>
                <div
                  class="headline"
                >Your card has been successfuly flashed, you can now use it with your retrobox console!</div>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-layout>
</template>

<script>
const electron = require("electron");
const Sudoer = require("electron-sudo").default;

const drivelist = require("drivelist");
const filesize = require("filesize");
const axios = require("axios");
const fs = require("fs");
const request = require("request");
const path = require("path");
const os = require("os");
const progress = require("request-progress");
const decompress = require("decompress");
const decompressUnzip = require("decompress-unzip");

export default {
  name: "Installation",
  data: () => ({
    stopScan: false,
    step: 1,
    chosenDrive: 0,
    drives: [],
    wifiPassword: "",
    wifiSsid: "",
    country: "",
    loadingCountries: false,
    countries: [],
    imageDownloadState: "0.00",
    writingImage: false,
    writingImageState: {
      percentHuman: "0.00"
    },
    checkingImage: false,
    checkingImageState: {
      percentHuman: "0.00"
    },
    downloadingImage: false,
    extractingImage: false,
    unCompressing: false,
    imageSha256Hash:
      "9009409a9f969b117602d85d992d90563f181a904bc3812bdd880fc493185234",
    imagePath: "dist.zip",
    extractPath: "extracted_image",
    debug: "",
    rawDrivesLenght: -1,
    isWifiSsidCorrect: false,
    isWifiPasswordCorrect: false,
    isWifiPasswordVisible: false,
    tmpPath: '',
    extractedImagePath: '',
    extractedImageName: 'extracted_image.img'
  }),
  created() {
    if (process.env.TMP_PATH != undefined && process.env.TMP_PATH != null) {
      this.tmpPath =  process.env.TMP_PATH
      console.warn('Use a tmp path from environment variable')
    } else {
      this.tmpPath = electron.remote.app.getPath("appData") + "/retrobox-desktop";    
      //create directory if do not exist
      if (!fs.existsSync(this.tmpPath)) {
        console.log('tmp dir created')
        fs.mkdirSync(this.tmpPath)
      }
    }

    console.log('tmp path used:', this.tmpPath)

    this.imagePath = this.tmpPath + "/" + this.imagePath;
    this.extractPath = this.tmpPath + "/" + this.extractPath;

    console.log(this.imagePath);
    console.log(this.extractPath);

    // console.log('created')
    // console.log(remote.app.getPath('exe'))
    // console.log(remote.app.getAppPath())
    // this.debug = remote.app.getPath('exe')

    this.scanTick();
  },
  watch: {
    step: function(step) {
      if (step === 1) {
        this.stopScan = false;
        this.scanTick();
      } else {
        this.stopScan = true;
      }
      if (step === 2) {
        this.fetchCountries();
      }
      if (step === 3) {
        this.downloadImage();
      }
      if (step === 4) {
        this.writeImage();
      }
    },
    wifiSsid: function(value) {
      this.isWifiSsidCorrect = 3 <= value.length && value.length <= 255;
    },
    wifiPassword: function(value) {
      this.isWifiPasswordCorrect = 6 <= value.length && value.length <= 255;
    }
  },
  methods: {
    fetchCountries() {
      this.loadingCountries = true;
      this.$http
        .get(
          "https://raw.githubusercontent.com/lefuturiste/countries/master/en.json"
        )
        .then(response => {
          this.countries = response.data.countries.map(country => {
            return {
              value: country.code,
              text: country.name
            };
          });
          this.$http.get("https://ipapi.co/json/").then(response => {
            this.country = response.data.country;
            this.loadingCountries = false;
          });
        });
    },
    scanTick(standalone = false) {
      drivelist.list().then(drives => {
        if (this.rawDrivesLenght != drives.length) {
          console.log("drive changed");

          this.rawDrivesLenght = drives.length;

          this.drives = drives;

          this.drives = this.drives.filter(drive => {
            return drive.isRemovable;
          });

          this.drives = this.drives.map(device => {
            device.humanName = device.device;
            device.humanSize = filesize(device.size);
            let realName = device.description;
            if (device.description.indexOf("(") != -1) {
              realName = device.description.substring(
                0,
                device.description.indexOf("(")
              );
            }
            if (realName !== "") {
              device.humanName = device.humanName + " - " + realName;
            }
            device.humanName = device.humanName + " - " + device.humanSize;
            return device;
          });
        }

        if (standalone == false) {
          setTimeout(() => {
            if (this.stopScan == false) {
              this.scanTick();
            }
          }, 1000);
        }
      });
    },
    doDownload() {
      return new Promise((resolve, reject) => {
        // if the image exist, look the hash
        if (fs.existsSync(this.imagePath)) {
          // verify the hash
          console.log("verify the hash");
          const crypto = require("crypto");
          let shasum = crypto.createHash("sha256");
          let s = fs.ReadStream(this.imagePath);
          s.on("data", function(data) {
            shasum.update(data);
          });
          // making digest
          s.on("end", () => {
            const hash = shasum.digest("hex");
            console.log(hash)
            if (hash != this.imageSha256Hash) {
              // hash is diferent
              console.log("hash do not match");
              return resolve(true);
            } else {
              console.log("hash similar");
              return resolve(false);
            }
          });
        } else if (!fs.existsSync(this.extractPath)) {
          console.log("zip file or extract directory do not exist");
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    },
    downloadImage() {
      // verify if the image already exist in the directory

      let imageUrl = "https://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2019-06-24/2019-06-20-raspbian-buster-lite.zip";

      this.doDownload().then(download => {
        console.log("download: " + download);
        if (download) {
          console.log("do download");
          this.downloadingImage = true;
          console.log("downloading the zip...");
          let writeStream = fs.createWriteStream(path.resolve(this.imagePath));
          progress(request(imageUrl), {})
            .on("progress", state => {
              console.log(state)
              this.imageDownloadState = (state.percent * 100).toFixed(2);
            })
            .on("error", function(err) {
              console.log("error with the image download");
              console.log(err);
            })
            .on('end', function(err) {
              console.log('end of progress')
            })
            .pipe(writeStream);
          console.log('_processing')
          writeStream.on('close', () => {
             console.log('writing stream finish')
             console.log("finish of the image download");
             setTimeout(() => {
                console.log('reloop on download image...')
                this.downloadingImage = false;
                this.extractingImage = true;
                this.downloadImage();
             }, 1000)
          })
        } else {
          console.log("do not download");
          if (
            fs.existsSync(this.imagePath) &&
            !fs.existsSync(this.extractPath)
          ) {
            console.log("extract anyway");
            this.extractingImage = true;
            this.decompressImage();
          } else {
            this.step = 4;
          }
        }
      });
    },
    decompressImage() {
      let zipPath = path.resolve(this.imagePath)
      console.log("decompress zip of path:", zipPath);
      this.extractedImagePath = this.tmpPath + '/' + this.extractedImageName;
      console.log("Writing extracted image on:", this.extractedImagePath)

      const yauzl = require('yauzl')
      yauzl.open(
        path.resolve(this.imagePath), 
        {lazyEntries: true}, (err, zipfile) => {
          if (err) throw err;
          zipfile.readEntry();
          zipfile.on("entry", (entry) => {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) throw err;
              let writeStream = fs.createWriteStream(
                path.resolve(this.extractedImagePath)
              );
              readStream.on("end", function() {
                zipfile.readEntry();
              });
              readStream.pipe(writeStream);
              writeStream.on('close', () => {
                this.extractingImage = false;
                this.step = 4;
                console.log("Files decompressed");
              })
            });
          });
       });
    },
    trySmth() {
      this.step = 5;
      // const sudo = require('sudo-prompt');
      // var options = {
      //     name: 'Retrobox'
      // };

      // let cmd = '/mnt/data/workspace/retrobox/desktop_lab/build/linux-unpacked/desktop_lab'

      // // var sudoer = new Sudoer({name: 'electron sudo application'});
      // // let cp = sudoer.spawn(
      // //     'echo', ['$PARAM'], {env: {PARAM: 'VALUE'}}
      // //     );

      // cmd = cmd + ' write_image'
      // sudo.exec('sh /mnt/data/workspace/retrobox/desktop_lab/test.sh && echo "UNIQUE__SUCCESS"', options,
      //     (error, stdout, stderr) => {
      //         console.log('stdout: ' + stdout);
      //         console.log('stderr: ' + stderr)
      //         this.debug = stdout
      //         this.debug = this.debug + " <br> " + stderr
      //     }
      // );
    },
    writeImage() {
      console.log("now extracting image...");
      console.log("using image path:", this.extractedImagePath)
      // const sudo = require('sudo-prompt');
      // var options = {
      //     name: 'Retrobox'
      // };
      // sudo.exec('node ' + process.cwd() + '/test.js', options,
      //     function (error, stdout, stderr) {
      //         if (error) throw error;

      //         console.log('stdout: ' + stdout);
      //         console.log('stderr: ' + stderr)
      //     }
      // );
      this.writingImage = false;
      this.checkingImage = true;
      this.checkingImageState.percentHuman = 100;
      const imageWrite = require("etcher-image-write");

      console.log('Using device:', this.chosenDrive.device);
      console.log('With size', this.chosenDrive.size);

      let emitter = imageWrite.write(
        {
          fd: fs.openSync(this.chosenDrive.device, "rs+"),
          device: this.chosenDrive.device,
          size: this.chosenDrive.size
        },
        {
          stream: fs.createReadStream(this.extractedImagePath),
          size: fs.statSync(this.extractedImagePath).size
        },
        {
          check: true
        }
      );

      emitter.on("progress", state => {
        console.log(state);
        if (state.type == "write") {
          this.writingImage = true;
          this.writingImageState.percentHuman = state.percentage.toFixed(2);
        }
        if (state.type == "check") {
          this.writingImage = false;
          this.checkingImage = true;
          this.checkingImageState.percentHuman = state.percentage.toFixed(2);
        }
      });

      emitter.on("error", error => {
        console.log("error occured");
        console.error(error);
      });

      emitter.on("done", results => {
        console.log("Success!");
        this.onImageWrote();
      });
    },
    onImageWrote() {
      this.checkingImage = false;
      console.log("onImageWrote: writing file on the device");
      drivelist.list().then(drives => {
        console.log(this.chosenDrive.device);
        let device = drives.filter(
          d => this.chosenDrive.device === d.device
        )[0];
        console.log(device);
        console.log(device.mountpoints);
        let bootMountPoint = device.mountpoints.filter(
          m => m.label === "boot"
        );
        if (bootMountPoint.length === 0) {
          // use first boot mount point if no mount point found with the label filter
          bootMountPoint = device.mountpoints[0]
        } else {
          bootMountPoint = bootMountPoint[0]
        }
        let bootRootPath = bootMountPoint.path;
        console.log('using boot root path:' + bootRootPath);
        /*
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=«your_ISO-3166-1_two-letter_country_code»

network={
    ssid="«your_SSID»"
    psk="«your_PSK»"
    key_mgmt=WPA-PSK
}
                    */

        let lines =
          "ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev \n";
        lines += "update_config=1\n";
        lines += "country=" + this.country + "\n";
        lines += "\n";
        lines += "network={\n";
        lines += '  ssid="' + this.wifiSsid + '"\n';
        lines += '  psk="' + this.wifiPassword + '"\n';
        lines += '  key_mgmt="' + "WPA-PSK" + '"\n';
        lines += "}\n";

        console.log(lines);

        // write the wifi file on the device
        fs.writeFile(bootRootPath + "/wpa_supplicant.conf", lines, err => {
          if (err) {
            return console.log(err);
          }

          console.log("The wifi file was saved!");

          this.step = this.step + 1;
        });
      });
    }
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