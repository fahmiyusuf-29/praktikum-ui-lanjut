<template>
  <div class="search-bar">
    <div class="input-group">
      <span class="icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M16 16L21 21"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <input type="text" placeholder="Cari event favoritmu..." v-model="query" @input="onInput" />
      <button type="button" @click="onSearch">Cari</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')

function onInput() {
  console.log('input:', query.value)
}

function onSearch() {
  console.log('search:', query.value)
}
</script>

<style scoped>
.search-bar {
  width: 100%;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f7f7;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 12px;
  height: 52px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  width: 20px;
  height: 20px;
}

.icon svg {
  width: 18px;
  height: 18px;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.98rem;
  color: #111827;
}

input::placeholder {
  color: #9ca3af;
}

button {
  border: none;
  background: #2563eb;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
