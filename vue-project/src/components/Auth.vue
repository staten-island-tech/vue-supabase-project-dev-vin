<template>
  <div class="auth-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <input v-model="email" type="email" placeholder="Email" required class="auth-input" />
      <input v-model="password" type="password" placeholder="Password" required class="auth-input" />
      <button type="submit" class="auth-button">{{ isSignIn ? 'Sign In' : 'Sign Up' }}</button>
      <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
    </form>
    <p>
      <button @click="toggleAuthMode" class="auth-toggle">
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

      return true;
    }
  } catch (error) {
    console.error("Unhandled error during sign-up:", error);
    errorMessage.value = "An unexpected error occurred. Please try again later.";
    return false;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5; /* Light gray background */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.auth-input {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff; /* White background */
}

.auth-button {
  padding: 10px;
  font-size: 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-button:hover {
  background: #0056b3;
}

.auth-error {
  color: red;
  margin-top: 10px;
}

.auth-toggle {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.auth-toggle:hover {
  text-decoration: underline;
}
</style>
