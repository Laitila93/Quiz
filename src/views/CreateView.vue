<template>
  <div>
    Poll link: 
    <input type="text" v-model="pollId">

    <button v-on:click="createPoll">
      Create poll
    </button>
 <!--
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer' + i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>

  -->
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">

    Min:
    <input type="text" v-model="min">
    Max:
    <input type="text" v-model="max">
    Operator:
    <input type="text" v-model="operator">

    <button v-on:click="startPoll">
      Start poll
    </button>
    <!--
    <button v-on:click="runQuestion">
      Run question
    </button>
    -->
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    Data: {{ pollData }}
  </div>
  <div>
    {{ operator }}
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      min:"",
      max:"", 
      operator: "",
      pollData: {},
      uiLabels: {},
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },
    startPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
      socket.emit("startPoll", {pollId:this.pollId, min:this.min,max:this.max, operator:this.operator})
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    }
  }
}
</script>
