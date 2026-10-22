<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import EventCard from '@/components/Event/EventCard.vue'
import SearchBox from '@/components/Event/SearchBox.vue'
import CategoryFilter from '@/components/Event/CategoryFilter.vue'
import AppButton from '@/components/UI/AppButton.vue'

const router = useRouter()
const { events } = useEvent()

const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Technology', 'Music', 'Workshop', 'Competition', 'Seminar', 'Conference']

const activeEvents = computed(() => events.value.filter((event) => event.status === 'active'))

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return activeEvents.value.filter((event) => {
    const matchesSearch =
      (event.title || '').toLowerCase().includes(query) ||
      (event.description || '').toLowerCase().includes(query)
    const matchesCategory =
      selectedCategory.value === 'All' || event.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const handleViewDetail = (eventId) => {
  router.push(`/browse/events/${eventId}`)
}
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <h2 class="section-title">Upcoming Events</h2>
      <p class="section-desc">
        Discover workshops, seminars, tech meetups, and competitions near you.
      </p>
    </div>

    <div class="filters-section">
      <SearchBox v-model="searchQuery" />
      <CategoryFilter v-model="selectedCategory" :categories="categories" />
    </div>

    <div v-if="filteredEvents.length > 0" class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @view-detail="handleViewDetail"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No Events Available Yet</h3>
      <p>
        There are currently no active events scheduled. Are you an organizer? Publish and manage
        your first event today through the dashboard.
      </p>
      <div class="empty-action">
        <AppButton variant="primary" @click="router.push('/dashboard')">
          Go to Organizer Dashboard
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-list-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: 2.2rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.filters-section {
  margin-bottom: var(--space-4);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.empty-state {
  padding: var(--space-12);
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
  background: white;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.empty-icon {
  margin-bottom: var(--space-3);
  font-size: 3.5rem;
}

.empty-state h3 {
  margin-bottom: var(--space-2);
  color: var(--text-main);
  font-size: 1.5rem;
}

.empty-state p {
  max-width: 600px;
  margin: 0 auto var(--space-6);
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.empty-action {
  display: flex;
  justify-content: center;
}
</style>
