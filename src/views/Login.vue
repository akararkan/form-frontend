<!-- views/Login.vue -->
<template>
  <button class="back-btn" @click="goBack">Go Back</button>

  <div class="login-container">
    <h1>Login</h1>
    <p v-if="timeoutMessage" class="timeout-message">{{ timeoutMessage }}</p>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
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
    const response = await axios.post(
      "http://localhost:8080/api/v1/user/login",
      {
        email: email.value,
        password: password.value,
      }
    );

    if (response.data.token) {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "true"); // Assume all users are admins as per your request

      // Redirect to admin dashboard
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

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}

.login-container input {
  margin: 10px 0;
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.login-container button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2980b9;
  color: white;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #1a5a7a;
}

.timeout-message {
  color: red;
  margin-bottom: 15px;
}
.back-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #f44336; /* Red color for the back button */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  background-color: #e53935;
}
</style>
