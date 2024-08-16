<template>
   <div class="id-card-btn">
    <button 
      :class="[isCardActive ? 'act-card active' : 'act-card inactive']" 
      @click="toggleCardActivation"
    >
      {{ isCardActive ? "Deactivate ID Card" : "Activate ID Card" }}
    </button>
  </div>

  <div class="admin-panel">
    <h1>Admin Panel</h1>
    <!-- "See All Responses" Button -->
    <div class="top-buttons">
      <button @click="viewAllResponses" class="btn-view-responses">
        See All Responses
      </button>
      <button @click="viewIdCardDashBoard" class="btn-view-responses">Id Cards</button>
      <button @click="logout" class="btn-view-responses">Log out</button>
    </div>

    <!-- Form to create a new question -->
    <form @submit.prevent="createQuestion" class="form">
      <div class="form-group">
        <label for="questionText">Question Text:</label>
        <input
          v-model="newQuestion.text"
          type="text"
          id="questionText"
          required
        />
      </div>
      <div class="form-group">
        <label for="questionType">Question Type:</label>
        <select v-model="newQuestion.type" id="questionType" required>
          <option value="TEXT">Text</option>
          <option value="YES_NO">Yes/No</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
        </select>
      </div>

      <!-- Section to add multiple choice options -->
      <div v-if="newQuestion.type === 'MULTIPLE_CHOICE'" class="form-group">
        <div
          v-for="(option, index) in newQuestion.options"
          :key="index"
          class="form-group-option"
        >
          <label :for="'option' + index">Option {{ index + 1 }}:</label>
          <input
            v-model="newQuestion.options[index]"
            :id="'option' + index"
            type="text"
            required
          />
          <button type="button" @click="removeOption(index)" class="btn-remove">
            Remove
          </button>
        </div>
        <button type="button" @click="addOption" class="btn-add">
          Add Option
        </button>
      </div>

      <button type="submit" class="btn-submit">Add Question</button>
    </form>

    <!-- Table to display the list of questions -->
    <table v-if="questions.length" class="table">
      <thead>
        <tr>
          <th>Question Text</th>
          <th>Type</th>
          <th>Options</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.text }}</td>
          <td>{{ question.type }}</td>
          <td v-if="question.type === 'MULTIPLE_CHOICE'">
            {{ question.options.join(", ") }}
          </td>
          <td v-else>N/A</td>
          <td class="actions-cell">
            <button @click="editQuestion(question)" class="btn-action btn-edit">
              Edit
            </button>
            <button
              @click="confirmDeleteQuestion(question.id)"
              class="btn-action btn-delete"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No questions available.</p>
  </div>
</template>

<script setup>
import { useCardStore } from "../store";
import { ref, onMounted, computed } from "vue";
import axios from "axios"; // Ensure axios is installed
import { useRouter } from "vue-router"; // Import useRouter
import { defineStore } from "pinia";

const router = useRouter();
// Reactive variables

const cardStore = useCardStore();

const toggleCardActivation = () => {
  if (cardStore.isCardActive) {
    cardStore.deactivateCard();
    
  } else {
    cardStore.activateCard();
  }
};

const isCardActive = computed(() => cardStore.isCardActive);

const newQuestion = ref({ text: "", type: "TEXT", options: [] });
const questions = ref([]);
const editingQuestion = ref(null);

// Function to create or update a question
const createQuestion = async () => {
  try {
    if (editingQuestion.value) {
      // Update question
      const response = await axios.put(
        `http://localhost:8080/questions/updateQuestion/${editingQuestion.value.id}`,
        newQuestion.value
      );
      const index = questions.value.findIndex(
        (q) => q.id === editingQuestion.value.id
      );
      questions.value[index] = response.data;
      editingQuestion.value = null;
    } else {
      // Create new question
      const response = await axios.post(
        "http://localhost:8080/questions/addQuestion",
        newQuestion.value
      );
      questions.value.push(response.data);
    }
    newQuestion.value = { text: "", type: "TEXT", options: [] }; // Clear the form
  } catch (error) {
    console.error("Error saving question:", error);
  }
};

// Function to edit a question
const editQuestion = (question) => {
  editingQuestion.value = question;
  newQuestion.value = { ...question };
};

// Function to confirm deletion of a question
const confirmDeleteQuestion = (id) => {
  if (window.confirm("Are you sure you want to delete this question?")) {
    deleteQuestion(id);
  }
};

// Function to delete a question
const deleteQuestion = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/questions/deleteQuestion/${id}`);
    questions.value = questions.value.filter((q) => q.id !== id);
  } catch (error) {
    console.error("Error deleting question:", error);
  }
};

// Function to add a new option
const addOption = () => {
  newQuestion.value.options.push("");
};

// Function to remove an option
const removeOption = (index) => {
  newQuestion.value.options.splice(index, 1);
};

// Function to fetch questions on component mount
const fetchQuestions = async () => {
  try {
    // Replace with your Spring Boot API URL
    const response = await axios.get(
      "http://localhost:8080/questions/getAllQuestion"
    );
    questions.value = response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};
const viewAllResponses = () => {
  // Navigate to responses page, assuming Vue Router is used
  router.push("/responses");
};

const logout = async () => {
  try {
    await axios.post("http://localhost:8080/api/v1/user/logout");
    localStorage.removeItem("token");
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const viewIdCardDashBoard = () =>{
  router.push("/idCard-dashboard")
}

// Fetch questions when the component is mounted
onMounted(fetchQuestions);
</script>

<style>
body {
  background-color: #f0f2f5;
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
}

.admin-panel {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 2.5em;
  color: #333;
}

.form {
  margin-bottom: 35px;
  padding: 25px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3498db;
  outline: none;
}

.form-group-option {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.form-group-option input {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 10px;
  transition: border-color 0.3s;
}

.form-group-option input:focus {
  border-color: #3498db;
  outline: none;
}

.form-group-option button {
  flex-shrink: 0;
  padding: 10px 15px;
  border: none;
  background-color: #e74c3c;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.form-group-option button:hover {
  background-color: #c0392b;
}

.btn-add,
.btn-submit {
  padding: 12px 25px;
  border: none;
  background-color: #3498db;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.btn-add:hover,
.btn-submit:hover {
  background-color: #2980b9;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 25px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: left;
  transition: background-color 0.3s;
}

.table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #333;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.actions-cell {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
}

.table td button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.btn-action {
  margin-right: 5px;
}

.btn-edit {
  background-color: #27ae60;
  color: #fff;
}

.btn-edit:hover {
  background-color: #219150;
}

.btn-delete {
  background-color: #e74c3c;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c0392b;
}
.top-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.btn-view-responses {
  padding: 12px 25px;
  margin-left: 10px;
  border: none;
  background-color: #3498db;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.btn-view-responses:hover {
  background-color: #2980b9;
}

.act-card {
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.act-card.active {
  background-color: #4caf50;
}

.act-card.inactive {
  background-color: #f44336;
}

.act-card:hover {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}

.act-card:active {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}

.id-card-btn {
  position: fixed;
  margin-left: 20px;
}
</style>
