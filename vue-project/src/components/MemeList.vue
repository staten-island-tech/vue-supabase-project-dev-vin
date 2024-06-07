<template>
  <div class="meme-list-container">
    <h2>Latest Memes</h2>
    <div v-if="memes.length === 0">No memes found.</div>
    <div v-else class="meme-grid">
      <div v-for="meme in memes" :key="meme.id" class="meme">
        <h3>{{ meme.title }}</h3>
        <p>{{ meme.description }}</p>
        <img :src="meme.file_url" alt="Meme" class="meme-image" />
        <p>Posted by: {{ getUserEmail(meme.user_id) }} at: {{ formatDate(meme.created_at) }}</p>
        <button @click="editMeme(meme.id)" class="meme-button">{{ editingMemeId === meme.id ? 'Cancel' : 'Edit' }}</button>
        <button @click="deleteMeme(meme.id)" class="meme-button">Delete</button>
        <MemePostForm
          v-if="editingMemeId === meme.id"
          :meme="meme"
          :isEditMode="true"
          @memeUpdated="handleMemeUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import MemePostForm from './MemePostForm.vue';

export default {
  components: {
    MemePostForm
  },
  setup() {
    const memes = ref([]);
    const users = ref({});
    const editingMemeId = ref(null);

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

        const userIds = [...new Set(data.map(meme => meme.user_id))];
        for (const userId of userIds) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .single();

          if (userData) {
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
        memes.value = memes.value.filter(meme => meme.id !== memeId);
      } catch (error) {
        console.error('Error deleting meme:', error.message || error);
      }
    };

    const editMeme = (memeId) => {
      editingMemeId.value = editingMemeId.value === memeId ? null : memeId;
    };

    const handleMemeUpdated = () => {
      editingMemeId.value = null;
      fetchMemes();
    };

    onMounted(fetchMemes);

    return { memes, getUserEmail, formatDate, deleteMeme, editMeme, editingMemeId, handleMemeUpdated };
  }
};
</script>

<style scoped>
.meme-list-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.meme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
}

.meme {
  background: #fff; 
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.meme h3 {
  margin: 0;
  font-size: 18px;
}

.meme p {
  margin: 10px 0;
  font-size: 14px;
}

.meme-image {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

.meme-button {
  margin: 5px;
  padding: 10px;
  font-size: 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.meme-button:hover {
  background: #0056b3;
}
</style>
