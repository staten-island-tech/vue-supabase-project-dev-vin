<template>
  <div>
    <h2>Latest Memes</h2>
    <div v-if="memes.length === 0">No memes found.</div>
    <div v-else class="meme-grid">
      <div v-for="meme in memes" :key="meme.id" class="meme">
        <h3>{{ meme.title }}</h3>
        <p>{{ meme.description }}</p>
        <img :src="meme.file_url" alt="Meme" />
        <p>Posted at: {{ formatDate(meme.created_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

export default {
  setup() {
    const memes = ref([]);

    const fetchMemes = async () => {
      try {
        const { data, error } = await supabase
          .from('memes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        memes.value = data;
      } catch (error) {
        console.error('Error fetching memes:', error.message || error);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(fetchMemes);

    return { memes, formatDate };
  }
};
</script>

<style scoped>
.meme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 20px; /* Space between grid items */
}

.meme {
  border: 1px solid #ccc;
  padding: 16px;
  align-items: center; /* Center items horizontally */
  text-align: center;
}

.meme img {
  max-width: 100%;
  height: auto;
}
</style>
