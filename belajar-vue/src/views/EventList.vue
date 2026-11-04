<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEvents } from '@/Composable/UseEvent';
import EventCard from '@/components/Event/EventCard.vue';
import SearchBox from '@/components/Event/SearchBox.vue';
import CategoryFilter from '@/components/Event/CategoryFilter.vue';
import AppButton from '@/components/UI/AppButton.vue';

const router = useRouter();

// Mengonsumsi single source of truth (REST API & state reaktif)
const { activeEvents, isUserRegistered, loading, error, fetchEvents } = useEvents();

const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ['All', 'Workshop', 'Technology', 'Music', 'Competition', 'Seminar', 'Conference'];

// Filtering reaktif terhadap data state aktif
const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return activeEvents.value.filter((event) => {
    const title = (event.title || '').toLowerCase();
    const description = (event.desc || '').toLowerCase();
    const matchesSearch = title.includes(query) || description.includes(query);
    const matchesCategory =
      selectedCategory.value === 'All' ||
      (event.cat || event.category) === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`);
};

// Panggil REST API saat halaman pertama kali dibuka
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <div class="header-top">
        <h2 class="section-title">Upcoming Events</h2>
        <button
          class="btn-refresh"
          :disabled="loading"
          title="Muat Ulang Data dari Server"
          @click="fetchEvents"
        >
          <span v-if="loading" class="btn-spinner"></span>
          {{ loading ? 'Memuat Ulang...' : '🔄 Muat Ulang' }}
        </button>
      </div>
      <p class="section-desc">Discover workshops, seminars, tech meetups, and competitions near you.</p>
    </div>

    <div class="filters-section">
      <SearchBox v-model="searchQuery" />
      <CategoryFilter v-model="selectedCategory" :categories="categories" />
    </div>

    <!-- 1. LOADING STATE (SKELETON CARDS SHIMMER) -->
    <div v-if="loading" class="event-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-meta">
          <div class="skeleton-line skeleton-date"></div>
          <div class="skeleton-pill"></div>
        </div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-loc"></div>
        <div class="skeleton-line skeleton-desc"></div>
        <div class="skeleton-line skeleton-desc short"></div>
      </div>
    </div>

    <!-- 2. ERROR STATE (DISETARI TOMBOL MUAT ULANG / RETRY) -->
    <div v-else-if="error" class="error-state">
      <div class="error-badge">NETWORK ERROR</div>
      <h3>Gagal Memuat Data Acara</h3>
      <p>{{ error }}</p>
      <div class="error-action">
        <AppButton variant="primary" @click="fetchEvents">
          🔄 Muat Ulang Produk &amp; Acara
        </AppButton>
      </div>
    </div>

    <!-- 3. EMPTY STATE (KATALOG KOSONG) -->
    <div v-else-if="!filteredEvents.length" class="empty-state">
      <div class="empty-badge">ALL EVENTS</div>
      <h3>No Events Available Yet</h3>
      <p>
        There are currently no active events scheduled. Are you an organizer? Publish and manage
        your first event today through the Dashboard.
      </p>
      <div class="empty-action">
        <AppButton variant="primary" @click="router.push('/dashboard')">
          Go to Organizer Dashboard →
        </AppButton>
      </div>
    </div>

    <!-- 4. DATA / SUCCESS STATE (GRID EVENT HASIL DARI REST API) -->
    <div v-else class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="{
          ...event,
          category: event.cat || event.category,
          location: event.loc || event.location,
        }"
        :is-registered="isUserRegistered(event.id)"
        @view-detail="handleViewDetail"
      />
    </div>
  </div>
</template>

<style scoped>
.header-section {
  margin-bottom: var(--space-8);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 2.2rem;
  margin-bottom: var(--space-2);
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.btn-refresh {
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-refresh:hover:not(:disabled) {
  background: var(--bg-gray);
  color: var(--primary);
}

.btn-refresh:disabled {
  cursor: wait;
  opacity: 0.65;
}

.filters-section {
  margin-bottom: var(--space-6);
}

/* ADAPTIVE GRID */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.skeleton-card {
  padding: var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.skeleton-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.skeleton-line,
.skeleton-pill {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 6px;
}

.skeleton-date {
  width: 110px;
  height: 24px;
}

.skeleton-pill {
  width: 70px;
  height: 22px;
  border-radius: 50px;
}

.skeleton-title {
  width: 85%;
  height: 20px;
  margin-bottom: var(--space-3);
}

.skeleton-loc {
  width: 60%;
  height: 14px;
  margin-bottom: var(--space-4);
}

.skeleton-desc {
  width: 100%;
  height: 14px;
  margin-bottom: var(--space-2);
}

.skeleton-desc.short {
  width: 70%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.error-state,
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-8);
  color: var(--text-muted);
  background: white;
  border-radius: var(--space-4);
  border: 1px dashed var(--border-color);
  max-width: 600px;
  margin: var(--space-8) auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.error-state {
  border-color: #fecaca;
}

.error-badge,
.empty-badge {
  display: inline-block;
  background: var(--bg-light);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 50px;
  border: 1px solid var(--border-color);
  margin-bottom: var(--space-4);
}

.error-badge {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
}

.empty-state h3,
.error-state h3 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.empty-state p,
.error-state p {
  line-height: 1.6;
  margin-bottom: var(--space-6);
  font-size: 1rem;
}

.empty-action,
.error-action {
  display: flex;
  justify-content: center;
}
</style>
