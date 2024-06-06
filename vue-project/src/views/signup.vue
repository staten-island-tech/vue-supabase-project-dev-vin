<!-- src/views/Signup.vue -->
<template>
    <div>
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
        
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
        
        <button type="submit">Sign Up</button>
        
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { supabase } from '../supabase'; // Ensure the correct path to supabase
  
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = '';
        // Optionally, redirect the user to another page after successful sign-up
      }
    } catch (error) {
      errorMessage.value = 'An unexpected error occurred. Please try again later.';
    }
  };
  </script>
  
  <style>
  /* Your styles go here */
  </style>
  