<script setup>
import AppCard from '@/components/UI/AppCard.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view-detail', 'complete', 'delete'])
</script>

<template>
  <AppCard :class="['organizer-event-card', { 'card-completed': isCompleted }]">
    <div class="card-content">
      <div class="card-header">
        <span class="category-badge">{{ event.category }}</span>
        <span :class="['status-badge', isCompleted ? 'status-completed' : 'status-active']">
          {{ isCompleted ? 'Completed' : event.status === 'draft' ? 'Draft' : 'Active' }}
        </span>
      </div>

      <h3 :class="['event-title', { 'text-strike': isCompleted }]">{{ event.title }}</h3>
      <p class="event-meta">📅 {{ event.date }} &nbsp; • &nbsp; 📍 {{ event.location }}</p>
      <p class="event-desc">{{ event.desc || event.description }}</p>

      <div v-if="isCompleted" class="completed-notice">
        ⚠️ This event has ended and is archived from the public catalog.
      </div>

      <div class="card-actions">
        <template v-if="!isCompleted">
          <button
            type="button"
            class="btn-action btn-detail"
            @click="$emit('view-detail', event.id)"
          >
            ◉ View Details
          </button>
          <button
            type="button"
            class="btn-action btn-complete"
            @click="$emit('complete', event)"
          >
            ✓ Complete Event
          </button>
          <button
            type="button"
            class="btn-action btn-delete"
            @click="$emit('delete', event)"
          >
            🗑 Delete
          </button>
        </template>

        <template v-else>
          <button
            type="button"
            class="btn-action btn-detail"
            @click="$emit('view-detail', event.id)"
          >
            ◉ View Details
          </button>
          <button
            type="button"
            class="btn-action btn-delete"
            @click="$emit('delete', event)"
          >
            🗑 Delete from Archive
          </button>
        </template>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.organizer-event-card {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.category-badge {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-active {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.status-completed {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.event-title {
  font-size: 1.3rem;
  margin-bottom: var(--space-2);
  color: var(--text-main);
}

.text-strike {
  text-decoration: line-through;
  color: #94a3b8;
}

.card-completed {
  opacity: 0.85;
  background-color: #f8fafc;
}

.event-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.event-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-6);
  flex-grow: 1;
}

.completed-notice {
  background: #f1f5f9;
  color: #64748b;
  padding: var(--space-2);
  border-radius: 6px;
  margin-bottom: var(--space-4);
  font-size: 0.85rem;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-action {
  flex: 1;
  min-width: max-content;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-detail:hover {
  background: var(--bg-light);
  color: var(--primary);
  border-color: var(--primary);
}

.btn-complete {
  color: #27ae60;
  border-color: #27ae60;
}

.btn-complete:hover {
  background: #27ae60;
  color: white;
}

.btn-delete {
  color: #e63946;
  border-color: #e63946;
}

.btn-delete:hover {
  background: #e63946;
  color: white;
}
</style>