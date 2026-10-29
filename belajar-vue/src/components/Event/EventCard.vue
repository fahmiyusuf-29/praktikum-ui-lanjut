<template>
  <AppCard class="event-card-wrapper">
    <div class="event-body">
      <div class="event-meta">
        <div class="meta-left">
          <span class="event-date">{{ formatDate(event.date) }}</span>
          <span v-if="isRegistered" class="badge-registered">Registered</span>
        </div>
        <span class="event-category">{{ event.category }}</span>
      </div>

      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-loc">📍 {{ event.location }}</p>
      <p class="event-desc">{{ event.desc || event.description }}</p>

      <div class="card-footer">
        <button class="btn-link" @click="$emit('view-detail', event.id)">View Details</button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/UI/AppCard.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view-detail'])

const formatDate = (date) => {
  if (!date) return ''

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.event-card-wrapper {
  display: flex;
  flex-direction: column;
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
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.meta-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.event-date {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-registered {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1px solid #a7f3d0;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-title {
  font-size: 1.15rem;
  color: var(--text-main);
  margin: var(--space-3) 0 var(--space-2);
  line-height: 1.4;
}

.event-loc {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.event-desc {
  color: var(--text-muted);
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: var(--space-6);
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
}

.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  padding: 0;
}

.btn-link:hover {
  color: var(--primary);
}
</style>
