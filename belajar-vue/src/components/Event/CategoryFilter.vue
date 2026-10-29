<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'All',
  },
  categories: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="category-filter">
    <button
      v-for="category in categories"
      :key="category"
      :class="['filter-btn', { active: modelValue === category }]"
      @click="$emit('update:modelValue', category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.filter-btn {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
</style>
