<template>
  <div>
    <h2>Welcome, {{ session.user.email }}</h2>
    <button @click="signOut">Sign Out</button>
  </div>
</template>

<script setup>
import { supabase } from "../supabase";
import { defineProps } from "vue";

const props = defineProps({
  session: Object,
});

const signOut = async () => {
  await supabase.auth.signOut();
};
</script>