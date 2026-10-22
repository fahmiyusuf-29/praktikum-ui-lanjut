<script setup>
import { useRouter } from 'vue-router'
import { useEvent } from '@/Composable/UseEvent'
import AppCard from '@/components/UI/AppCard.vue'
import AppButton from '@/components/UI/AppButton.vue'

const router = useRouter()
const { events, eventStats } = useEvent()
</script>

<template>
  <div class="dashboard-overview">
    <div class="dashboard-header">
      <div>
        <h2>Organizer Analytics &amp; Overview</h2>
        <p class="subtitle">
          Get a clear, real-time view of your event statistics and track status across all managed
          events.
        </p>
      </div>
      <AppButton variant="primary" @click="router.push('/dashboard/events')">
        Manage Events
      </AppButton>
    </div>

    <div class="metrics-grid">
      <AppCard class="metric-card">
        <h3>Total Events</h3>
        <p class="metric-value">{{ eventStats.totalEvents }}</p>
        <p class="metric-hint">All recorded events</p>
      </AppCard>

      <AppCard class="metric-card">
        <h3>Active Events</h3>
        <p class="metric-value text-success">{{ eventStats.upcoming }}</p>
        <p class="metric-hint">Currently live in public catalog</p>
      </AppCard>

      <AppCard class="metric-card">
        <h3>Completed Events</h3>
        <p class="metric-value text-muted">{{ eventStats.completed }}</p>
        <p class="metric-hint">Archived events</p>
      </AppCard>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <div>
          <h3>Recent Events Status Overview</h3>
          <p class="table-subtitle">
            Track the latest inventory of all events managed across the Gatherly platform.
          </p>
        </div>
        <button class="btn-manage-link" @click="router.push('/dashboard/events')">
          Open Event Management
        </button>
      </div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Category</th>
              <th>Date &amp; Location</th>
              <th>Quota</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="events.length === 0">
              <td colspan="5" class="empty-table-cell">
                <div class="empty-table-content">
                  <div class="empty-table-icon">📅</div>
                  <p>No events recorded in the system yet.</p>
                  <AppButton variant="primary" @click="router.push('/dashboard/events')">
                    Create First Event
                  </AppButton>
                </div>
              </td>
            </tr>
            <tr v-for="item in events" :key="item.id">
              <td class="font-semibold">{{ item.title }}</td>
              <td><span class="category-badge">{{ item.category }}</span></td>
              <td>
                <div class="date-cell">{{ item.date }}</div>
                <span class="location-text">📍 {{ item.location }}</span>
              </td>
              <td>{{ item.quota }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="{
                    'status-done': item.status === 'completed',
                    'status-active': item.status !== 'completed',
                  }"
                >
                  {{ item.status === 'completed' ? 'Completed' : 'Active' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-overview {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  gap: var(--space-4);
}

.dashboard-header h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.metric-card {
  padding: var(--space-6);
  text-align: left;
}

.metric-card h3 {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-2);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.metric-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.text-success {
  color: #2ecc71 !important;
}

.text-muted {
  color: #94a3b8 !important;
}

.data-table-container {
  background: white;
  border-radius: var(--space-3);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
  font-size: 1.2rem;
  margin-bottom: var(--space-1);
}

.table-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-manage-link {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}

.btn-manage-link:hover {
  text-decoration: underline;
}

.data-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--bg-light);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.font-semibold {
  font-weight: 600;
  color: var(--text-main);
}

.category-badge {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-active {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.status-done,
.status-completed {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

.empty-table-cell {
  text-align: center;
  padding: var(--space-12) var(--space-4);
}

.empty-table-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.empty-table-icon {
  font-size: 2.5rem;
}

.empty-table-content p {
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
