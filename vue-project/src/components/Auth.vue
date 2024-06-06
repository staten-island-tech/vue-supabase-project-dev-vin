<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">{{ isSignIn ? 'Sign In' : 'Sign Up' }}</button>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </form>
    <p>
      <a href="#" @click.prevent="toggleAuthMode">
        {{ isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
      </a>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabase"; 

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSignIn = ref(true);
const lastRequestTime = ref(0);
const rateLimitDuration = 60000; 

const toggleAuthMode = () => {
  isSignIn.value = !isSignIn.value;
  errorMessage.value = "";
  console.log("Toggled auth mode. isSignIn:", isSignIn.value);
};

const handleSubmit = async () => {
  const currentTime = Date.now();
  if (currentTime - lastRequestTime.value < rateLimitDuration) {
    errorMessage.value = "Please wait before trying again.";
    return;
  }

  lastRequestTime.value = currentTime;

  if (isSignIn.value) {
    await signIn();
  } else {
    await signUp();
  }
};

const signIn = async () => {
  try {
    console.log("Attempting to sign in...");
    const { user, error } = await supabase.auth.signIn({
      email: email.value,
      password: password.value,
    });
    if (error) {
      console.error("Error signing in:", error.message);
      errorMessage.value = "Invalid email or password. Please try again.";
    } else {
      errorMessage.value = "";
      console.log("Sign in successful:", user);
    }
  } catch (error) {
    console.error("Unhandled error during sign-in:", error);
    errorMessage.value = "An unexpected error occurred. Please try again later.";
  }
};

const signUp = async () => {
  try {
    console.log("Attempting to sign up...");
    const { user, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      console.error("Error signing up:", error.message);
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "";
      console.log("Sign up successful:", user);
    }
  } catch (error) {
    console.error("Unhandled error during sign-up:", error);
    errorMessage.value = "An unexpected error occurred. Please try again later.";
  }
};
</script>

<style scoped></style>
