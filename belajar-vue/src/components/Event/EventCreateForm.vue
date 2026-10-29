<script setup>
import { reactive, ref } from 'vue'
import AppCard from '@/components/UI/AppCard.vue'
import AppButton from '@/components/UI/AppButton.vue'

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',
  category: 'Workshop',
  date: '',
  location: '',
  quota: 100,
  price: 'Free',
  desc: '',
})

const errorMessage = ref('')

const formatDate = (date) => {
  if (!date) return ''

  const parsedDate = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const handleSubmitEvent = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.title.trim() || !form.category || !form.date || !form.location.trim()) {
    errorMessage.value = 'Please fill in all required fields before publishing the event!'
    return
  }

  if (!Number.isFinite(Number(form.quota)) || Number(form.quota) < 1) {
    errorMessage.value = 'Event quota must be at least one.'
    return
  }

  emit('submit', {
    title: form.title.trim(),
    category: form.category,
    date: formatDate(form.date),
    location: form.location.trim(),
    quota: Number(form.quota),
    price: form.price,
    desc: form.desc.trim(),
    description: form.desc.trim(),
    status: 'active',
  })

  Object.assign(form, {
    title: '',
    category: 'Workshop',
    date: '',
    location: '',
    quota: 100,
    price: 'Free',
    desc: '',
  })
}
</script>

<template>
  <AppCard class="form-card">
    <div class="form-header">
      <h3>Create New Event</h3>
      <p>Every event submitted here will be instantly published to the Gatherly public catalog.</p>
    </div>

    <div v-if="errorMessage" class="alert-box alert-error" role="alert">
      ⚠️ {{ errorMessage }}
    </div>
    <form class="event-form" @submit.prevent="handleSubmitEvent">
      <div class="form-group">
        <label for="event-title">Event Title <span class="required">*</span></label>
        <input
          id="event-title"
          v-model="form.title"
          type="text"
          placeholder="e.g. Modern UI/UX Masterclass"
          class="form-input"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-category">Category <span class="required">*</span></label>
          <select id="event-category" v-model="form.category" class="form-input" required>
            <option>Workshop</option>
            <option>Technology</option>
            <option>Music</option>
            <option>Art</option>
            <option>Business</option>
            <option>Competition</option>
            <option>Seminar</option>
            <option>Conference</option>
          </select>
        </div>

        <div class="form-group">
          <label for="event-date">Date <span class="required">*</span></label>
          <input id="event-date" v-model="form.date" type="date" class="form-input" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-location">Location <span class="required">*</span></label>
          <input
            id="event-location"
            v-model="form.location"
            type="text"
            placeholder="e.g. Innovation Center, Jakarta"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="event-quota">Quota</label>
          <input
            id="event-quota"
            v-model.number="form.quota"
            type="number"
            min="1"
            placeholder="100"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="event-price">Ticket Price</label>
        <select id="event-price" v-model="form.price" class="form-input">
          <option>Free</option>
          <option>Paid</option>
        </select>
      </div>

      <div class="form-group">
        <label for="event-description">Event Description</label>
        <textarea
          id="event-description"
          v-model="form.desc"
          class="form-input"
          rows="4"
          placeholder="Describe the agenda, speakers, and key takeaways..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary-action" @click="emit('cancel')">Cancel</button>
        <AppButton variant="primary" type="submit">Publish Event</AppButton>
      </div>
    </form>
  </AppCard>
</template>

<style scoped>
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

.form-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.alert-box {
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-error {
  background: #fff3f3;
  color: #842029;
  border: 1px solid #f5c2c7;
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

.form-input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: white;
  padding: 13px 14px;
  color: var(--text-main);
  font: inherit;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

textarea.form-input {
  resize: vertical;
}

.form-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-secondary-action {
  padding: var(--space-3) var(--space-5);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-light);
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-action:hover {
  background: var(--bg-gray);
  color: var(--text-main);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: var(--space-5);
  }
}
</style>