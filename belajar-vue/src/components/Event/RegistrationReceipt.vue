<script setup>
defineProps({
  confirmation: {
    type: Object,
    default: null,
  },
  event: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <div v-if="confirmation && event" class="receipt-wrapper">
    <div class="success-header">
      <h2 class="success-title">
        🎉 Congratulations, {{ confirmation.fullName }}! Your registration for
        {{ event.title }} has been officially confirmed.
      </h2>
    </div>

    <div class="receipt-box">
      <div class="receipt-row">
        <span class="receipt-label">Booking Reference</span>
        <span class="receipt-code">{{ confirmation.bookingCode }}</span>
      </div>

      <div class="receipt-row">
        <span class="receipt-label">Attendee Email</span>
        <span class="receipt-value">{{ confirmation.email }}</span>
      </div>

      <div class="receipt-row">
        <span class="receipt-label">Event Schedule</span>
        <span class="receipt-value">{{ event.date }}</span>
      </div>

      <div class="receipt-row">
        <span class="receipt-label">Venue &amp; Location</span>
        <span class="receipt-value">{{ event.location }}</span>
      </div>

      <div class="receipt-row">
        <span class="receipt-label">Ticket</span>
        <span class="receipt-value">{{ event.price || 'Free' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-wrapper {
  margin-top: var(--space-2);
}

.success-header {
  font-size: 0.95rem;
  color: var(--text-main);
  line-height: 1.4;
  margin-bottom: var(--space-4);
}

.success-title {
  font-size: 1.1rem;
  color: var(--text-main);
  margin: 0;
}

.receipt-box {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.9rem;
}

.receipt-label {
  color: var(--text-muted);
}

.receipt-value {
  font-weight: 600;
  color: var(--text-main);
  text-align: right;
}

.receipt-code {
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--primary);
  background: rgba(102, 68, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>