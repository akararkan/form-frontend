<template>
  <button class="back-btn" @click="goBack">Go Back</button>
  <div class="responses-container">
    <h1>All Responses</h1>
    <!-- Search Bar -->
    <input
      v-model="searchQuery"
      @input="filterResponses"
      type="text"
      placeholder="Search responses..."
      class="search-bar"
    />
    <div v-if="filteredResponses.length" class="response-table-container">
      <table class="response-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Answers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="response in filteredResponses" :key="response.id">
            <td>{{ response.name }}</td>
            <td>{{ response.email }}</td>
            <td>{{ response.phone }}</td>
            <td>
              <ul>
                <li
                  v-for="(answer, questionId) in response.answers"
                  :key="questionId"
                >
                  <strong>Question {{ questionId }}:</strong> {{ answer }}
                </li>
              </ul>
            </td>
            <td class="actions-cell">
              <button
                @click="confirmDeleteResponse(response.id)"
                class="btn-action btn-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No responses available.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const responses = ref([]);
const searchQuery = ref("");
const filteredResponses = ref([]);

const fetchResponses = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/responses/allResponses"
    );
    responses.value = response.data;
    filteredResponses.value = responses.value; // Initialize filtered responses
  } catch (error) {
    console.error("Error fetching responses:", error);
  }
};

const filterResponses = () => {
  filteredResponses.value = responses.value.filter(
    (response) =>
      response.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      response.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      response.phone.includes(searchQuery.value) ||
      Object.values(response.answers).some((answer) =>
        answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  );
};

const confirmDeleteResponse = (id) => {
  if (window.confirm("Are you sure you want to delete this response?")) {
    deleteResponse(id);
  }
};

const deleteResponse = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/responses/deleteResponse/${id}`);
    responses.value = responses.value.filter((response) => response.id !== id);
    filterResponses(); // Update filtered responses after deletion
  } catch (error) {
    console.error("Error deleting response:", error);
  }
};

const goBack = () => {
  router.back();
};

onMounted(fetchResponses);
</script>

<style>
body {
  background-color: #e9ecf0;
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
}

.responses-container {
  max-width: 900px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 30px;
}

.search-bar {
  width: 100%;
  padding: 12px;
  margin-bottom: 25px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.3s;
}

.search-bar:focus {
  border-color: #2980b9;
  outline: none;
}

.response-table-container {
  overflow-x: auto;
}

.response-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
  border-radius: 8px;
  overflow: hidden;
}

.response-table th,
.response-table td {
  border: 1px solid #ecf0f1;
  padding: 15px;
  text-align: left;
}

.response-table th {
  background-color: #34495e;
  color: #ecf0f1;
  font-weight: 600;
}

.response-table tbody tr:nth-child(even) {
  background-color: #f2f4f6;
}

.response-table tbody tr:hover {
  background-color: #e1e8ed;
}

.actions-cell {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  align-items: center;
}

.btn-action {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-action:hover {
  transform: translateY(-2px);
}

.btn-edit {
  background-color: #28a745;
  color: #ffffff;
}

.btn-edit:hover {
  background-color: #218838;
}

.btn-delete {
  background-color: #dc3545;
  color: #ffffff;
}

.btn-delete:hover {
  background-color: #c82333;
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
