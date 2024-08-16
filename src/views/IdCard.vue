
<template>
      <button class="back-btn" @click="goBack">Go Back</button>

  <div class="form-container">
    <h1 class="form-title">ID Card Form</h1>
    <form @submit.prevent="submitForm" class="id-form">
      <div class="form-group">
        <label for="fullname">Name</label>
        <input type="text" id="fullname" v-model="form.fullname" required placeholder="Enter your name" />
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" id="city" v-model="form.city" required placeholder="Enter your city" />
      </div>
      <div class="form-group">
        <label for="age">Age</label>
        <input type="number" id="age" v-model.number="form.age" required placeholder="Enter your age" />
      </div>
      <div class="form-group">
        <label for="department">Department</label>
        <input type="text" id="department" v-model="form.department" required placeholder="Enter your department" />
      </div>
      <button type="submit" class="submit-btn">Submit</button>
    </form>

    <!-- Popup Modal -->
    <div v-if="showModal" class="modal-overlay">
      <button class="close-btn" @click="closeModal">&times;</button>
      <div class="modal-content" ref="idCard">
        <div class="id-card">
          <div class="id-card-header">
            <img src="../assets/logo.png" alt="Logo" class="logo" />
            <h2 class="card-title">ID Card</h2>
          </div>
          <div class="id-card-body">
            <div class="id-card-left">
              <p><strong>Name:</strong> {{ form.fullname }}</p>
              <p><strong>City:</strong> {{ form.city }}</p>
              <p><strong>Age:</strong> {{ form.age }}</p>
              <p><strong>Department:</strong> {{ form.department }}</p>
            </div>
            <div class="id-card-right">
              <div class="qrcode-container">
                <img :src="qrCodeUrl" alt="QR Code" class="qrcode-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Buttons placed below the ID card -->
      <div class="download-buttons">
        <button @click="downloadAsImage" class="download-btn">
          Download as Image
        </button>
        <button @click="downloadAsPDF" class="download-btn">
          Download as PDF
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { reactive, ref, nextTick } from "vue";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  fullname: "",
  city: "",
  age: null,
  department: "",
});

const showModal = ref(false);
const idCard = ref(null);
const qrCodeUrl = ref("");

const submitForm = async () => {
  try {
    const response = await axios.post("http://localhost:8080/id-card/save", {
      fullname: form.fullname,
      city: form.city,
      age: form.age,
      department: form.department,
    });
    console.log("Form submitted successfully:", response.data);
    alert("ID Card updated successfully!");
    alert("We will send your ID response soon. Please check your email.");
    generateQRCode();
    showModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Failed to update ID Card.");
  }
};

const generateQRCode = async () => {
  await nextTick();
  const data = JSON.stringify(form);
  try {
    qrCodeUrl.value = await QRCode.toDataURL(data, {
      width: 200,
      margin: 1,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};

const closeModal = () => {
  showModal.value = false;
};

const downloadAsImage = async () => {
  if (!idCard.value) return;
  const canvas = await html2canvas(idCard.value);
  const imgData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imgData;
  link.download = "id-card.png";
  link.click();
  router.push("/");
};

const downloadAsPDF = async () => {
  if (!idCard.value) return;
  const canvas = await html2canvas(idCard.value);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    pdf.addPage();
    pdf.addImage(
      imgData,
      "PNG",
      0,
      heightLeft - imgHeight,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
  }

  pdf.save("id-card.pdf");
  router.push("/");
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative; /* To position the back button */
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

.form-title {
  text-align: center;
  margin-top: 50px; /* Adjusted to make space for the back button */
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.id-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.submit-btn:hover {
  background-color: #45a049;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.id-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.id-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.logo {
  width: 120px;
  height: auto;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
}

.id-card-body {
  display: flex;
  justify-content: space-between;
}

.id-card-left,
.id-card-right {
  width: 48%;
}

.qrcode-container {
  display: flex;
  justify-content: center;
}

.qrcode-img {
  width: 150px;
  height: 150px;
}

.download-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.download-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
}

.download-btn:hover {
  background-color: #45a049;
}
</style>

