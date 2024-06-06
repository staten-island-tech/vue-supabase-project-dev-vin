<template>
  <div>
    <h2>Post a Meme</h2>
    <form @submit.prevent="submitMeme">
      <input type="text" v-model="title" placeholder="Title" required />
      <textarea v-model="description" placeholder="Description" required></textarea>
      <input type="text" v-model="fileUrl" placeholder="Image/GIF URL" required />
      <button type="submit">Post</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';

const title = ref('');
const description = ref('');
const fileUrl = ref('');

const submitMeme = async () => {
  try {
    // Check if the user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('User not logged in. Please log in to post a meme.');
    }

    if (!fileUrl.value) throw new Error('No URL provided. Please provide an image/GIF URL.');

    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .insert([{
        title: title.value,
        description: description.value,
        file_url: fileUrl.value,
        created_at: new Date(),
        user_id: session.user.id  // Ensure the user_id is added to the row
      }]);

    if (memeError) throw memeError;

    console.log('Meme posted:', memeData);
    title.value = '';
    description.value = '';
    fileUrl.value = '';
  } catch (error) {
    console.error('Error posting meme:', error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
