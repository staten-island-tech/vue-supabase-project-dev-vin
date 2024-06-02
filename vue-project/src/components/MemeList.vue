<template>
    <div>
      <h2>Latest Memes</h2>
      <div v-if="memes.length === 0">No memes found.</div>
      <div v-else>
        <div v-for="meme in memes" :key="meme.id" class="meme">
          <h3>{{ meme.title }}</h3>
          <p>{{ meme.description }}</p>
          <img :src="meme.file_url" alt="Meme" />
          <p>Posted at: {{ meme.created_at }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { supabase } from '../supabase'
  
  export default {
    setup() {
      const memes = ref([])
  
      const fetchMemes = async () => {
        const { data, error } = await supabase
          .from('memes')
          .select('*')
          .order('created_at', { ascending: false })
  
        if (error) {
          console.error('Error fetching memes:', error)
        } else {
          memes.value = data
        }
      }
  
      onMounted(fetchMemes)
  
      return { memes }
    }
  }
  </script>
  
  <style scoped>
  .meme {
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 16px;
  }
  .meme img {
    max-width: 100%;
    height: auto;
  }
  </style>