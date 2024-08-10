<template>
    <div class="user-panel">
      <h1>Application Form</h1>
      <form @submit.prevent="handleSubmit">
        <div v-if="currentPage === 1" class="user-info-section">
          <!-- User Information Section -->
          <div class="user-info">
            <label for="name">Name</label>
            <input
              id="name"
              v-model="userInfo.name"
              type="text"
              placeholder="Enter your name"
              required
            />
  
            <label for="phone">Phone</label>
            <input
              id="phone"
              v-model="userInfo.phone"
              type="text"
              placeholder="Enter your phone number"
              required
            />
  
            <label for="email">Email</label>
            <input
              id="email"
              v-model="userInfo.email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
  
        <div v-else>
          <!-- Questions Section -->
          <div v-for="(question, index) in currentQuestions" :key="question.id" class="question">
            <label :for="'question-' + question.id">{{ question.text }}</label>
  
            <!-- Text Type Question -->
            <div v-if="question.type === 'TEXT'">
              <input
                :id="'question-' + question.id"
                v-model="answers[question.id]"
                type="text"
                :placeholder="question.placeholder || 'Type your answer here'"
              />
            </div>
  
            <!-- Yes/No Type Question -->
            <div v-if="question.type === 'YES_NO'">
              <label>
                <input
                  type="radio"
                  :name="'question-' + question.id"
                  v-model="answers[question.id]"
                  value="yes"
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  :name="'question-' + question.id"
                  v-model="answers[question.id]"
                  value="no"
                />
                No
              </label>
            </div>
  
            <!-- Multiple Choice Type Question -->
            <div v-if="question.type === 'MULTIPLE_CHOICE'">
              <div v-for="(option, idx) in question.options" :key="idx">
                <label>
                  <input
                    type="radio"
                    :name="'question-' + question.id"
                    v-model="answers[question.id]"
                    :value="option"
                  />
                  {{ option }}
                </label>
              </div>
            </div>
          </div>
        </div>
  
        <div class="navigation-buttons">
          <button v-if="currentPage > 1" @click="prevPage" type="button">Previous</button>
          <button v-if="!isLastPage" @click="nextPage" type="button">Next</button>
          <button v-if="isLastPage" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  
  const questions = ref([]);
  const currentPage = ref(1);
  const questionsPerPage = 5;
  const userInfo = ref({
    name: '',
    phone: '',
    email: '',
  });
  const answers = ref({});
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8080/questions/getAllQuestion');
      questions.value = response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  });
  
  const userInfoFilled = computed(() => {
    return userInfo.value.name && userInfo.value.phone && userInfo.value.email;
  });
  
  const currentQuestions = computed(() => {
    const start = (currentPage.value - 2) * questionsPerPage;
    return questions.value.slice(start, start + questionsPerPage);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(questions.value.length / questionsPerPage) + 1; // +1 for user info page
  });
  
  const isLastPage = computed(() => currentPage.value === totalPages.value);
  
  function nextPage() {
    if (currentPage.value === 1 && userInfoFilled.value) {
      currentPage.value++;
    } else if (currentPage.value < totalPages.value) {
      currentPage.value++;
    } else if (currentPage.value === 1) {
      alert('Please fill in all user information fields.');
    }
  }
  
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }
  
  async function handleSubmit() {
    const formData = {
      ...userInfo.value,
      answers: answers.value,
    };
  
    try {
      await axios.post('http://localhost:8080/responses/submit', formData);
      alert('Form submitted successfully!');
      router.push('/'); // Navigate to the home page
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  }
  </script>
  
  <style>
  .user-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .user-info-section,
  .question {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .user-info label,
  .question label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
  }
  
  .user-info input,
  .question input[type="text"] {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  
  .navigation-buttons {
    margin-top: 20px;
    text-align: center;
  }
  
  .navigation-buttons button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .navigation-buttons button:hover {
    background-color: #0c47a1;
  }
  
  .navigation-buttons button:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
  </style>