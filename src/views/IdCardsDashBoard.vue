<template>
  <div>
    <button type="button" class="back-btn" @click="goBack">Go Back</button>
   </div>
  <div class="dashboard">
    <h1>Id Cards Dashboard</h1>


    <!-- Table for displaying ID cards -->
    <table class="id-cards-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>City</th>
          <th>Age</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="card in idCards" :key="card.id">
          <td>{{ card.id }}</td>
          <td>{{ card.fullname }}</td>
          <td>{{ card.city }}</td>
          <td>{{ card.age }}</td>
          <td>{{ card.department }}</td>
          <td>
            <button class="delete-btn" @click="confirmDelete(card.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

// State to hold ID cards data
const idCards = ref([]);

// Fetch all ID cards on component mount
const fetchIdCards = async () => {
  try {
    const response = await axios.get('http://localhost:8080/id-card/getAll');
    idCards.value = response.data;
  } catch (error) {
    console.error('Error fetching ID cards:', error);
  }
};

// Confirm before deleting an ID card
const confirmDelete = async (id) => {
  const confirmed = confirm('Are you sure you want to delete this ID card?');
  if (confirmed) {
    deleteCard(id);
  }
};

// Delete an ID card by ID
const deleteCard = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/id-card/delete/${id}`);
    // Refresh the ID cards after deletion
    fetchIdCards();
  } catch (error) {
    console.error('Error deleting ID card:', error);
  }
};

function goBack(){
  router.push("/")
}

onMounted(fetchIdCards);
</script>

<style>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.id-cards-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.id-cards-table th,
.id-cards-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.id-cards-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-transform: uppercase;
}

.id-cards-table tr:hover {
  background-color: #f5f5f5;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  margin-right: 5px;
}

.delete-btn:hover {
  background-color: #ff1a1a;
}

.send-response-btn {
  background-color: #4CAF50;
  color: white;
}

.send-response-btn:hover {
  background-color: #45a049;
}

.send-all-btn {
  display: block;
  margin: 20px auto;
  background-color: #008CBA;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
}

.send-all-btn:hover {
  background-color: #007aa3;
}
</style>
