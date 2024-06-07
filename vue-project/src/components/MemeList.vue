<template>
  <div>
    <h2>Latest Memes</h2>
    <div v-if="memes.length === 0">No memes found.</div>
    <div v-else class="meme-grid">
      <div v-for="meme in memes" :key="meme.id" class="meme">
        <h3>{{ meme.title }}</h3>
        <p>{{ meme.description }}</p>
        <img :src="meme.file_url" alt="Meme" />
        <p>Posted by: {{ getUserEmail(meme.user_id) }} at: {{ formatDate(meme.created_at) }}</p>
        <button @click="deleteMeme(meme.id)">Delete</button>
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
    const users = ref({});

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

        // Fetch user data for each meme
        const userIds = [...new Set(data.map(meme => meme.user_id))];
        for (const userId of userIds) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .single();

          if (userData) {
            // Store the user's email in the users object using their user_id as the key
            users.value[userId] = userData.email;
          }
        }
      } catch (error) {
        console.error('Error fetching memes:', error.message || error);
      }
    };

    const getUserEmail = (userId) => {
      return users.value[userId] || 'Someone';
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const deleteMeme = async (memeId) => {
      try {
        const { data, error } = await supabase
          .from('memes')
          .delete()
          .eq('id', memeId)
          .single();

        if (error) {
          throw error;
        }
        
        // Remove the deleted meme from the memes array
        memes.value = memes.value.filter(meme => meme.id !== memeId);
      } catch (error) {
        console.error('Error deleting meme:', error.message || error);
      }
    };

    onMounted(fetchMemes);

    return { memes, getUserEmail, formatDate, deleteMeme };
  }
};
</script>
<style scoped>
.meme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
}

.meme img {
  max-width: 60%;
  height: auto;
}
</style>