<script setup>
import { onMounted, ref } from 'vue'
import Account from './components/Account.vue'
import Auth from './components/Auth.vue'
import MemePostForm from './components/MemePostForm.vue'
import MemeList from './components/MemeList.vue'
import { supabase } from './supabase'

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">

    <Account v-if="session" :session="session" />
    <Auth v-else />

    <div v-if="session">
      <MemePostForm />
    </div>
    <MemeList />
  </div>
</template>

<style>

</style>