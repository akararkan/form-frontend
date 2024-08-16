<template>
  <button class="back-btn" @click="goBack">Go Back</button>

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
        <div
          v-for="(question, index) in currentQuestions"
          :key="question.id"
          class="question"
        >
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
          <div v-if="question.type === 'YES_NO'" class="radio-group">
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
          <div v-if="question.type === 'MULTIPLE_CHOICE'" class="radio-group">
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
        <button
          v-if="currentPage > 1"
          @click="prevPage"
          type="button"
          class="prev-btn"
        >
          Previous
        </button>
        <button
          v-if="!isLastPage"
          @click="nextPage"
          type="button"
          class="next-btn"
        >
          Next
        </button>
        <button v-if="isLastPage" type="submit" class="submit-btn">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter()

const questions = ref([]);
const currentPage = ref(1);
const questionsPerPage = 5;
const userInfo = ref({
  name: "",
  phone: "",
  email: "",
});
const answers = ref({});

onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/questions/getAllQuestion"
    );
    questions.value = response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
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
    alert("Please fill in all user information fields.");
  }
}
const goBack = () => {
  router.back();
};

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
    await axios.post("http://localhost:8080/responses/submit", formData);
    alert("Form submitted successfully!");
    router.push("/"); // Navigate to the home page
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Failed to submit the form.");
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
  font-family: "Roboto", sans-serif;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 0 auto;
  margin-top: 90px;
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
}

.user-info-section,
.question {
  width: 100%;
  margin-bottom: 20px;
}

.user-info label,
.question label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #444;
}

.user-info input,
.question input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 16px;
  box-sizing: border-box;
}

.radio-group {
  display: flex;
  flex-direction: column;
}

.radio-group label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.navigation-buttons {
  margin-top: 30px;
  text-align: center;
}

.navigation-buttons button {
  margin-right: 10px;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-size: 16px;
  font-weight: 500;
}

.prev-btn {
  background-color: #f44336;
  color: #fff;
}

.prev-btn:hover {
  background-color: #c62828;
}

.next-btn {
  background-color: #1e88e5;
  color: #fff;
}

.next-btn:hover {
  background-color: #1565c0;
}

.submit-btn {
  background-color: #4caf50;
  color: #fff;
}

.submit-btn:hover {
  background-color: #388e3c;
}

.submit-btn:disabled {
  background-color: #bbb;
  cursor: not-allowed;
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
