<script setup>
import AppCard from '@/components/UI/AppCard.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})

defineEmits(['view-detail'])
</script>

<template>
  <div class="event-card-wrapper">
    <AppCard class="event-card">
      <div class="event-body">
        <div class="event-meta">
          <span class="event-date">{{ event.date }}</span>
          <span class="event-category">{{ event.category }}</span>
        </div>

        <h3 class="event-title">{{ event.title }}</h3>
        <p class="event-loc">📍 {{ event.location }}</p>
        <p class="event-desc">{{ event.description }}</p>

        <div class="card-footer">
          <button class="btn-link" @click="$emit('view-detail', event.id)">
            View Event Details
          </button>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<style scoped>
.event-card-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-card {
  height: 100%;
}

.event-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-6);
}

.event-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.event-date {
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-title {
  margin-bottom: var(--space-2);
  color: var(--text-main);
}

.event-loc {
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.event-desc {
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  line-height: 1.6;
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-link {
  padding: 0;
  border: none;
  background: none;
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-link:hover {
  color: var(--primary);
}
</style>
