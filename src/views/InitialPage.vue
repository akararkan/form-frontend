<template>
  <div class="main-page">
    <div class="header">
      <h1>Welcome to the Survey App</h1>
    </div>
    <div class="button-container">
      <router-link v-if="isCardActive" to="/id-card">
        <button class="btn">Fill Out ID Card</button>
      </router-link>
      <router-link to="/login">
        <button class="btn">Participate as Admin</button>
      </router-link>
      <router-link to="/user">
        <button class="btn">Participate as Normal User</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCardStore } from '../store';

const cardStore = useCardStore();
const isCardActive = computed(() => cardStore.isCardActive);
</script>



<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  height: 100%;
  font-family: 'Arial', sans-serif;
}

.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2980b9, #6dd5fa, #ffffff);
  color: #fff;
  text-align: center;
}

.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 15px 30px;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  background-color: #2980b9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #1a5a7a;
}

.router-link-active {
  text-decoration: none;
}
</style>
