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
import { ref } from 'vue'
import { supabase } from '../supabase'

const title = ref('')
const description = ref('')
const file = ref(null)

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

const submitMeme = async () => {
  try {
    if (!file.value) throw new Error('No file selected. Select a image/gif')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('memes')
      .upload(`public/${file.value.name}`, file.value)
    if (uploadError) throw uploadError
    const fileUrl = `${supabase.storageUrl}/object/public/memes/${file.value.name}`
    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .insert([{ title: title.value, description: description.value, file_url: fileUrl }])

    if (memeError) throw memeError

    console.log('Meme posted:', memeData)
    title.value = ''
    description.value = ''
    file.value = null
  } catch (error) {
    console.error('Error posting meme:', error)

  }
}
</script>

<style scoped>

</style>
