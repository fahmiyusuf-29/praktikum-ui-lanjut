<script setup>
const events = Array.from({ length: 6 }, (_, index) => {
  const id = index + 1

  return {
    id,
    title: `Community Gathering ${id}`,
    date: `Oct ${10 + id}, 2026`,
    category: 'Community',
    location: 'Main Auditorium, City Center',
    desc:
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
          <p class="event-loc">{{ event.location }}</p>
          <p class="event-desc">{{ event.desc }}</p>
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
  margin-bottom: var(--space-8);
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

.event-grid {
  /* ADAPTIVE GRID: Responsive otomatis menyesuaikan lebar layar */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.event-card {
  /* BOUNDARIES: Menciptakan "Common Regions" */
  background: var(--bg-light);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.event-body {
  padding: var(--space-6);
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
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--space-2);
  font-weight: 600;
  font-size: 0.85rem;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-title {
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.event-loc {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.event-desc {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-6);
  flex-grow: 1;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
}

.btn-link {
  display: inline-block;
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.btn-link:hover {
  color: var(--primary);
}
</style>
