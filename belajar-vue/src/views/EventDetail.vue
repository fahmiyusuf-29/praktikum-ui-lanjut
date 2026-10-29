<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppButton from '@/components/UI/AppButton.vue'
import AppCard from '@/components/UI/AppCard.vue'
import RegistrationReceipt from '@/components/Event/RegistrationReceipt.vue'

const route = useRoute()
const router = useRouter()
const { events, hasRegistration, getRegistrationsByEventId } = useEvent()

const event = computed(() =>
  events.value.find((item) => String(item.id) === String(route.params.id)),
)
const showReceipt = ref(false)
const confirmation = ref(null)

const isEventDone = computed(
  () => event.value?.done || ['completed', 'done'].includes(event.value?.status),
)
const isRegistered = computed(() =>
  event.value ? hasRegistration(event.value.id) : false,
)
const existingRegistration = computed(() =>
  event.value ? getRegistrationsByEventId(event.value.id)[0] : null,
)
const displayedConfirmation = computed(() => confirmation.value || existingRegistration.value)
const isSoldOut = computed(() => Number(event.value?.quota) <= 0)

</script>

<template>
  <div class="event-detail-page">
    <template v-if="event">
      <button type="button" class="btn-back" @click="router.push('/browse/events')">
        ← Back to Events
      </button>

      <AppCard class="detail-header">
        <div class="header-content">
          <div class="header-tags">
            <span class="event-tag">{{ event.category }}</span>
            <span v-if="isEventDone" class="status-tag status-ended">Event Finished</span>
            <span v-else-if="isRegistered" class="status-tag status-registered">
              Registered
            </span>
            <span v-else class="status-tag status-live">Live Registration</span>
          </div>

          <h1>{{ event.title }}</h1>

          <div class="meta-info">
            <span class="meta-item"><strong>Date:</strong> {{ event.date }}</span>
            <span class="meta-item"><strong>Location:</strong> {{ event.location }}</span>
            <span class="meta-item">
              <strong>Quota:</strong> {{ event.quota }} Attendees
            </span>
          </div>
        </div>
      </AppCard>

      <div class="detail-content grid-asymmetric">
        <div class="main-column">
          <AppCard class="main-desc">
            <h2>About This Event</h2>
            <p>
              {{ event.desc || event.description || 'More information about this event will be announced soon.' }}
            </p>
          </AppCard>

          <RegistrationReceipt
            v-if="showReceipt && displayedConfirmation"
            :confirmation="displayedConfirmation"
            :event="event"
          />

        </div>

        <div class="sidebar">
          <AppCard class="ticket-card sticky-pane">
            <h3>Attendee Registration</h3>
            <p class="price">{{ event.price || 'Free' }}</p>
            <p class="ticket-desc">Secure your seat now before the quota is full.</p>

            <AppButton
              v-if="isEventDone"
              variant="secondary"
              class="btn-register btn-disabled"
              disabled
            >
              Registration Closed
            </AppButton>

            <div v-else-if="isRegistered" class="registered-action-group">
              <AppButton
                variant="secondary"
                class="btn-register btn-disabled"
                disabled
              >
                Already Registered
              </AppButton>
              <button
                type="button"
                class="view-receipt-link"
                @click="showReceipt = !showReceipt"
              >
                {{ showReceipt ? 'Hide Ticket Receipt' : 'View Ticket Receipt' }}
              </button>
            </div>

            <AppButton
              v-else-if="isSoldOut"
              variant="secondary"
              class="btn-register btn-disabled"
              disabled
            >
              Sold Out
            </AppButton>

            <AppButton
              v-else
              variant="primary"
              class="btn-register"
              @click="router.push(`/browse/events/${event.id}/register`)"
            >
              Register Now
            </AppButton>

            <p v-if="isEventDone" class="spots">This event has concluded.</p>
            <p v-else-if="isRegistered" class="spots registered-note">
              You are registered for this event. Your booking is confirmed.
            </p>
            <p v-else-if="isSoldOut" class="spots">No seats remaining.</p>
            <p v-else class="spots">{{ event.quota }} seats available</p>
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
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  padding: 0;
  border: none;
  background: none;
  color: var(--text-main);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  margin-bottom: var(--space-8);
  padding: var(--space-8);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  background: var(--bg-light);
}

.header-content {
  max-width: 900px;
}

.header-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.event-tag {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--space-2);
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-tag {
  padding: var(--space-1) var(--space-3);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-live {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.status-registered {
  background: #d1fae5;
  color: #065f46;
}

.status-ended {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.header-content h1 {
  margin-bottom: var(--space-4);
  color: var(--text-main);
  font-size: 2.5rem;
  line-height: 1.2;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.meta-item {
  color: var(--text-muted);
  font-weight: 500;
}

.meta-item strong {
  color: var(--text-main);
}

.detail-content,
.grid-asymmetric {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: var(--space-12);
}

.main-column,
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 0;
}

.main-desc {
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

.btn-disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.registered-action-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.view-receipt-link {
  border: none;
  background: none;
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.spots {
  margin-top: var(--space-4);
  color: #e63946;
  font-size: 0.95rem;
  font-weight: 600;
}

.registered-note {
  color: #27ae60;
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
