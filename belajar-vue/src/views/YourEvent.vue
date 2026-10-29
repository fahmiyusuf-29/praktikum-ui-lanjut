<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppCard from '@/components/UI/AppCard.vue'
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/Appmodal.vue'

const router = useRouter()
const { events, getRegistrationsByEventId, cancelRegistration } = useEvent()

const userRegistrations = computed(() =>
  events.value
    .flatMap((event) => getRegistrationsByEventId(event.id))
    .sort((first, second) => new Date(second.date) - new Date(first.date)),
)

const isCancelModalOpen = ref(false)
const registrationToCancel = ref(null)
const cancelError = ref('')

const isEventDone = (eventId) => {
  const event = events.value.find((item) => String(item.id) === String(eventId))
  return event ? event.done || ['completed', 'done'].includes(event.status) : false
}

const formatDate = (date) => {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

  return parsedDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const handleOpenCancelModal = (registration) => {
  registrationToCancel.value = registration
  cancelError.value = ''
  isCancelModalOpen.value = true
}

const handleCloseCancelModal = () => {
  isCancelModalOpen.value = false
  registrationToCancel.value = null
}

const handleConfirmCancel = () => {
  if (!registrationToCancel.value) {
    handleCloseCancelModal()
    return
  }

  if (!cancelRegistration(registrationToCancel.value.id)) {
    cancelError.value = 'Registration could not be canceled. Please refresh and try again.'
    handleCloseCancelModal()
    return
  }

  handleCloseCancelModal()
}

const handleViewTicket = (registration) => {
  router.push(`/browse/events/${registration.eventId}/ticket`)
}
</script>

<template>
  <div class="your-events-container">
    <header class="page-header">
      <h2 class="page-title">Your Events</h2>
      <p class="page-desc">
        Manage your confirmed event registrations and view official digital passes.
      </p>
    </header>

    <div v-if="cancelError" class="cancel-error" role="alert">
      {{ cancelError }}
    </div>

    <div v-if="userRegistrations.length === 0" class="empty-state">
      <div class="empty-icon">🎟️</div>
      <h3>No Registrations Yet</h3>
      <p>
        You have not signed up for any active events. Explore our catalog to find workshops,
        meetups, and conferences that match your interests.
      </p>
      <AppButton variant="primary" @click="router.push('/browse/events')">
        Explore Events Catalog
      </AppButton>
    </div>

    <div v-else class="tickets-grid">
      <AppCard
        v-for="registration in userRegistrations"
        :key="registration.id"
        class="ticket-summary-card"
      >
        <div class="ticket-card-top">
          <div class="ticket-left">
            <span class="category-tag">{{ registration.ticket || 'Event Ticket' }}</span>
            <span
              class="lifecycle-tag"
              :class="isEventDone(registration.eventId) ? 'tag-completed' : 'tag-upcoming'"
            >
              {{ isEventDone(registration.eventId) ? 'CONCLUDED' : 'UPCOMING' }}
            </span>
          </div>
        </div>

        <h3 class="booking-title">{{ registration.eventTitle }}</h3>

        <div class="card-meta">
          <div class="meta-row">
            <span>📅</span>
            <span>{{ formatDate(registration.eventDate) }}</span>
          </div>
          <div class="meta-row">
            <span>📍</span>
            <span>{{ registration.venue || 'Location unavailable' }}</span>
          </div>
          <div class="meta-row">
            <strong>Booking Code</strong>
            <span>{{ registration.bookingCode }}</span>
          </div>
        </div>

        <div class="card-bottom">
          <button type="button" class="btn-view-ticket" @click="handleViewTicket(registration)">
            View Ticket
          </button>
          <button
            v-if="!isEventDone(registration.eventId)"
            type="button"
            class="btn-subtle-cancel"
            @click="handleOpenCancelModal(registration)"
          >
            Cancel
          </button>
        </div>
      </AppCard>
    </div>

    <AppModal
      :is-open="isCancelModalOpen"
      title="Cancel Registration?"
      :message="`Are you sure you want to cancel your registration for ${registrationToCancel?.eventTitle}? This action cannot be undone.`"
      confirm-text="Yes, Cancel Registration"
      cancel-text="Keep Registration"
      variant="danger"
      badge-text="Confirm Cancellation"
      badge-variant="warning"
      @confirm="handleConfirmCancel"
      @close="handleCloseCancelModal"
    />
  </div>
</template>

<style scoped>
.your-events-container {
  padding-bottom: var(--space-12);
}

.page-header {
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.page-desc {
  color: var(--text-muted);
  font-size: 1rem;
}

.cancel-error {
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border: 1px solid #f5c2c7;
  border-radius: 8px;
  background: #f8d7da;
  color: #842029;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-4);
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
  background: white;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
}

.empty-state h3 {
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.empty-state p {
  max-width: 600px;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--space-2);
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.ticket-summary-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  border-color: var(--border-color);
  box-shadow: none;
}

.ticket-summary-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.ticket-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.ticket-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.category-tag {
  background: #ede9fe;
  color: #6b46c1;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
}

.lifecycle-tag {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
}

.tag-upcoming {
  background: #dbeafe;
  color: #1d4ed8;
}

.tag-completed {
  background: #f1f5f9;
  color: #64748b;
}

.booking-title {
  font-size: 1.3rem;
  color: var(--text-main);
  margin: var(--space-2) 0 var(--space-3);
  line-height: 1.3;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.9rem;
  color: var(--text-muted);
}

.meta-row strong {
  color: var(--text-main);
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-view-ticket,
.btn-subtle-cancel {
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}

.btn-view-ticket {
  color: var(--primary);
}

.btn-view-ticket:hover,
.btn-subtle-cancel:hover {
  text-decoration: underline;
}

.btn-subtle-cancel {
  color: #94a3b8;
  font-size: 0.85rem;
}

.btn-subtle-cancel:hover {
  color: #ef4444;
}

@media (max-width: 480px) {
  .tickets-grid {
    grid-template-columns: 1fr;
  }
}
</style>