<template>
    <div class="main-page">
      <header>
        <h1>QR Code Validation Page</h1>
      </header>
      
      <section class="scanner-container">
        <h2>Scan QR Code with Camera</h2>
        <video ref="video" width="300" height="200"></video>
        <canvas ref="canvas" style="display: none;"></canvas>
        <div v-if="decodedContent" class="qr-result">
          <!-- <p>QR Code Content: {{ decodedContent }}</p> -->
          <p v-if="isValid !== null" :class="{ 'valid': isValid, 'invalid': !isValid }">
            QR Code is: {{ isValid ? 'Valid' : 'Invalid' }}
          </p>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { BrowserMultiFormatReader } from '@zxing/library';
  import axios from 'axios';
//   import { useCardStore } from '../store';
//   import { computed } from 'vue';
//   const cardStore = useCardStore();
//   const isCardActive = computed(() => cardStore.isCardActive);
  
  const video = ref(null);
  const canvas = ref(null);
  const decodedContent = ref('');
  const isValid = ref(null);
  const error = ref('');
  
  let codeReader;
  
  onMounted(() => {
    initializeScanner();
  });
  
  onUnmounted(() => {
    resetScanner();
  });
  
  const initializeScanner = async () => {
    try {
      codeReader = new BrowserMultiFormatReader();
      await codeReader.decodeFromVideoDevice(null, video.value, handleScan);
    } catch (err) {
      error.value = `Camera initialization failed: ${err.message}`;
      console.error('Camera initialization failed:', err);
    }
  };
  
  const resetScanner = () => {
    if (codeReader) {
      codeReader.reset();
    }
  };
  
  const handleScan = async (result, err) => {
    if (result) {
      decodedContent.value = result.getText();
      console.log('QR Code Content:', decodedContent.value);
      await validateQrCode(decodedContent.value);
    }
    if (err && !(err instanceof codeReader.NotFoundException)) {
      error.value = `Scanning error: ${err.message}`;
      console.error('Scanning error:', err);
    }
  };
  
  const validateQrCode = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/id-card/validate-qr-code', { data });
      isValid.value = response.data.isValid;
    } catch (err) {
      error.value = `Validation error: ${err.message}`;
      console.error('Error validating QR code:', err);
      isValid.value = false;
    }
  };
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