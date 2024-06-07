<template>
  <div class="meme-post-form">
    <h2>{{ isEditMode ? 'Edit Meme' : 'Post a Meme (please refresh page after posting)' }}</h2>
    <form @submit.prevent="submitMeme">
      <input type="text" v-model="title" placeholder="Title" required class="form-input" />
      <textarea v-model="description" placeholder="Description" required class="form-input"></textarea>
      <input type="text" v-model="fileUrl" placeholder="Image/GIF URL" required class="form-input" />
      <button type="submit" class="form-button">{{ isEditMode ? 'Update' : 'Post' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { supabase } from '../supabase';

const props = defineProps({
  meme: Object,
  isEditMode: Boolean
});

const emit = defineEmits(['memePosted', 'memeUpdated']);

const title = ref(props.isEditMode ? props.meme.title : '');
const description = ref(props.isEditMode ? props.meme.description : '');
const fileUrl = ref(props.isEditMode ? props.meme.file_url : '');

watch(() => props.meme, (newMeme) => {
  if (props.isEditMode) {
    title.value = newMeme.title;
    description.value = newMeme.description;
    fileUrl.value = newMeme.file_url;
  }
});

const submitMeme = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('User not logged in. Please log in to post a meme.');
    }

    if (!fileUrl.value) throw new Error('No URL provided. Please provide an image/GIF URL.');

    if (props.isEditMode) {
      await updateMeme(session.user.id);
    } else {
      await createMeme(session.user.id);
    }
  } catch (error) {
    console.error('Error submitting meme:', error);
  }
};

const createMeme = async (userId) => {
  try {
    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .insert([{
        title: title.value,
        description: description.value,
        file_url: fileUrl.value,
        created_at: new Date(),
        user_id: userId
      }]);

    if (memeError) throw memeError;

    console.log('Meme posted:', memeData);
    title.value = '';
    description.value = '';
    fileUrl.value = '';
    emit('memePosted');
  } catch (error) {
    console.error('Error posting meme:', error);
  }
};

const updateMeme = async (userId) => {
  try {
    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .update({
        title: title.value,
        description: description.value,
        file_url: fileUrl.value,
        user_id: userId
      })
      .eq('id', props.meme.id);

    if (memeError) throw memeError;

    console.log('Meme updated:', memeData);
    emit('memeUpdated');
  } catch (error) {
    console.error('Error updating meme:', error);
  }
};
</script>

<style scoped>
.meme-post-form {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff; 
}

.form-button {
  padding: 10px;
  font-size: 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-button:hover {
  background: #0056b3;
}
</style>

