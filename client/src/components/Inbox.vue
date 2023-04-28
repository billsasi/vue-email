<script setup>
import { ref, defineProps, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps([
  'messagesData',
  'loadingMore',
  'showFetchMore',
  'endOfInbox',
]);

const emit = defineEmits(['logout', 'refresh', 'fetchMore']);

const username = ref('');
const password = ref('');
const scrollComponent = ref(null);

const formattedMessages = computed(() => {
  return props.messagesData
    .sort((a, b) => b.seqno - a.seqno)
    .map((message) => {
      const from = parseMessageFrom(message.from[0]);
      const date = parseDate(message.date[0]);
      return {
        ...message,
        fromName: from.name,
        fromEmail: from.email,
        subject:
          message.subject[0].substring(0, 60) +
          (message.subject[0].length > 60 ? '...' : ''),
        date,
      };
    });
});

function parseMessageFrom(from) {
  const fromRegex = /^(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/;
  const fromHeader = from.match(fromRegex);
  const name = fromHeader[1].substring(0, 25);
  const email =
    fromHeader[2].substring(0, 25) + (fromHeader[2].length > 25 ? '...' : '');
  return { name, email };
}

function parseDate(date) {
  const dateObj = new Date(date);
  const today = new Date();
  if (dateObj.getDate() === today.getDate()) {
    return dateObj.toLocaleTimeString();
  } else {
    return dateObj.toLocaleDateString();
  }
}
</script>

<template>
  <div class="inbox-container">
    <div class="inbox-header">
      <div class="inbox-header-left"><span style="font-size: 1rem;">Inbox</span></div>
      <div class="inbox-header-right">
        <button class="refresh-button" @click="emit('refresh')">Refresh</button>
        <button class="logout-button" @click="emit('logout')">Logout</button>
      </div>
    </div>
    <div class="messages-container" ref="scrollComponent">
      <div
        class="inbox-item"
        v-for="(message, idx) in formattedMessages"
        :key="message.seqno"
      >
        <div class="inbox-item-left">
          <span id="sender-name">{{ message.fromName }}</span>
          <span id="addr">{{ message.fromEmail }}</span>
        </div>

        <div class="inbox-item-mid">
          <span id="subj">{{ message.subject }}</span>
        </div>
        <div class="inbox-item-right">
          <span id="date">{{ message.date }}</span>
        </div>
      </div>
    </div>
    <span class="end" v-if="endOfInbox">End of inbox</span>
    <button v-else class="fetch-more-button" @click="emit('fetchMore')">
      Load more
    </button>
    <p v-if="loadingMore">Loading more...</p>
  </div>
</template>

<style>
.inbox-item {
  display: flex;
  height: 20px;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.inbox-item-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  width: 30%;
}

.inbox-item-mid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: 60%;
}

.inbox-item-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  width: 10%;
}

.inbox-container {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1000px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.inbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 0.5em;
}

button {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #4caf50;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-right: 0.5em;
}

.fetch-more-button {
  width: 100%;
}

button:hover {
  background-color: #3e8e41;
  color: #ffffff;
}

#sender-name {
  font-size: 0.8rem;
  font-weight: bold;
}

#subj {
  font-weight: bold;
  font-size: 1rem;
}

#addr {
  font-size: 0.8rem;
  color: #777;
}

.end {
  font-size: 0.8rem;
  color: #777;
  text-align: center;
}
</style>
