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
              <div>
                Choose your device :
              </div>
              <v-radio-group v-model="deviceChoise" class="mt-0">
                <v-list>
                  <v-list-tile>
                    <v-radio
                      :label="`Hellow orld`"
                      value="1"
                    ></v-radio>
                  </v-list-tile>
                  <v-list-tile>
                    <v-radio
                      :label="`Hellow orld`"
                      value="2"
                    ></v-radio>
                  </v-list-tile>
                  <v-list-tile>
                    <v-radio
                      :label="`Hellow orld`"
                      value="3"
                    ></v-radio>
                  </v-list-tile>
                </v-list>
              </v-radio-group>
            </v-card-text>
          </v-card>

          <v-btn
            color="primary"
            @click="step = 2"
          >
            Continue
          </v-btn>

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="mb-2">
            Hello world
          </div>

          <v-btn
            color="primary"
            @click="step = 3"
          >
            Continue
          </v-btn>

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="mb-2">
            Hello world
          </div>

          <v-btn
            color="primary"
            @click="step = 1"
          >
            Continue
          </v-btn>

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    step: 1,
    deviceChoise: 0
  }),
  created () {
    this.$store.commit('SET_TITLE', 'Installation')
  }
}
</script>
