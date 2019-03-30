<template>
  <div id="app">
    <v-app dark>
      <Steps />
    </v-app>
  </div>
</template>

<script> 
  import Steps from './components/Installation.vue'
  export default {
    name: 'desktop_lab',
    components: {
       Steps
    },
    data: () => ({
    }),
    created() {
      
    },
    methods: {
      trigger () {
        console.log(process.cwd())
        console.log(__dirname)
        console.log(__filename)
        console.log(process.env.SOURCE_ARGV)
        this.logs.push(process.cwd())
        this.logs.push(__filename)
        this.logs.push(__dirname)
        this.logs.push(process.env.SOURCE_ARGV)
        // this.test = "yep"
        // this.logs.push(process.cwd())
        // const sudo = require('sudo-prompt');
        // var options = {
        //   name: 'Retrobox'
        // };
        // sudo.exec(process.cwd(), options,
        //   function(error, stdout, stderr) {
        //     if (error) throw error;
            
        //     this.logs.push(stdout)
        //     this.logs.push(stderr)
        //     console.log('stdout: ' + stdout);
        //     console.log('stderr: ' + stderr)
        //   }
        // );
      }
    }
  }
</script>

<style>
</style>
