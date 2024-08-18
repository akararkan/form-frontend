<template>
  <div class="main-page">
    <header>
      <h1>Welcome to the Survey App</h1>
    </header>
    
    <nav class="button-container">
      <router-link v-if="isCardActive" to="/id-card" custom v-slot="{ navigate }">
        <button @click="navigate" class="btn">Fill Out ID Card</button>
      </router-link>
      <router-link to="/login" custom v-slot="{ navigate }">
        <button @click="navigate" class="btn">Participate as Admin</button>
      </router-link>
      <router-link to="/user" custom v-slot="{ navigate }">
        <button @click="navigate" class="btn">Participate as Normal User</button>
      </router-link>
    </nav>

    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import { useCardStore } from '../store';
import { computed } from 'vue';
const cardStore = useCardStore();
const isCardActive = computed(() => cardStore.isCardActive);


</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #2980b9, #6dd5fa, #ffffff);
  color: #333;
  font-family: Arial, sans-serif;
}

header h1 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 2rem;
  margin-top: 220px;
}

.button-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #2980b9;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #1a5a7a;
}

.scanner-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.scanner-container h2 {
  margin-bottom: 1rem;
  color: #2980b9;
}

video {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.qr-result {
  margin-top: 1rem;
}

.qr-result p {
  margin-bottom: 0.5rem;
}

.valid {
  color: green;
}

.invalid {
  color: red;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>