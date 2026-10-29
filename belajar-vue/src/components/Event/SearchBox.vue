<template>
  <div class="search-bar">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search events by title, description..."
      class="search-input"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-bar {
  position: relative;
  max-width: 500px;
  margin-bottom: var(--space-4);
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.1);
}
</style>
