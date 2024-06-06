<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">{{ isSignIn ? 'Sign In' : 'Sign Up' }}</button>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </form>
    <p>
      <button @click="toggleAuthMode">
        {{ isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
      </button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSignIn = ref(true);
const lastRequestTime = ref(0);
const rateLimitDuration = 10000; // 10 seconds

const toggleAuthMode = () => {
  isSignIn.value = !isSignIn.value;
  errorMessage.value = "";
};

const handleSubmit = async () => {
  const currentTime = Date.now();
  console.log("Current Time:", currentTime, "Last Request Time:", lastRequestTime.value);
  
  if (currentTime - lastRequestTime.value < rateLimitDuration) {
    errorMessage.value = "Please wait before trying again.";
    return;
  }

  if (isSignIn.value) {
    const success = await signIn();
    if (success) lastRequestTime.value = currentTime;
  } else {
    const success = await signUp();
    if (success) lastRequestTime.value = currentTime;
  }
};

const signIn = async () => {
  try {
    console.log("Attempting to sign in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      console.error("Error signing in:", error.message);
      errorMessage.value = "Invalid email or password. Please try again.";
      return false;
    } else {
      errorMessage.value = "";
      console.log("Sign in successful:", data.user);
      // Redirect or handle successful sign-in
      return true;
    }
  } catch (error) {
    console.error("Unhandled error during sign-in:", error);
    errorMessage.value = "An unexpected error occurred. Please try again later.";
    return false;
  }
};

const signUp = async () => {
  try {
    console.log("Attempting to sign up...");
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      console.error("Error signing up:", error.message);
      errorMessage.value = error.message;
      return false;
    } else {
      errorMessage.value = "";
      console.log("Sign up successful:", data.user);
      // Redirect or handle successful sign-up
      return true;
    }
  } catch (error) {
    console.error("Unhandled error during sign-up:", error);
    errorMessage.value = "An unexpected error occurred. Please try again later.";
    return false;
  }
};
</script>

<style scoped></style>
