<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppButton from '@/components/UI/AppButton.vue'
import AppCard from '@/components/UI/AppCard.vue'
import AppModal from '@/components/UI/Appmodal.vue'
import RegistrationSummary from '@/components/Event/RegistrationSummary.vue'
import RegistrationForm from '@/components/Event/RegistrationForm.vue'
import RegistrationReceipt from '@/components/Event/RegistrationReceipt.vue'

const route = useRoute()
const router = useRouter()
const { events, getRegistrationsByEventId } = useEvent()

const event = computed(() =>
  events.value.find((item) => String(item.id) === String(route.params.id)),
)
const existingRegistration = computed(() =>
  event.value ? getRegistrationsByEventId(event.value.id)[0] || null : null,
)
const confirmation = ref(null)
const isSuccessModalOpen = ref(false)

const isEventDone = computed(
  () => event.value?.done || ['completed', 'done'].includes(event.value?.status),
)
const isRegistered = computed(() => Boolean(confirmation.value || existingRegistration.value))
const isSoldOut = computed(() => Number(event.value?.quota) <= 0)
const displayedConfirmation = computed(() => confirmation.value || existingRegistration.value)

const handleRegistrationSuccess = (record) => {
  confirmation.value = record
  isSuccessModalOpen.value = true
}

const handleGoToEventDetail = () => {
  router.push(`/browse/events/${route.params.id}`)
}

const handleGoToEventList = () => {
  router.push('/browse/events')
}
</script>

<template>
  <div class="registration-page">
    <template v-if="event">
      <div v-if="isRegistered" class="registration-notice success-notice">
        <span class="notice-badge">Registration Confirmed</span>
        <h2>You have already successfully registered for {{ event.title }}!</h2>
        <RegistrationReceipt :confirmation="displayedConfirmation" :event="event" />
        <div class="notice-actions">
          <AppButton variant="primary" @click="handleGoToEventDetail">
            Back to Event Detail
          </AppButton>
          <AppButton variant="secondary" @click="handleGoToEventList">Browse Events</AppButton>
        </div>
      </div>

      <div v-else-if="isEventDone" class="registration-notice">
        <span class="notice-badge">Event Finished</span>
        <h2>Registration Closed</h2>
        <p>This event has already concluded. Registrations are no longer accepted.</p>
        <div class="notice-actions">
          <AppButton variant="primary" @click="handleGoToEventList">
            Back to Event Catalog
          </AppButton>
        </div>
      </div>

      <div v-else-if="isSoldOut" class="registration-notice">
        <span class="notice-badge">Quota Full</span>
        <h2>Event Full</h2>
        <p>All available seats for this event have been filled.</p>
        <div class="notice-actions">
          <AppButton variant="primary" @click="handleGoToEventList">Browse Other Events</AppButton>
        </div>
      </div>

      <div v-else class="registration-grid">
        <RegistrationSummary :event="event" @back="handleGoToEventDetail" />
        <RegistrationForm
          :event="event"
          @success="handleRegistrationSuccess"
          @cancel="handleGoToEventDetail"
        />
      </div>
    </template>

    <div v-else class="not-found-card">
      <h2>Event Not Found</h2>
      <p>The event you are trying to register for is not available or has been deleted.</p>
      <AppButton variant="primary" @click="handleGoToEventList">Back to Event Catalog</AppButton>
    </div>

    <AppModal
      :is-open="isSuccessModalOpen"
      title="Registration Confirmed"
      message="Your event registration has been completed successfully."
      badge-text="Success"
      badge-variant="success"
      variant="success"
      :show-cancel="false"
      @confirm="isSuccessModalOpen = false"
      @close="isSuccessModalOpen = false"
    >
      <RegistrationReceipt :confirmation="confirmation" :event="event" />
      <template #footer>
        <button type="button" class="btn-primary-link" @click="handleGoToEventDetail">
          Back to Event Detail
        </button>
        <button type="button" class="btn-secondary-link" @click="handleGoToEventList">
          Browse Events
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.registration-page {
  padding-bottom: var(--space-12);
}

.registration-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: var(--space-8);
  align-items: start;
}

.registration-notice {
  max-width: 640px;
  margin: var(--space-8) auto;
  padding: var(--space-8);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  background: white;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.success-notice {
  max-width: 760px;
}

.notice-badge {
  display: inline-block;
  margin-bottom: var(--space-3);
  padding: var(--space-1) var(--space-3);
  border-radius: 50px;
  background: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.registration-notice h2 {
  margin-bottom: var(--space-2);
  color: var(--text-main);
  font-size: 1.6rem;
}

.registration-notice > p {
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-size: 0.95rem;
}

.notice-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-6);
}

.btn-primary-link,
.btn-secondary-link {
  display: inline-flex;
  justify-content: center;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary-link {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.btn-primary-link:hover {
  background: var(--primary-hover);
}

.btn-secondary-link {
  background: white;
  color: var(--text-main);
}

.btn-secondary-link:hover {
  background: var(--bg-light);
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
  .registration-grid {
    grid-template-columns: 1fr;
  }
}
</style>