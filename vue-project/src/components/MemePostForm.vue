<template>
  <div>
    <h2>Post a Meme</h2>
    <form @submit.prevent="submitMeme">
      <input type="text" v-model="title" placeholder="Title" required />
      <textarea v-model="description" placeholder="Description" required></textarea>
      <input type="file" @change="handleFileChange" required />
      <button type="submit">Post</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';

const title = ref('');
const description = ref('');
const file = ref(null);

const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

const submitMeme = async () => {
  try {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not logged in. Please log in to post a meme.');
    }

    if (!file.value) throw new Error('No file selected. Select an image/gif.');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('memes')
      .upload(`public/${file.value.name}`, file.value);

    if (uploadError) throw uploadError;

    const { publicURL, error: publicUrlError } = supabase.storage
      .from('memes')
      .getPublicUrl(`public/${file.value.name}`);

    if (publicUrlError) throw publicUrlError;

    const fileUrl = publicURL;

    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .insert([{
        title: title.value,
        description: description.value,
        file_url: fileUrl,
        created_at: new Date(),
        user_id: session.user.id  // Ensure the user_id is added to the row
      }]);

    if (memeError) throw memeError;

    console.log('Meme posted:', memeData);
    title.value = '';
    description.value = '';
    file.value = null;
  } catch (error) {
    console.error('Error posting meme:', error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
