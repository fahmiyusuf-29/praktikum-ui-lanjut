<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppCard from '@/components/UI/AppCard.vue'
import AppButton from '@/components/UI/AppButton.vue'
import Appmodal from '@/components/UI/Appmodal.vue'

const router = useRouter()
const { events, deletedEvents, addEvent, updateEvent, deleteEvent, permanentDelete } = useEvent()

const currentTab = ref('active')
const activeEvents = computed(() => events.value.filter((event) => event.status !== 'completed'))
const completedEvents = computed(() =>
  events.value.filter((event) => event.status === 'completed'),
)

const eventForm = reactive({
  title: '',
  category: '',
  date: '',
  location: '',
  quota: 100,
  price: 'Free',
  desc: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isModalOpen = ref(false)
const modalConfig = ref({})
const selectedEvent = ref(null)

const handleOpenCompleteModal = (event) => {
  selectedEvent.value = event
  modalConfig.value = {
    action: 'complete',
    title: 'Complete Event?',
    message: `Mark "${event.title}" as completed?`,
    confirmText: 'Complete Event',
  }
  isModalOpen.value = true
}

const handleOpenDeleteModal = (event) => {
  selectedEvent.value = event
  modalConfig.value = {
    action: 'delete',
    title: 'Delete Event?',
    message: `Move "${event.title}" to deleted events? You can permanently remove it later.`,
    confirmText: 'Delete Event',
  }
  isModalOpen.value = true
}

const handleOpenPermanentDeleteModal = (event) => {
  selectedEvent.value = event
  modalConfig.value = {
    action: 'permanent-delete',
    title: 'Permanently Delete Event?',
    message: `This will permanently delete "${event.title}". This action cannot be undone.`,
    confirmText: 'Permanently Delete',
  }
  isModalOpen.value = true
}

const handleOpenClearDeletedModal = () => {
  selectedEvent.value = null
  modalConfig.value = {
    action: 'clear-deleted',
    title: 'Clear Deleted Events?',
    message: 'Permanently delete all events in the deleted list? This action cannot be undone.',
    confirmText: 'Clear Deleted Events',
  }
  isModalOpen.value = true
}

const handleConfirmModal = () => {
  const eventId = selectedEvent.value?.id

  if (modalConfig.value.action === 'complete' && eventId !== undefined) {
    updateEvent(eventId, { status: 'completed' })
  } else if (modalConfig.value.action === 'delete' && eventId !== undefined) {
    deleteEvent(eventId)
  } else if (modalConfig.value.action === 'permanent-delete' && eventId !== undefined) {
    permanentDelete(eventId)
  } else if (modalConfig.value.action === 'clear-deleted') {
    deletedEvents.value.slice().forEach((event) => permanentDelete(event.id))
  }

  isModalOpen.value = false
  selectedEvent.value = null
}

const handleCancelModal = () => {
  isModalOpen.value = false
  selectedEvent.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const resetForm = () => {
  Object.assign(eventForm, {
    title: '',
    category: '',
    date: '',
    location: '',
    quota: 100,
    price: 'Free',
    desc: '',
  })
}

const handleAddEvent = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!eventForm.title.trim() || !eventForm.category || !eventForm.date || !eventForm.location.trim()) {
    errorMessage.value = 'Please fill in all required fields before publishing the event!'
    return
  }

  addEvent({
    title: eventForm.title.trim(),
    category: eventForm.category,
    date: formatDate(eventForm.date),
    location: eventForm.location.trim(),
    quota: Number(eventForm.quota),
    price: eventForm.price,
    description: eventForm.desc.trim(),
    status: 'active',
  })

  resetForm()
  successMessage.value = 'Event published successfully and is now live!'
  currentTab.value = 'active'
}

const handleRestoreEvent = (event) => {
  updateEvent(event.id, { deleted: false, status: 'active' })
}
</script>

<template>
  <div class="event-management-page">
    <div class="page-header">
      <div>
        <h2>Event Management</h2>
        <p class="subtitle">
          Manage the event lifecycle, publish new events, and track completed ones.
        </p>
      </div>
      <AppButton variant="primary" @click="currentTab = 'create'">+ Create New Event</AppButton>
    </div>

    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ active: currentTab === 'active' }"
        @click="currentTab = 'active'"
      >
        Active Events ({{ activeEvents.length }})
      </button>
      <button
        class="tab-btn"
        :class="{ active: currentTab === 'create' }"
        @click="currentTab = 'create'"
      >
        + Create Event
      </button>
      <button
        class="tab-btn"
        :class="{ active: currentTab === 'completed' }"
        @click="currentTab = 'completed'"
      >
        Completed Events ({{ completedEvents.length }})
      </button>
      <button
        class="tab-btn"
        :class="{ active: currentTab === 'deleted' }"
        @click="currentTab = 'deleted'"
      >
        Deleted Events ({{ deletedEvents.length }})
      </button>
    </div>

    <section v-if="currentTab === 'active'" class="tab-content">
      <div v-if="activeEvents.length" class="events-grid">
        <AppCard v-for="item in activeEvents" :key="item.id" class="organizer-event-card">
          <div class="event-card-body">
            <div class="card-top-row">
              <span class="category-badge">{{ item.category }}</span>
              <span class="event-status">
                <span class="status-dot"></span>
                {{ item.status === 'active' ? 'Active' : 'Draft' }}
              </span>
            </div>
            <h3 class="event-title">{{ item.title }}</h3>
            <p class="event-meta">📅 {{ item.date }}</p>
            <p class="event-meta">📍 {{ item.location }}</p>
            <p class="event-desc">{{ item.description }}</p>
            <div class="card-actions">
              <button class="btn-action btn-detail" @click="router.push(`/browse/events/${item.id}`)">
                View Details
              </button>
              <button class="btn-action btn-complete" @click="handleOpenCompleteModal(item)">
                Complete Event
              </button>
              <button class="btn-action btn-delete" @click="handleOpenDeleteModal(item)">
                Delete
              </button>
            </div>
          </div>
        </AppCard>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Active Events</h3>
        <p>All events have ended or none have been created yet. Please create a new event.</p>
        <AppButton variant="primary" @click="currentTab = 'create'">+ Create Event Now</AppButton>
      </div>
    </section>

    <section v-else-if="currentTab === 'completed'" class="tab-content">
      <div v-if="completedEvents.length" class="events-grid">
        <AppCard
          v-for="item in completedEvents"
          :key="item.id"
          class="organizer-event-card card-completed"
        >
          <div class="event-card-body">
            <div class="card-top-row">
              <span class="category-badge">{{ item.category }}</span>
              <span class="event-status status-completed">Completed</span>
            </div>
            <h3 class="event-title">{{ item.title }}</h3>
            <p class="event-meta">📅 {{ item.date }}</p>
            <p class="event-meta">📍 {{ item.location }}</p>
            <p class="event-desc">{{ item.description }}</p>
            <div class="completed-notice">This event has been completed.</div>
            <div class="card-actions">
              <button class="btn-action btn-detail" @click="router.push(`/browse/events/${item.id}`)">
                View Details
              </button>
              <button class="btn-action btn-delete" @click="handleOpenDeleteModal(item)">
                Delete
              </button>
            </div>
          </div>
        </AppCard>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">✓</div>
        <h3>No Completed Events</h3>
        <p>Events marked as completed will appear here.</p>
      </div>
    </section>

    <section v-else-if="currentTab === 'deleted'" class="tab-content">
      <div class="deleted-toolbar">
        <p>Deleted events can be restored or permanently removed.</p>
        <button
          v-if="deletedEvents.length"
          class="btn-action btn-delete"
          @click="handleOpenClearDeletedModal"
        >
          Clear All Deleted
        </button>
      </div>
      <div v-if="deletedEvents.length" class="events-grid">
        <AppCard
          v-for="item in deletedEvents"
          :key="item.id"
          class="organizer-event-card card-deleted"
        >
          <div class="event-card-body">
            <div class="card-top-row">
              <span class="category-badge">{{ item.category }}</span>
              <span class="event-status status-deleted">Deleted</span>
            </div>
            <h3 class="event-title">{{ item.title }}</h3>
            <p class="event-meta">📅 {{ item.date }}</p>
            <p class="event-meta">📍 {{ item.location }}</p>
            <div class="card-actions">
              <button class="btn-action btn-complete" @click="handleRestoreEvent(item)">
                Restore to Active
              </button>
              <button class="btn-action btn-delete" @click="handleOpenPermanentDeleteModal(item)">
                Permanently Delete
              </button>
            </div>
          </div>
        </AppCard>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">🗑️</div>
        <h3>No Deleted Events</h3>
        <p>Events you delete will be listed here.</p>
      </div>
    </section>

    <section v-else class="tab-content form-section">
      <div class="form-card">
        <div class="form-header">
          <h3>Create New Event</h3>
          <p>Fill in the details below. Your event will be immediately published to the public catalog.</p>
        </div>

        <div v-if="errorMessage" class="alert-box alert-error">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert-box alert-success">{{ successMessage }}</div>

        <form class="event-form" @submit.prevent="handleAddEvent">
          <div class="form-group">
            <label for="event-title">Event Title <span class="required">*</span></label>
            <input
              id="event-title"
              v-model="eventForm.title"
              type="text"
              placeholder="e.g. Modern Web Development Workshop"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="event-category">Category <span class="required">*</span></label>
              <select id="event-category" v-model="eventForm.category" required>
                <option disabled value="">Select a category</option>
                <option>Technology</option>
                <option>Music</option>
                <option>Art</option>
                <option>Business</option>
                <option>Workshop</option>
              </select>
            </div>
            <div class="form-group">
              <label for="event-date">Date <span class="required">*</span></label>
              <input id="event-date" v-model="eventForm.date" type="date" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="event-location">Location <span class="required">*</span></label>
              <input
                id="event-location"
                v-model="eventForm.location"
                type="text"
                placeholder="e.g. Jakarta Convention Center"
                required
              />
            </div>
            <div class="form-group">
              <label for="event-quota">Quota</label>
              <input
                id="event-quota"
                v-model.number="eventForm.quota"
                type="number"
                min="1"
                placeholder="100"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="event-price">Ticket Price</label>
            <select id="event-price" v-model="eventForm.price">
              <option>Free</option>
              <option>Paid</option>
            </select>
          </div>

          <div class="form-group">
            <label for="event-description">Description</label>
            <textarea
              id="event-description"
              v-model="eventForm.desc"
              rows="4"
              placeholder="Describe the event, its goals, and key information..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary-action" @click="resetForm">Reset Form</button>
            <AppButton variant="primary" type="submit">Publish Event</AppButton>
          </div>
        </form>
      </div>
    </section>

    <Appmodal
      :is-open="isModalOpen"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirm-text="modalConfig.confirmText"
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
}

.page-header h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.subtitle,
.form-header p,
.deleted-toolbar p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.tabs-container {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  flex: 0 0 auto;
  padding: var(--space-3) var(--space-4);
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

.tab-btn.active {
  border-bottom-color: var(--primary);
  color: var(--primary);
}

.tab-content {
  min-height: 260px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}

.organizer-event-card {
  height: 100%;
}

.event-card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-6);
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.category-badge {
  border-radius: 50px;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.event-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #27ae60;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #27ae60;
}

.event-title {
  margin-bottom: var(--space-2);
  color: var(--text-main);
  font-size: 1.25rem;
}

.event-meta {
  margin-bottom: var(--space-2);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.event-desc {
  flex: 1;
  margin: var(--space-2) 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.card-completed {
  opacity: 0.85;
  background: #f8fafc;
}

.status-completed {
  border-radius: 50px;
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
  padding: 6px 10px;
}

.completed-notice {
  margin-bottom: var(--space-4);
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  padding: var(--space-2);
  font-size: 0.85rem;
}

.card-deleted {
  opacity: 0.8;
}

.status-deleted {
  border-radius: 50px;
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
  padding: 6px 10px;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-action,
.btn-secondary-action {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  color: var(--text-muted);
  padding: 8px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-detail:hover {
  border-color: var(--primary);
  background: var(--bg-light);
  color: var(--primary);
}

.btn-complete {
  border-color: #27ae60;
  color: #27ae60;
}

.btn-complete:hover {
  background: #27ae60;
  color: white;
}

.btn-delete {
  border-color: #dc3545;
  color: #dc3545;
  flex: 0 0 auto;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
}

.empty-state {
  padding: var(--space-12) var(--space-4);
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--space-3);
  font-size: 2.5rem;
}

.empty-state h3 {
  margin-bottom: var(--space-2);
  color: var(--text-main);
}

.empty-state p {
  margin-bottom: var(--space-4);
  color: var(--text-muted);
}

.deleted-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.form-section {
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 800px;
  padding: var(--space-8);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.form-header {
  margin-bottom: var(--space-6);
}

.form-header h3 {
  margin-bottom: var(--space-2);
  color: var(--text-main);
  font-size: 1.4rem;
}

.alert-box {
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-error {
  border: 1px solid #f5c2c7;
  background: #f8d7da;
  color: #842029;
}

.alert-success {
  border: 1px solid #badbcc;
  background: #d1e7dd;
  color: #0f5132;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 600;
}

.required {
  color: #dc3545;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  padding: 10px 12px;
  color: var(--text-main);
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.btn-secondary-action {
  padding: var(--space-3) var(--space-5);
  font-size: 0.9rem;
}

.btn-secondary-action:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: var(--space-5);
  }

  .deleted-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
