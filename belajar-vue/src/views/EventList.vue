<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import EventCard from '@/components/Event/EventCard.vue'
import SearchBox from '@/components/Event/SearchBox.vue'
import CategoryFilter from '@/components/Event/CategoryFilter.vue'
import AppButton from '@/components/UI/AppButton.vue'

const router = useRouter()
const { activeEvents, hasRegistration } = useEvent()

const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Technology', 'Music', 'Workshop', 'Competition', 'Seminar', 'Conference']

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return activeEvents.value.filter((event) => {
    const title = (event.title || '').toLowerCase()
    const description = (event.desc || event.description || '').toLowerCase()
    const matchesQuery = title.includes(query) || description.includes(query)
    const matchesCategory =
      selectedCategory.value === 'All' || event.category === selectedCategory.value

    return matchesQuery && matchesCategory
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

    <div v-if="filteredEvents.length" class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :is-registered="hasRegistration(event.id)"
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
  margin-bottom: var(--space-6);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-8);
  background: white;
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
  max-width: 680px;
  margin: var(--space-8) auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.empty-icon {
  display: inline-block;
  padding: var(--space-3);
  background: var(--bg-light);
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  border-radius: 50%;
  margin-bottom: var(--space-4);
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.empty-state p {
  line-height: 1.6;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-size: 1rem;
}

.empty-action {
  display: flex;
  justify-content: center;
}
</style>
