<template>
  <div class="wrapper">
    <header>
      <div v-bind:class="['hamburger', {'close': !hideNav}]" 
          v-on:click="toggleNav">
      </div>
      <div class="logo">
        <img src="/img/logo.png">
        Brain Battle
        <img src="../assets/logo.svg">
      </div>
    </header>
    <!--<h1>{{ uiLabels["sales-pitch"] }}</h1>
    <h2>{{ uiLabels.subHeading }}</h2>-->
    <label>
      Write poll id: 
      <input type="text" v-model="newPollId">
    </label>
    <router-link v-bind:to="'/lobby/' + newPollId">
      {{ uiLabels.participatePoll }}
    </router-link>
    <ResponsiveNav v-bind:hideNav="hideNav">
      <router-link to="/create/">
        {{ uiLabels.createPoll }}
      </router-link>
      <a href="">
        {{ uiLabels.about }}
      </a>
      <a href="">FAQ</a>
    </ResponsiveNav>
    <button v-on:click="switchLanguage">
        {{ uiLabels.changeLanguage }}
      </button>
  </div>
</template>

<script>
import testComponent from '../components/testComponent.vue';
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
import TestComponent from '../components/testComponent.vue';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav,
    testComponent
  },
  data: function () {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    }
  }
}
</script>
<style scoped>
  .wrapper{
    width:100%;
    height:100vh;
    background-color: #1e1e2f;
  }
  header {
    background-color:#1e1e2f;
    width: 100%;
    display: grid;
    grid-template-columns: 2em auto;
    padding-top: 0.2em;
  }
  .logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 2.5rem;
    color: #007bff;
    padding-top:0.2em;
  }
  .logo img {
    height:2.5rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
  .hamburger {
    color:white;
    width:1em;
    display: flex;
    align-items: center;
    justify-content: left;
    padding:0.5rem;
    top:0;
    left:0;
    height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
  }
  button {
    position: fixed;
    bottom: 10px;;
    right: 10px;
    border: none;
    border-radius: 5em;
    height: 5em;
    width: 5em;
    cursor: pointer;
  }

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger::before {
    content: "☰";
  }
  .close::before {
    content: "✕";
  }
  .hide {
    left:-12em;
  }
}
</style>
