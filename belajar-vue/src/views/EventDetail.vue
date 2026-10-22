<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppButton from '@/components/UI/AppButton.vue'
import AppCard from '@/components/UI/AppCard.vue'

const route = useRoute()
const router = useRouter()
const { events } = useEvent()

const event = computed(() =>
  events.value.find((item) => String(item.id) === String(route.params.id)),
)
</script>

<template>
  <div class="event-detail-page">
    <template v-if="event">
      <AppButton variant="outline" class="btn-back" @click="router.push('/browse/events')">
        ← Back to Events
      </AppButton>

      <AppCard class="detail-header">
        <div class="header-content">
          <span class="event-tag">{{ event.category }}</span>
          <div class="event-heading">
            <h1>{{ event.title }}</h1>
            <span
              class="status-tag"
              :class="event.status === 'completed' ? 'status-ended' : 'status-live'"
            >
              {{ event.status === 'completed' ? 'Event Finished' : 'Live Registration' }}
            </span>
          </div>

          <div class="event-id">Event ID: #{{ event.id }}</div>

          <div class="meta-info">
            <span class="meta-item">📅 {{ event.date }}</span>
            <span class="meta-item">📍 {{ event.location }}</span>
            <span class="meta-item">👥 Quota: {{ event.quota }} Attendees</span>
          </div>
        </div>
      </AppCard>

      <div class="detail-content grid-asymmetric">
        <AppCard class="main-desc">
          <h2>About This Event</h2>
          <p>{{ event.description || 'More information about this event will be announced soon.' }}</p>
        </AppCard>

        <div class="sidebar">
          <AppCard class="ticket-card sticky-pane">
            <h3>Attendee Registration</h3>
            <p class="price">{{ event.price || 'Free' }}</p>
            <p class="ticket-desc">Secure your seat now before the quota is full.</p>
            <AppButton
              class="btn-register"
              variant="primary"
              :disabled="event.status === 'completed'"
            >
              {{ event.status === 'completed' ? 'Registration Closed' : 'Register Now' }}
            </AppButton>
            <p v-if="event.status === 'completed'" class="spots">This event has ended.</p>
            <p v-else class="spots">
              {{ event.quota }} seats available
            </p>
          </AppCard>
        </div>
      </div>
    </template>

    <div v-else class="not-found-card">
      <h2>Event Not Found</h2>
      <p>The event you are looking for is unavailable or has been removed by the organizer.</p>
      <AppButton variant="primary" @click="router.push('/browse/events')">
        Back to Event Catalog
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.event-detail-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  display: inline-flex;
  margin-bottom: var(--space-6);
}

.detail-header {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
}

.header-content {
  max-width: 900px;
}

.event-tag {
  display: inline-block;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--space-2);
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: var(--space-4);
}

.event-heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.header-content h1 {
  color: var(--text-main);
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
  line-height: 1.2;
}

.status-tag {
  border-radius: 50px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-live {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.status-ended {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.event-id {
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-weight: 500;
}

.detail-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.grid-asymmetric {
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc {
  min-width: 0;
  padding: var(--space-8);
}

.main-desc h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: var(--space-4);
  color: var(--text-main);
  font-size: 1.8rem;
}

.main-desc h2::before {
  display: block;
  width: 4px;
  height: 30px;
  border-radius: 2px;
  background: var(--primary);
  content: '';
}

.main-desc p {
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
  white-space: pre-line;
}

.sidebar {
  min-width: 0;
}

.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card {
  padding: var(--space-6);
  text-align: center;
}

.ticket-card h3 {
  margin-bottom: 1rem;
  color: var(--text-main);
  font-size: 1.5rem;
}

.price {
  margin-bottom: 0.5rem;
  color: var(--primary);
  font-size: 2.8rem;
  font-weight: 800;
}

.ticket-desc {
  margin-bottom: var(--space-8);
  color: var(--text-muted);
}

.btn-register {
  display: flex;
  width: 100%;
  padding: var(--space-4);
  font-size: 1.1rem;
}

.spots {
  margin-top: var(--space-4);
  color: #e63946;
  font-size: 0.95rem;
  font-weight: 600;
}

.not-found-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-12) var(--space-4);
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
  text-align: center;
}

.not-found-card h2 {
  color: var(--text-main);
}

.not-found-card p {
  margin-bottom: var(--space-2);
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .detail-content,
  .grid-asymmetric {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .sticky-pane {
    position: static;
  }

  .header-content h1 {
    font-size: 2.2rem;
  }
}
</style>
