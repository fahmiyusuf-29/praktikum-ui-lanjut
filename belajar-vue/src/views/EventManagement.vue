<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppCard from '@/components/UI/AppCard.vue'
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/Appmodal.vue'
import OrganizerEventCard from '@/components/Event/OrganizerEventCard.vue'
import EventCreateForm from '@/components/Event/EventCreateForm.vue'

const router = useRouter()
const {
  events,
  activeEvents,
  completedEvents,
  deletedEvents,
  addEvent,
  completeEvent,
  deleteEvent,
  updateEvent,
  permanentDelete,
} = useEvent()

const currentTab = ref('active')
const isModalOpen = ref(false)
const modalAction = ref('complete')
const selectedEvent = ref(null)
const successMessage = ref('')

const handleOpenCompleteModal = (event) => {
  selectedEvent.value = event
  modalAction.value = 'complete'
  isModalOpen.value = true
}

const handleOpenDeleteModal = (event) => {
  selectedEvent.value = event
  modalAction.value = 'delete'
  isModalOpen.value = true
}

const handleConfirmModal = () => {
  if (!selectedEvent.value) return

  if (modalAction.value === 'complete') {
    completeEvent(selectedEvent.value.id)
  } else {
    deleteEvent(selectedEvent.value.id)
  }

  isModalOpen.value = false
  selectedEvent.value = null
}

const handleCancelModal = () => {
  isModalOpen.value = false
  selectedEvent.value = null
}

const handleCreateEvent = (eventData) => {
  addEvent(eventData)
  successMessage.value = 'Event published successfully and is now live!'
  currentTab.value = 'active'

  window.setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const handleRestoreEvent = (event) => {
  updateEvent(event.id, { deleted: false, status: 'active' })
}

const handlePermanentDelete = (event) => {
  permanentDelete(event.id)
}
</script>

<template>
  <div class="event-management-page">
    <div class="page-header">
      <div>
        <h2>Event Management Control</h2>
        <p class="subtitle">
          Monitor event lifecycle, publish new events, and archive completed ones.
        </p>
      </div>
      <AppButton variant="primary" @click="currentTab = 'create'">+ Create New Event</AppButton>
    </div>

    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ 'tab-active': currentTab === 'active' }"
        @click="currentTab = 'active'"
      >
        🟢 Active Events ({{ activeEvents.length }})
      </button>
      <button
        class="tab-btn"
        :class="{ 'tab-active': currentTab === 'create' }"
        @click="currentTab = 'create'"
      >
        + Create Event
      </button>
      <button
        class="tab-btn"
        :class="{ 'tab-active': currentTab === 'completed' }"
        @click="currentTab = 'completed'"
      >
        ✅ Completed Events ({{ completedEvents.length }})
      </button>
      <button
        class="tab-btn"
        :class="{ 'tab-active': currentTab === 'deleted' }"
        @click="currentTab = 'deleted'"
      >
        Deleted Events ({{ deletedEvents.length }})
      </button>
    </div>

    <div v-if="successMessage && currentTab === 'active'" class="success-message" role="status">
      {{ successMessage }}
    </div>

    <!-- Tab 1: Active Events -->
    <section v-if="currentTab === 'active'" class="tab-pane">
      <div v-if="activeEvents.length" class="events-grid">
        <OrganizerEventCard
          v-for="event in activeEvents"
          :key="event.id"
          :event="event"
          @view-detail="(eventId) => router.push(`/browse/events/${eventId}`)"
          @complete="handleOpenCompleteModal"
          @delete="handleOpenDeleteModal"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Active Events</h3>
        <p>
          All events have ended or none have been created yet. Please create a new event.
        </p>
        <AppButton variant="primary" @click="currentTab = 'create'">+ Create Event Now</AppButton>
      </div>
    </section>

    <!-- Tab 2: Create Event Form -->
    <section v-else-if="currentTab === 'create'" class="tab-pane form-pane">
      <EventCreateForm
        @submit="handleCreateEvent"
        @cancel="currentTab = 'active'"
      />
    </section>

    <!-- Tab 3: Completed Events Archive -->
    <section v-else-if="currentTab === 'completed'" class="tab-pane">
      <div v-if="completedEvents.length" class="events-grid">
        <OrganizerEventCard
          v-for="event in completedEvents"
          :key="event.id"
          :event="event"
          is-completed
          @view-detail="(eventId) => router.push(`/browse/events/${eventId}`)"
          @delete="handleOpenDeleteModal"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No Completed Events</h3>
        <p>Events marked as completed will be archived here permanently.</p>
      </div>
    </section>

    <section v-else class="tab-pane">
      <div v-if="deletedEvents.length" class="events-grid">
        <AppCard
          v-for="event in deletedEvents"
          :key="event.id"
          class="deleted-event-card"
        >
          <span class="deleted-category">{{ event.category }}</span>
          <h3>{{ event.title }}</h3>
          <p>{{ event.date }} · {{ event.location }}</p>
          <div class="deleted-actions">
            <button type="button" class="restore-button" @click="handleRestoreEvent(event)">
              Restore Event
            </button>
            <button type="button" class="remove-button" @click="handlePermanentDelete(event)">
              Permanently Delete
            </button>
          </div>
        </AppCard>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">🗑️</div>
        <h3>No Deleted Events</h3>
        <p>Events you delete will be listed here.</p>
      </div>
    </section>

    <!-- Modal confirmation for completing or deleting an event -->
    <AppModal
      :is-open="isModalOpen"
      :title="modalAction === 'complete' ? 'Complete Event?' : 'Delete Event?'"
      :message="
        modalAction === 'complete'
          ? `Are you sure you want to mark ${selectedEvent?.title} as complete? Once completed, the status is final and the event will be moved to the archived records.`
          : `Are you sure you want to delete ${selectedEvent?.title}? This action moves the event to deleted events.`
      "
      :confirm-text="modalAction === 'complete' ? 'Yes, Complete' : 'Yes, Delete'"
      badge-text="Warning"
      badge-variant="warning"
      @confirm="handleConfirmModal"
      @close="handleCancelModal"
    />
  </div>
</template>

<style scoped>
.event-management-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.page-header h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.tabs-container {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-2);
}

.tab-btn {
  flex: 0 0 auto;
  background: none;
  border: none;
  padding: var(--space-3) var(--space-4);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: rgba(102, 68, 255, 0.05);
  color: var(--primary);
}

.tab-btn.tab-active {
  border-bottom-color: var(--primary);
  color: var(--primary);
  background-color: var(--bg-light);
}

.tab-pane {
  min-height: 300px;
}

.form-pane {
  display: flex;
  justify-content: center;
}

.success-message {
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  border: 1px solid #badbcc;
  border-radius: 6px;
  background: #d1e7dd;
  color: #0f5132;
  font-weight: 600;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-2);
}

.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: white;
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.deleted-event-card {
  padding: var(--space-6);
}

.deleted-category {
  display: inline-block;
  color: var(--primary);
  background: rgba(102, 68, 255, 0.1);
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.deleted-event-card h3 {
  color: var(--text-main);
  margin: var(--space-3) 0;
}

.deleted-event-card p {
  color: var(--text-muted);
}

.deleted-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.restore-button,
.remove-button {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  font-weight: 600;
  cursor: pointer;
}

.restore-button {
  color: #27ae60;
  border-color: #27ae60;
}

.restore-button:hover {
  color: white;
  background: #27ae60;
}

.remove-button {
  color: #dc3545;
  border-color: #dc3545;
}

.remove-button:hover {
  color: white;
  background: #dc3545;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .empty-state {
    padding: var(--space-8) var(--space-4);
  }
}
</style>
