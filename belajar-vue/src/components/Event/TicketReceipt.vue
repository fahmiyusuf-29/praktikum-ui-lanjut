<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppModal from '@/components/UI/Appmodal.vue'

const route = useRoute()
const router = useRouter()
const { events, getRegistrationsByEventId, cancelRegistration } = useEvent()

const eventId = computed(() => Number(route.params.id))

const activeTicket = computed(() => {
  const event = events.value.find((item) => Number(item.id) === eventId.value)
  if (!event) return null

  const registration = getRegistrationsByEventId(event.id)[0]
  return registration ? { ...registration, event } : null
})

const isEventDone = computed(() => {
  const event = activeTicket.value?.event
  return Boolean(event?.done || ['completed', 'done'].includes(event?.status))
})

const isCancelModalOpen = ref(false)

const handleConfirmCancel = () => {
  if (!activeTicket.value) return

  if (cancelRegistration(activeTicket.value.id)) {
    isCancelModalOpen.value = false
    router.push('/browse/your-events')
  }
}

const formatDate = (date, options) => {
  if (!date) return 'Unavailable'

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return 'Unavailable'

  return parsedDate.toLocaleDateString('id-ID', options)
}

const formatRegistrationDate = (date) => {
  if (!date) return 'Unavailable'

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return 'Unavailable'

  return parsedDate.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>

<template>
  <div class="ticket-receipt-page">
    <button type="button" class="btn-back" @click="router.push('/browse/your-events')">
      ← Back to Your Events
    </button>

    <div v-if="activeTicket" class="ticket-receipt-card">
      <header class="receipt-header">
        <div class="header-status">
          <span class="status-badge" :class="isEventDone ? 'badge-concluded' : 'badge-confirmed'">
            {{ isEventDone ? 'Concluded' : 'Active' }}
          </span>
          <span class="badge-confirmed">Confirmed</span>
        </div>
        <div class="ref-code">
          Booking Reference:
          <strong>{{ activeTicket.bookingCode }}</strong>
        </div>
        <p class="receipt-meta-date">
          Issued on {{ formatRegistrationDate(activeTicket.date) }}
        </p>
      </header>

      <section class="receipt-section">
        <h3 class="section-heading">Event Information</h3>
        <div class="event-title">{{ activeTicket.event.title }}</div>
        <div class="receipt-grid">
          <div class="grid-item">
            <span class="item-label">Category</span>
            <span class="item-value">{{ activeTicket.event.category || 'General' }}</span>
          </div>
          <div class="grid-item">
            <span class="item-label">Ticket Type</span>
            <span class="item-value">{{ activeTicket.ticket || 'Standard' }}</span>
          </div>
          <div class="grid-item">
            <span class="item-label">Date &amp; Time</span>
            <span class="item-value">
              {{ formatDate(activeTicket.event.date, { day: 'numeric', month: 'long', year: 'numeric' }) }}
              <template v-if="activeTicket.event.time"> · {{ activeTicket.event.time }}</template>
            </span>
          </div>
          <div class="grid-item">
            <span class="item-label">Location</span>
            <span class="item-value">{{ activeTicket.event.location || 'Unavailable' }}</span>
          </div>
        </div>
      </section>

      <section class="receipt-section">
        <h3 class="section-heading">Attendee Information</h3>
        <div class="receipt-grid">
          <div class="grid-item">
            <span class="item-label">Full Name</span>
            <span class="item-value">{{ activeTicket.fullName || 'Unavailable' }}</span>
          </div>
          <div class="grid-item">
            <span class="item-label">Email Address</span>
            <span class="item-value">{{ activeTicket.email || 'Unavailable' }}</span>
          </div>
          <div class="grid-item">
            <span class="item-label">Phone Number</span>
            <span class="item-value">{{ activeTicket.phone || 'Unavailable' }}</span>
          </div>
          <div class="grid-item">
            <span class="item-label">Date of Birth</span>
            <span class="item-value">
              {{ formatDate(activeTicket.dob, { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </span>
          </div>
        </div>
      </section>

      <section v-if="activeTicket.reason" class="receipt-section">
        <h3 class="section-heading">Reason for Attending</h3>
        <div class="reason-text">{{ activeTicket.reason }}</div>
      </section>

      <footer class="receipt-footer">
        <button
          type="button"
          class="btn-primary"
          @click="router.push('/browse/your-events')"
        >
          Back to Your Events
        </button>
        <button
          v-if="!isEventDone"
          type="button"
          class="btn-cancel-reg"
          @click="isCancelModalOpen = true"
        >
          Cancel Registration
        </button>
        <span v-else class="concluded-notice">
          This event has concluded. Attendance record is archived.
        </span>
      </footer>
    </div>

    <div v-else class="notice-card">
      <span class="notice-badge">Ticket Not Found</span>
      <h2>This ticket is unavailable</h2>
      <p>
        The ticket may have been canceled, or the event is no longer available.
      </p>
      <button type="button" class="btn-primary" @click="router.push('/browse/your-events')">
        View Your Events
      </button>
    </div>

    <AppModal
      :is-open="isCancelModalOpen"
      title="Cancel Registration?"
      message="Are you sure you want to cancel your registration for this event? Your ticket will be removed."
      confirm-text="Yes, Cancel Registration"
      cancel-text="Keep Registration"
      variant="danger"
      badge-text="Confirm Cancellation"
      badge-variant="warning"
      @confirm="handleConfirmCancel"
      @close="isCancelModalOpen = false"
    />
  </div>
</template>

<style scoped>
.ticket-receipt-page {
  max-width: 860px;
  margin: 0 auto;
  padding-bottom: var(--space-12);
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: var(--space-6);
}

.btn-back:hover {
  color: var(--primary);
}

.ticket-receipt-card,
.notice-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.ticket-receipt-card {
  padding: var(--space-8);
}

.receipt-header {
  padding-bottom: var(--space-6);
  border-bottom: 2px dashed var(--border-color);
  margin-bottom: var(--space-6);
}

.header-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.status-badge,
.badge-confirmed {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-confirmed {
  background: #dcfce7;
  color: #15803d;
}

.badge-concluded {
  background: #f1f5f9;
  color: #64748b;
}

.ref-code {
  font-family: monospace;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary);
}

.receipt-meta-date {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: var(--space-2) 0 0;
}

.receipt-section {
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--space-6);
}

.section-heading {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
  font-weight: 700;
}

.event-title {
  font-size: 1.8rem;
  color: var(--text-main);
  margin-bottom: var(--space-4);
}

.receipt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.item-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  overflow-wrap: anywhere;
}

.reason-text {
  padding: var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: var(--space-2);
  background: var(--bg-light);
  color: var(--text-main);
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.receipt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.btn-primary,
.btn-cancel-reg {
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 16px;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: #5a32d6;
}

.btn-cancel-reg {
  background: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  text-decoration: underline;
}

.btn-cancel-reg:hover {
  color: #ef4444;
}

.concluded-notice {
  color: #64748b;
  font-size: 0.85rem;
  font-style: italic;
}

.notice-card {
  max-width: 560px;
  margin: var(--space-8) auto;
  padding: var(--space-8);
  text-align: center;
}

.notice-badge {
  display: inline-block;
  margin-bottom: var(--space-3);
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--bg-light);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.notice-card h2 {
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.notice-card p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .ticket-receipt-card,
  .notice-card {
    padding: var(--space-5);
  }

  .event-title {
    font-size: 1.5rem;
  }
}
</style>