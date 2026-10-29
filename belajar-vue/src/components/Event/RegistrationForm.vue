<script setup>
import { computed, reactive, ref } from 'vue'
import { useEvent } from '@/Composable/UseEvent'
import AppCard from '@/components/UI/AppCard.vue'
import AppModal from '@/components/UI/Appmodal.vue'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['success', 'cancel'])
const { registerAttendee } = useEvent()

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  reason: '',
})

const errors = reactive({
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  reason: '',
})

const errorMessage = ref('')
const isDiscardModalOpen = ref(false)

const isFormDirty = computed(() =>
  Boolean(form.fullName.trim() || form.email.trim() || form.phone.trim() || form.dob || form.reason.trim()),
)

const validateField = (field) => {
  switch (field) {
    case 'fullName':
      if (!form.fullName.trim()) {
        errors.fullName = 'Full name is required.'
      } else if (form.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters.'
      } else {
        errors.fullName = ''
      }
      break
    case 'email':
      if (!form.email.trim()) {
        errors.email = 'An email address is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Please enter a valid email address (e.g. name@example.com).'
      } else {
        errors.email = ''
      }
      break
    case 'phone':
      if (!form.phone.trim()) {
        errors.phone = 'Phone number is required.'
      } else if (!/^\+?[\d\s()-]{9,}$/.test(form.phone.trim())) {
        errors.phone = 'Please enter a valid phone number (minimum 9 digits).'
      } else {
        errors.phone = ''
      }
      break
    case 'dob':
      if (!form.dob) {
        errors.dob = 'Date of birth is required.'
      } else if (new Date(`${form.dob}T00:00:00`) > new Date()) {
        errors.dob = 'Date of birth cannot be in the future.'
      } else {
        errors.dob = ''
      }
      break
    case 'reason':
      if (!form.reason.trim()) {
        errors.reason = 'A reason for attending is required.'
      } else if (form.reason.trim().length < 10) {
        errors.reason = 'Please write at least 10 characters explaining your reason.'
      } else {
        errors.reason = ''
      }
      break
  }
}

const validateAll = () => {
  validateField('fullName')
  validateField('email')
  validateField('phone')
  validateField('dob')
  validateField('reason')

  return !errors.fullName && !errors.email && !errors.phone && !errors.dob && !errors.reason
}

const handleSubmit = () => {
  errorMessage.value = ''

  if (!validateAll()) {
    errorMessage.value = 'Please correct the highlighted fields before submitting.'
    return
  }

  if (Number(props.event.quota) <= 0) {
    errorMessage.value = 'Registration is full. No seats are remaining.'
    return
  }

  const record = registerAttendee(props.event.id, {
    ...form,
    ticket: props.event.price || 'Free',
    quantity: 1,
  })

  if (record) {
    emit('success', record)
  } else {
    errorMessage.value = 'Unable to complete registration. Please check event availability.'
  }
}

const handleCancelClick = () => {
  if (isFormDirty.value) {
    isDiscardModalOpen.value = true
  } else {
    emit('cancel')
  }
}

const handleConfirmDiscard = () => {
  isDiscardModalOpen.value = false
  emit('cancel')
}
</script>

<template>
  <div class="registration-form-wrapper">
    <AppCard class="form-card">
      <header class="form-header">
        <h2>Registration Form</h2>
        <p>Fill out the attendee information below to confirm your participation.</p>
      </header>

      <div v-if="errorMessage" class="error-banner" role="alert">
        {{ errorMessage }}
      </div>

      <form class="attendee-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="fullName">Full Name <span class="required">*</span></label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              :class="['form-input', { 'input-error': errors.fullName }]"
              placeholder="e.g. John Doe"
              autocomplete="name"
              @blur="validateField('fullName')"
            />
            <span v-if="errors.fullName" class="field-error">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email Address <span class="required">*</span></label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :class="['form-input', { 'input-error': errors.email }]"
              placeholder="e.g. name@example.com"
              autocomplete="email"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phone">Phone Number <span class="required">*</span></label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              :class="['form-input', { 'input-error': errors.phone }]"
              placeholder="e.g. 081234567890"
              autocomplete="tel"
              @blur="validateField('phone')"
            />
            <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="dob">Date of Birth <span class="required">*</span></label>
            <input
              id="dob"
              v-model="form.dob"
              type="date"
              :max="new Date().toISOString().split('T')[0]"
              :class="['form-input', { 'input-error': errors.dob }]"
              @blur="validateField('dob')"
            />
            <span v-if="errors.dob" class="field-error">{{ errors.dob }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="reason">Reason for Attending <span class="required">*</span></label>
          <textarea
            id="reason"
            v-model="form.reason"
            class="form-textarea"
            :class="{ 'input-error': errors.reason }"
            placeholder="Please describe your background, interests, or what you hope to achieve by joining this event..."
            rows="4"
            @blur="validateField('reason')"
          ></textarea>
          <span v-if="errors.reason" class="field-error">{{ errors.reason }}</span>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel-form" @click="handleCancelClick">Cancel</button>
          <button type="submit" class="btn-submit-form">Submit Registration</button>
        </div>
      </form>
    </AppCard>

    <AppModal
      :is-open="isDiscardModalOpen"
      title="Discard Changes?"
      message="You have unsaved changes in this form. Are you sure you want to cancel and leave this page?"
      badge-text="Warning"
      badge-variant="warning"
      confirm-text="Keep Editing"
      :show-cancel="false"
      @close="isDiscardModalOpen = false"
      @confirm="isDiscardModalOpen = false"
    >
      <template #footer>
        <button type="button" class="btn-cancel-form" @click="handleConfirmDiscard">
          Discard Changes
        </button>
        <button
          type="button"
          class="btn-submit-form"
          @click="isDiscardModalOpen = false"
        >
          Keep Editing
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.form-card {
  padding: var(--space-6);
  border: 1px solid var(--border-color);
  background: white;
  border-radius: var(--space-4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.form-header {
  margin-bottom: var(--space-6);
}

.form-header h2 {
  font-size: 1.4rem;
  color: var(--text-main);
  margin: 0 0 var(--space-1);
}

.form-header p {
  color: var(--text-muted);
  margin: 0;
}

.error-banner {
  background: #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: var(--space-6);
}

.attendee-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-main);
  background: white;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.15);
}

.form-input.input-error,
.form-textarea.input-error {
  border-color: #ef4444;
  background-color: #fffafa;
}

.form-input.input-error:focus,
.form-textarea.input-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.field-error {
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 500;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-cancel-form,
.btn-submit-form {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    all 0.2s,
    transform 0.1s;
}

.btn-cancel-form {
  background: white;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.btn-cancel-form:hover {
  background: var(--bg-gray);
  color: var(--text-main);
}

.btn-submit-form {
  background: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(102, 68, 255, 0.25);
}

.btn-submit-form:hover {
  background: var(--primary-hover);
}

.btn-submit-form:active {
  transform: scale(0.98);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: var(--space-4);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel-form,
  .btn-submit-form {
    width: 100%;
  }
}
</style>