<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: String,
  variant: {
    type: String,
    default: 'primary',
  },
})

defineEmits(['click'])
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    :to="to"
    :class="['app-button', `btn-${variant}`]"
    @click="$emit('click')"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.app-button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 8px 15px rgba(102, 68, 255, 0.25);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-gray);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-main);
  border: 1px solid var(--primary);
}

.btn-outline:hover {
  background-color: rgba(102, 68, 255, 0.05);
}
</style>
