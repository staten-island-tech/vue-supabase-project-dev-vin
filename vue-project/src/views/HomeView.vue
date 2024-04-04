<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { ref,  } from 'vue';
import {onBeforeMount} from 'vue';

const thing = ref('')
async function thingy () {
  try {
  let fetchthing = await fetch ("https://data.cityofnewyork.us/resource/pitm-atqc.json")
  let putasjson = await fetchthing.json();
  thing.value = putasjson;
  console.log(putasjson)
}  
catch (error) {
  console.log ("error", error)
}}
onBeforeMount(() =>{
    thingy();
})

</script>


<template>
  <main>
    <TheWelcome />
  </main>
</template>l
