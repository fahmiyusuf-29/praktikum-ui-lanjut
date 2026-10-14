<script setup>
const events = Array.from({ length: 6 }, (_, index) => {
  const id = index + 1

  return {
    id,
    title: `Community Gathering ${id}`,
    date: `Oct ${10 + id}, 2026`,
    category: 'Community',
    location: 'Main Auditorium, City Center',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at velit vel magna interdum scelerisque.',
  }
})
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <h2 class="section-title">Upcoming Events</h2>
      <p class="section-desc">
        Discover workshops, seminars, tech meetups, and competitions near you.
      </p>
    </div>

    <!-- LAYOUT SYSTEM: ADAPTIVE GRID -->
    <div class="event-grid">
      <!-- VISUAL HIERARCHY: GROUPING & COMMON REGIONS -->
      <div class="event-card" v-for="event in events" :key="event.id">
        <div class="event-body">
          <div class="event-meta">
            <!-- LABEL CONTRAST: Recognition over Recall -->
            <span class="event-date">{{ event.date }}</span>
            <span class="event-category">{{ event.category }}</span>
          </div>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-loc">📍 {{ event.location }}</p>
          <p class="event-desc">{{ event.description }}</p>
          <div class="card-footer">
            <router-link :to="`/browse/events/${event.id}`" class="btn-link">
              View Event Details &rarr;
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.2rem;
  color: #1c1948;
  margin-bottom: 0.5rem;
}

.section-desc {
  color: #666;
  font-size: 1.1rem;
}

.event-grid {
  /* ADAPTIVE GRID: Responsive otomatis menyesuaikan lebar layar */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.event-card {
  /* BOUNDARIES: Menciptakan "Common Regions" */
  background: white;
  border-radius: var(--space-4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-color);
  transition:
    all 0.3s ease,
    border-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-5px);
  border-color: #ddd;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.event-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.event-date {
  background: rgba(102, 68, 255, 0.1);
  color: #6644ff;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
}

.event-category {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-body h3 {
  color: #1c1948;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
}

.event-loc {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.event-desc {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.btn-link {
  display: inline-block;
  color: #1c1948;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.btn-link:hover {
  color: #6644ff;
}
</style>
