<template>
  <div id="app" class="container">
    <Navbar />
    <b-alert
      variant="danger" 
      dismissible 
      fade 
      :show="dismissCountDown" 
      @dismissed="dismissCountDown=0" 
      @dismiss-count-down="countDownChanged"
    >
      {{ alertMsg }}
    </b-alert>

    <b-alert
      variant="warning"
      dismissible
      fade
      :show="dismissCountDown2"
      @dismissed="dismissCountDown2=0"
      @dismiss-count-down="countDownChanged2"
    >
      <p>{{ warningAlertMsg }} {{ showTimer ? this.dismissCountDown2 + ' seconds...' : '' }} </p>
      <b-progress v-if="showTimer" variant="warning" :max="dismissSecs2" :value="dismissCountDown2" height="4px" />
    </b-alert>

    <div id="view">        
        <p id="title">{{ this.$route.name }}</p>
        <router-view @showAlert = "showAlert" @showWarningAlert = "showWarningAlert" />
    </div>
  </div>
</template>

<script>
import Navbar from './components/layouts/Navbar.vue'

export default {
  name: 'app',
  components: {
    Navbar
  },
  data() {
    return {
      alertMsg: '',
      warningMsg: '',
      dismissSecs: 5,      
      dismissSecs2: 0,
      dismissCountDown: 0,
      dismissCountDown2: 0,
      showTimer: false,
    }
  },
  methods: {
    showAlert(msg) {
        this.alertMsg = msg;
        this.dismissCountDown = this.dismissSecs;
    },
    showWarningAlert(msg, secs, showTimer) {
        this.warningAlertMsg = msg;
        this.dismissSecs2 = secs;
        this.dismissCountDown2 = secs;
        this.showTimer = showTimer;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    countDownChanged2(dismissCountDown) {
      this.dismissCountDown2 = dismissCountDown
    },
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

#logo {
  height: 150px;
  width: 150px;
}

#view {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    margin-top: 30px;
    margin-right: 30px;
    padding-top: 30px;
    height: 700px;
    background-color: #7FFFD4;  
    text-align: center;
    overflow-x: hidden;
    overflow-y: overlay;

    #title {
      font-size: 45px;
    }
}

.center {
    margin: auto;
    width: 50%;
}
</style>
