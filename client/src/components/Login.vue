<script setup>
import { ref } from 'vue';

const props = defineProps(['error']);

const emit = defineEmits(['login']);

const username = ref('');
const password = ref('');

function onLogin() {
  const formData = {
    username: username.value,
    password: password.value,
  };
  emit('login', formData);
}
</script>

<template>
  <form class="login-form" @submit.prevent="onLogin">
    <input
      class="login-item"
      type="email"
      name="username"
      placeholder="Gmail Address"
      v-model="username"
    />
    <input
      class="login-item"
      type="password"
      name="password"
      placeholder="Gmail App Password"
      v-model="password"
    />
    <input id="submit-button" class="login-item" type="submit" value="Login" />
    <p style="color: red" v-if="error">
      Invalid username or password. Please create an app password for your
      account.
    </p>
  </form>
</template>

<style>
.login-form {
  display: flex;
  flex-direction: column;
  width: 20em;
  max-width: 1000px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.login-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

#submit-button {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #4caf50;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

#submit-button:hover {
  background-color: #3e8e41;
  color: #ffffff;
}
</style>
