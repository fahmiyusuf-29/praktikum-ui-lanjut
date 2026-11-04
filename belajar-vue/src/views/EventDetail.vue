<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEvents } from '@/Composable/UseEvent';
import AppButton from '@/components/UI/AppButton.vue';
import AppCard from '@/components/UI/AppCard.vue';

const route = useRoute();
const router = useRouter();
const { getEventById, isUserRegistered, fetchEventById, loading, error } = useEvents();

// Reactive data local dari events state (singleton)
const event = computed(() => getEventById(route.params.id));

// Cek apakah pengguna sudah terdaftar di event ini
const isRegistered = computed(() => {
  if (!event.value) return false;
  return isUserRegistered(event.value.id);
});

// Fetch data detail dari REST API jika belum tersimpan di state lokal
onMounted(() => {
  fetchEventById(route.params.id);
});
</script>

<template>
  <div class="event-detail-page">
    <button class="btn-back" @click="router.push('/browse/events')">
      ← Back to Events
    </button>

    <!-- KONDISI 1: LOADING DETAIL ACARA DARI SERVER -->
    <div
      v-if="loading && !event"
      class="loading-state"
      style="min-height: 300px; display: flex; align-items: center; justify-content: center"
    >
      <p style="color: var(--text-muted); font-size: 1.1rem; font-weight: 500">
        Memuat rincian acara dari server...
      </p>
    </div>

    <!-- KONDISI 2: DATA EVENT DITEMUKAN -->
    <div v-else-if="event">
      <div class="detail-header">
        <div class="header-tags">
          <span class="event-tag">{{ event.cat }}</span>
          <span v-if="event.done" class="status-tag status-ended">Event Finished</span>
          <span v-else-if="isRegistered" class="status-tag status-registered">Registered</span>
          <span v-else-if="event.quota <= 0" class="status-tag status-soldout">Sold Out</span>
          <span v-else class="status-tag status-live">Live Registration</span>
        </div>

        <h1>{{ event.title }}</h1>

        <div class="meta-info">
          <span class="meta-item"><strong>Date:</strong> {{ event.date }}</span>
          <span class="meta-item"><strong>Location:</strong> {{ event.loc }}</span>
          <span class="meta-item"><strong>Remaining Quota:</strong> {{ event.quota }} Attendees</span>
        </div>
      </div>

      <div class="grid-asymmetric">
        <!-- LEFT: CONTENT -->
        <div class="main-desc">
          <h2>About This Event</h2>
          <!-- P-FATTERN: Breaking text with Headings & Paragraphs -->
          <p class="description-text">
            {{ event.desc }}
          </p>
        </div>

        <!-- RIGHT: TICKET CARD & STICKY PANE -->
        <div class="sidebar">
          <AppCard class="ticket-card sticky-pane">
            <h3>Attendee Registration</h3>
            <p class="price">{{ event.price || 'Free' }}</p>
            <p class="ticket-desc text-warning">Secure your spot now before the remaining quota is filled.</p>

            <!-- BUTTON KONTROL DINAMIS BERDASARKAN STATUS -->
            <div class="action-buttons">
              <!-- STATUS 1: SUDAH SELESAI -->
              <AppButton
                v-if="event.done"
                variant="secondary"
                class="btn-register btn-disabled"
                disabled
              >
                Registration Closed
              </AppButton>

              <!-- STATUS 2: SUDAH TERDAFTAR -->
              <div v-else-if="isRegistered" class="registered-action-group">
                <AppButton variant="secondary" class="btn-register btn-registered" disabled>
                  Already Registered
                </AppButton>
                <router-link :to="`/browse/your-events/${event.id}`" class="view-receipt-link">
                  View Your Ticket Receipt Here
                </router-link>
              </div>

              <!-- STATUS 3: KUOTA HABIS -->
              <AppButton
                v-else-if="event.quota <= 0"
                variant="secondary"
                class="btn-register btn-disabled"
                disabled
              >
                Sold Out
              </AppButton>

              <!-- STATUS 4: TERSEDIA (NORMAL) -->
              <AppButton
                v-else
                variant="primary"
                class="btn-register"
                @click="router.push(`/browse/events/${event.id}/register`)"
              >
                Register Now
              </AppButton>
            </div>

            <p v-if="!event.done && !isRegistered && event.quota > 0" class="spots">
              {{ event.quota }} seats available
            </p>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- KONDISI 3: EMPTY / ERROR STATE IF ID NOT FOUND -->
    <div v-else class="not-found-card">
      <h2>{{ error ? 'Unable to Load Event' : 'Event Not Found' }}</h2>
      <p>
        {{
          error ||
          'The event you are looking for is unavailable or has been removed by the organizer.'
        }}
      </p>
      <AppButton variant="primary" @click="router.push('/browse/events')">
        Back to Event Catalog
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-weight: 500;
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  background: var(--bg-light);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
}

.header-tags {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.event-tag {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-4);
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
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
  background: #dbeafe;
  color: #1d4ed8;
}

.status-soldout {
  background: #fee2e2;
  color: #b91c1c;
}

.status-ended {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.detail-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
  line-height: 1.2;
  color: var(--text-main);
}

.meta-info {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.meta-item {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 1.05rem;
}

.meta-item strong {
  color: var(--text-main);
}

/* ASYMMETRIC GRID */
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc h2 {
  margin-bottom: var(--space-4);
  font-size: 1.8rem;
  border-left: 4px solid var(--primary);
  padding-left: var(--space-2);
}

.description-text {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-6);
  font-size: 1.1rem;
}

/* FOCAL POINT CARD */
.ticket-card {
  padding: var(--space-8);
  text-align: center;
}

/* STICKY BEHAVIOR */
.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card h3 {
  font-size: 1.4rem;
  margin-bottom: var(--space-3);
  color: var(--text-main);
}

.ticket-desc {
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: var(--space-4);
}

.ticket-desc.text-warning {
  color: #d97706;
  font-weight: 500;
}

.price {
  font-size: 2.2rem;
  margin-bottom: var(--space-4);
  color: var(--primary);
  font-weight: 800;
}

.btn-register {
  width: 100%;
}

.btn-disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-registered {
  cursor: default;
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid var(--border-color);
  opacity: 1;
}

.registered-action-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.view-receipt-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  display: inline-block;
  transition: color 0.2s;
}

.view-receipt-link:hover {
  text-decoration: underline;
}

.spots {
  margin-top: var(--space-4);
  color: #27ae60;
  font-weight: 600;
  font-size: 0.95rem;
}

.not-found-card {
  text-align: center;
  padding: var(--space-12);
  background: white;
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
}

.not-found-card h2 {
  margin-bottom: var(--space-2);
}

.not-found-card p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }
}
</style>
