<!-- views/Login.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Login as Admin</h1>
      <p v-if="timeoutMessage" class="timeout-message">{{ timeoutMessage }}</p>
      <form @submit.prevent="login" class="login-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Enter your password" required />
        </div>
        <div class="button-group">
          <button type="button" class="back-btn" @click="goBack">Go Back</button>
          <button type="submit" class="login-btn">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const timeoutMessage = ref("");

onMounted(() => {
  if (route.query.timeout) {
    timeoutMessage.value = "Session timed out, please log in again.";
  }
});

const login = async () => {
  try {
    const response = await axios.post("http://localhost:8080/api/v1/user/login", {
      email: email.value,
      password: password.value,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "true");
      router.push("/admin-dashboard");
    } else {
      alert("Login failed: No token returned.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login. Please try again.");
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #3498db, #8e44ad);
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-btn {
  background-color: #e74c3c;
  color: white;
}

.back-btn:hover {
  background-color: #c0392b;
}

.login-btn {
  background-color: #2ecc71;
  color: white;
}

.login-btn:hover {
  background-color: #27ae60;
}

.timeout-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
</style>