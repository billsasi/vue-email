<script setup>
import Login from './components/Login.vue';
import Inbox from './components/Inbox.vue';
import { onMounted, ref } from 'vue';

const error = ref(false);
const loggedIn = ref(false);
const loading = ref(true);
const loadingMore = ref(false);
const messagesData = ref([]);
const endOfInbox = ref(false);

async function handleLogin({ username, password }) {
  loading.value = true;
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: username, password }),
  });
  loading.value = false;
  if (res.status !== 200) {
    console.log('error');
    loggedIn.value = false;
    error.value = true;
    return;
  }
  error.value = false;
  loggedIn.value = true;
  messagesData.value = await res.json();
}

async function getMessages() {
  loading.value = true;
  const res = await fetch('/api/pull', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  loading.value = false;
  if (res.status !== 200) {
    return;
  }
  messagesData.value = await res.json();
  loggedIn.value = true;

  console.log(messagesData);
}

function handleLogout() {
  fetch('/api/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  messagesData.value = [];
  loggedIn.value = false;
  loading.value = false;
}

async function fetchMore() {
  loadingMore.value = true;
  const res = await fetch('/api/more', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      seqno: messagesData.value[messagesData.value.length - 1].seqno,
    }),
  });
  loadingMore.value = false;
  if (res.status != 200) {
    return;
  }
  const fetchedMessages = await res.json();
  if (fetchedMessages.length === 0) {
    endOfInbox.value = true;
    return;
  }
  messagesData.value = [...fetchedMessages, ...messagesData.value];
}

onMounted(() => {
  getMessages();
});
</script>

<template>
  <div id="app">
    <div class="header">Vue Email</div>
    <Login v-if="!loading && !loggedIn" @login="handleLogin" :error="error" />
    <Inbox
      v-else-if="!loading && loggedIn"
      :messagesData="messagesData"
      :loadingMore="loadingMore"
      :endOfInbox="endOfInbox"
      @refresh="getMessages"
      @logout="handleLogout"
      @fetchMore="fetchMore"
    />
    <h2 class="loading" v-if="loading">Loading</h2>
  </div>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  background-color: #e0e0e0;
  margin: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  width: 100%;
  height: 5rem;
  padding-left: 6em;
  border-bottom: 1px solid #ccc;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  justify-content: left;
  align-items: center;
}
</style>
