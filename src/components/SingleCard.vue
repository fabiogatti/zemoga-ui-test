<template>
<div>
  <div class="card-component-list" v-show="!isGrid">
    <div class="background">
      <div class="photo-div">
        <img :src="getImgUrl" :alt="card.name">
      </div>
    </div>
    <vote class="current-status" :isLike='card.likes >= card.dislikes ? true : false' disabled></vote>
    <div class="time-ago">
      <p v-show="!voted">{{ yearAgoText + card.category }}</p>
      <p v-show="voted">Thank you for your vote!</p>
    </div>
    <div class="card-content">
      <div class="top-name">
        <h1>{{ trimmedName }}</h1>
      </div>
      <div class="middle-desc flex-row">
        <div class="description">
          <p>{{ trimmedDesc }}</p>
        </div>
        <div class="buttons-div flex-row">
          <vote class="btn" :isLike='true' :isButton="true" :isActive="clickedUpvote" @clicked='clickedVote' v-show="!voted"></vote>
          <vote class="btn" :isLike='false' :isButton="true" :isActive="clickedDownvote" @clicked='clickedVote' v-show="!voted"></vote>
          <button class="btn btn-vote" @click="submitVote()" :class="[ clickedUpvote || clickedDownvote ? 'btn-active' : 'btn-inactive']">{{ voteBtnText }}</button>
        </div>
      </div>
      <div class="bottom-votes flex-row">
        <div class="up" :style="{ width : likesPercentage+'%' }"  :key="voted+totalPositiveVotes+'1'">
          <div class="flex-row">
            <img src="@/assets/img/thumbs-up.svg" alt="thumbs up"/>
            <h1 :key="voted+totalPositiveVotes">{{ likesPercentage }}%</h1>
          </div>
        </div>
        <div class="down justify-flex-end" :style="{ width : dislikesPercentage+'%' }" :key="voted+totalNegativeVotes+'1'">
          <div class="flex-row">
            <h1 :key="voted+totalNegativeVotes">{{ dislikesPercentage }}%</h1>
            <img src="@/assets/img/thumbs-down.svg" alt="thumbs down"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-component-grid" v-show="isGrid">
    <div class="photo-div-g">
      <img :src="getImgUrl" :alt="card.name">
    </div>
    <vote class="current-status-g" :isLike='card.likes >= card.dislikes ? true : false' disabled></vote>
    <div class="content-g flex-column">
      <div class="margin-grid">
        <h1>{{ trimmedName }}</h1>
      </div>
      <div class="margin-grid desc-g">
        <p>{{ trimmedDescGrid }}</p>
      </div>
      <div class="margin-grid-right time-ago-g">
        <p v-show="!voted">{{ yearAgoText + card.category }}</p>
        <p v-show="voted">Thank you for your vote!</p>
      </div>
      <div class="margin-grid-right buttons-div-g flex-row">
        <vote class="btn" :isLike='true' :isButton="true" :isActive="clickedUpvote" @clicked='clickedVote' v-show="!voted"></vote>
        <vote class="btn" :isLike='false' :isButton="true" :isActive="clickedDownvote" @clicked='clickedVote' v-show="!voted"></vote>
        <button class="btn btn-vote" @click="submitVote" :class="[ clickedUpvote || clickedDownvote ? 'btn-active-g' : 'btn-inactive']">{{ voteBtnText }}</button>
      </div>
      <div class="bottom-votes-g flex-row">
        <div class="up" :style="{ width : likesPercentage+'%' }"  :key="voted+totalPositiveVotes+'1'">
          <div class="flex-row">
            <img src="@/assets/img/thumbs-up.svg" alt="thumbs up"/>
            <p :key="voted+totalPositiveVotes">{{ likesPercentage }}%</p>
          </div>
        </div>
        <div class="down justify-flex-end" :style="{ width : dislikesPercentage+'%' }" :key="voted+totalNegativeVotes+'1'">
          <div class="flex-row">
            <p :key="voted+totalNegativeVotes">{{ dislikesPercentage }}%</p>
            <img src="@/assets/img/thumbs-down.svg" alt="thumbs down"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { CardClass } from '@/classes/CardClass';
import Vote from './VoteBox.vue';

export default {
  name: 'SingleCard',
  components: { Vote },
  props: {
    card: CardClass,
    isGrid: { type:Boolean , default:true }
  },
  data() {
    return {
      clickedUpvote: false,
      clickedDownvote: false,
      voted: false,
      storageNegatives: Number,
      storagePositives: Number,
      innerWidth: Number
    }
  },
  computed: {
    yearAgoText(){
      let lastDate = new Date(this.card.lastUpdated);
      if(isNaN(lastDate.getTime()))
        return 'in '
      let now = new Date();
      let diffTime = Math.abs(now - lastDate);
      let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if(diffDays==0){
        return 'less than a day ago in ';
      }
      else if(diffDays>365){
        var years = Math.floor(diffDays/365)
        if(years == 1)
          return '1 year ago in ';
        return years.toString() + ' years ago in ';
      }
      else if(diffDays>30){
        var months = Math.floor(diffDays/30)
        if(months == 1)
           return '1 month ago in ';
        return months.toString() + ' months ago in ';
      }
      else{
        if(diffDays == 1)
          return '1 day ago in ';
        return diffDays.toString() + ' days ago in ';
      }
    },
    totalPositiveVotes(){
      return this.card.likes + this.storagePositives;
    },
    totalNegativeVotes(){
      return this.card.dislikes + this.storageNegatives;
    },
    totalVotes(){
      return this.totalPositiveVotes + this.totalNegativeVotes;
    },
    likesPercentage(){
      return (Math.ceil(this.totalPositiveVotes/this.totalVotes*100*10))/10;
    },
    dislikesPercentage(){
      return (Math.floor(this.totalNegativeVotes/this.totalVotes*100*10))/10;
    },
    voteBtnText(){
      if(this.voted){
        return 'Vote Again';
      }
      else
        return 'Vote Now'
    },
    trimmedDesc(){
      if(this.card.description.length < 150)
        return this.card.description
      return this.card.description.substring(0,149) + '...'
    },
    trimmedDescGrid(){
      if(this.card.description.length < 100)
        return this.card.description
      return this.card.description.substring(0,99) + '...'
    },
    trimmedName(){
      if(this.card.name.length <= 25 || (this.innerWidth>500 && this.card.name.length < 40))
        return this.card.name;
      else if(this.innerWidth>500 && this.card.name.length > 40){
        let substr = this.card.name.substring(0,39)
        return substr.substring(0,substr.lastIndexOf(' ')) + '...'
      }
      else{
        let substr = this.card.name.substring(0,24)
        return substr.substring(0,substr.lastIndexOf(' ')) + '...'
      }
    },
    getImgUrl() {
      var images = require.context('../assets/img', false, /\.jpg$/);
      return images('./' + this.card.name + ".jpg");
    }
  },
  methods:{
    storageString(isLike){
      if(isLike)
        return this.card.name+'likes';
      else
        return this.card.name+'dislikes'
    },
    storageVote(isLike){
      var storedLikes = localStorage.getItem(this.storageString(isLike));
      return storedLikes ? parseInt(storedLikes) : 0;
    },
    clickedVote(isLike){
      if(isLike){
        this.clickedUpvote = !this.clickedUpvote;
        this.clickedDownvote = false;
      }
      else{
        this.clickedDownvote = !this.clickedDownvote;
        this.clickedUpvote = false;
      }
    },
    submitVote(){
      if(!this.voted){
        if(this.clickedUpvote){
          localStorage.setItem(this.storageString(true),this.storageVote(true) + 1);
          this.storagePositives += 1;
        }
        else if(this.clickedDownvote){
          localStorage.setItem(this.storageString(false),this.storageVote(false) + 1);
          this.storageNegatives +=1;
        }
        else
          return;
        this.voted = true;
      }
      else{
        this.clickedUpvote = false;
        this.clickedDownvote = false;
        this.voted = false;
      }
    },
    setWidthVariable(){
      this.innerWidth = window.innerWidth;
    }
  },
  mounted(){
    this.storageNegatives = this.storageVote(false);
    this.storagePositives = this.storageVote(true);
    window.addEventListener("resize", this.setWidthVariable);
    this.setWidthVariable();
  },
  unmounted() {
    window.removeEventListener("resize", this.setWidthVariable);
  },
}
</script>

<style scoped>

h1{
  margin: 0;
  margin-top: 10px;
  font-weight: 500;
}
*{
  z-index: 1;
  color: var(--color-white);
}
.card-component-list{
  position: relative;
  margin-bottom: 25px;
}
.background{
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, transparent 0%, var(--color-gradient-light-gray) 10% , var(--color-gradient-dark-gray) 55%, var(--color-gradient-light-gray));
}
.photo-div{
  width:20%;
  height: 100%;
}
.photo-div img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  mask-image: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));
}
.current-status{
  position: absolute;
  left: 0;
  top: 0;
}
.time-ago{
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 15px;
}
.up{
  background-color: rgba(var(--color-green-positive), .8);
}
.down{
  background-color: rgba(var(--color-yellow-negative), .8);
}
.card-content{
  display: flex;
  flex-direction: column;
}
.top-name{
  margin-left:20%;
}
.middle-desc{
  margin-left:20%;
}
.description{
  text-align: justify;
  padding-right: 50px;
}
.buttons-div{
  align-items: center;
  min-width: 250px;
  justify-content: flex-end;
  margin-right: 10px;
}
.btn{
  margin: 0 5px;
  cursor: pointer;
}
.btn-vote{
  width: max-content;
  transition: ease-in-out 0.2s all;
  border: 2px solid var(--color-white);
  color: var(--color-white);
  height: 48px;
  padding: 0 20px;
  font-size: 20px;
  font-weight: 300;
}
.btn-inactive{
  background-color: var(--color-dark-gray);
  cursor: default;
}
.btn-active{
  background-color: var(--color-darker-gray); 
}
.bottom-votes h1{
  margin: 10px 0;
  font-weight: normal;
  color: var(--color-white);
  font-size: 26px;
}
.bottom-votes img{
  scale: 1.4;
  padding: 0px 10px;
}
.flex-row{
  display: flex;
  flex-direction: row;
}
.flex-column{
  display: flex;
  flex-direction: column;
}
.justify-flex-end{
  display: flex;
  justify-content: flex-end;
}


/* GRID STYLE */
.card-component-grid{
  height: 340px;
  width: 350px;
  position: relative;
}
.photo-div-g{
  width: 100%;
  height: 100%;
  z-index: 0;
  position: absolute;
  background-color: rgba(1,1,1,1);
}
.photo-div-g img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  mask-image: linear-gradient(to bottom, rgba(1,1,1,1), rgba(0,0,0,0));
}
.current-status-g{
  position: absolute;
  top: calc(50% - 40px);
}
.content-g{
  height: 100%;
  justify-content: flex-end;
}
.desc-g{
  font-size: 14px;
  text-align: justify;
}
.desc-g p{
  margin-top: 7px;
  margin-bottom: 10px;
}
.content-g h1{
  font-size: 30px;
}
.margin-grid{
  margin: 0 40px;
}
.margin-grid-right{
  margin-right: 40px;
}
.time-ago-g{
  text-align: end;
  font-size: 13px;
}
.time-ago-g p{
  margin-top: 5px;
  margin-bottom: 5px;
}
.btn-active-g{
  background-color: var(--color-black);
}
.buttons-div-g{
  align-items: center;
  min-width: 250px;
  justify-content: flex-end;
  margin-right: -10px;
  scale: 0.75;
}
.bottom-votes-g{
  margin-top: 5px;
}
.bottom-votes-g p{
  margin: 5px 0;
  font-weight: normal;
  color: var(--color-white);
  font-size: 20px;
}
.bottom-votes-g img{
  scale: 1;
  padding: 0px 10px;
}


@media all and (max-width: 500px) {
  .card-component-grid{
    height: 300px;
    width: 310px;
    position: relative;
  }
}

@media all and (max-width: 768px) {
  .card-component-grid{
    margin-right: 10px;
  }
}
</style>