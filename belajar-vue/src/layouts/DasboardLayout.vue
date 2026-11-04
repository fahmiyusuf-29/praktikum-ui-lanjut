<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView, RouterLink } from 'vue-router'

const route = useRoute()
const pageTitle = computed(() =>
  route.name === 'dashboard-events' ? 'Event Management' : 'Dashboard',
)
</script>

<template>
  <div class="dashboard-layout">
    <!-- RAIL & PANE SYSTEM -->
    <aside class="dashboard-rail">
      <!-- RAIL: Navigasi samping yang posisinya terkunci (fixed) -->
      <div class="rail-brand">
        <RouterLink to="/dashboard">
          <span class="brand-mark" aria-hidden="true">G</span>
          <span>
            <strong>Gatherly</strong>
            <small>Organizer workspace</small>
          </span>
        </RouterLink>
      </div>

      <nav class="rail-nav">
        <p class="rail-label">WORKSPACE</p>
        <RouterLink to="/dashboard" class="rail-link" exact-active-class="active">
          <span class="nav-icon" aria-hidden="true">▦</span>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/dashboard/events" class="rail-link" exact-active-class="active">
          <span class="nav-icon" aria-hidden="true">◷</span>
          <span>Event Management</span>
        </RouterLink>
      </nav>

      <div class="rail-footer">
        <RouterLink to="/" class="rail-link">
          <span class="nav-icon" aria-hidden="true">↗</span>
          <span>Back to Public</span>
        </RouterLink>
      </div>
    </aside>

    <!-- PANE: Area utama dinamis yang dapat digulir secara mandiri -->
    <main class="dashboard-pane">
      <header class="pane-header">
        <div>
          <p class="header-eyebrow">GATHERLY ORGANIZER</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="user-profile">
          <span class="user-avatar">A</span>
          <span>Admin</span>
        </div>
      </header>

      <div class="pane-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Full-screen app layout dengan area konten yang dapat digulir mandiri. */
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-gray);
}

/* RAIL STYLES */
.dashboard-rail {
  width: 260px;
  flex-shrink: 0;
  background: #1c1948;
  color: white;
  display: flex;
  flex-direction: column;
}

.rail-brand {
  padding: var(--space-6) var(--space-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rail-brand a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 12px;
  background: var(--primary);
  font-size: 1.25rem;
  font-weight: 800;
}

.rail-brand strong,
.rail-brand small {
  display: block;
}

.rail-brand strong {
  font-size: 1.1rem;
}

.rail-brand small {
  margin-top: 3px;
  color: #b7b6ca;
  font-size: 0.72rem;
  font-weight: 400;
}

.rail-nav {
  flex: 1;
  padding: var(--space-6) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.rail-label {
  margin: 0 0 var(--space-2);
  padding: 0 var(--space-3);
  color: #9998ad;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.rail-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  color: #a0a0b0;
  text-decoration: none;
  font-weight: 500;
  border-radius: 10px;
  border-left: 3px solid transparent;
  transition:
    background 0.2s,
    color 0.2s;
}

.nav-icon {
  width: 22px;
  text-align: center;
  font-size: 1.1rem;
}

.rail-link:hover,
.rail-link.active {
  background: rgba(255, 255, 255, 0.09);
  color: white;
  border-left-color: var(--primary);
}

.rail-footer {
  padding: var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* PANE STYLES */
.dashboard-pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.pane-header {
  background: white;
  padding: var(--space-4) var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}

.header-eyebrow {
  margin: 0 0 var(--space-1);
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.pane-header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-main);
  font-weight: 600;
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ede9ff;
  color: var(--primary);
}

.pane-content {
  padding: var(--space-8);
}

@media (max-width: 640px) {
  .dashboard-rail {
    width: 76px;
  }

  .rail-brand {
    padding: var(--space-4) var(--space-3);
  }

  .rail-brand a {
    justify-content: center;
  }

  .rail-brand a > span:last-child,
  .rail-label,
  .rail-link > span:last-child {
    display: none;
  }

  .rail-nav {
    padding: var(--space-4) var(--space-2);
  }

  .rail-link {
    justify-content: center;
    padding: var(--space-3) var(--space-2);
  }

  .pane-content {
    padding: var(--space-4);
  }

  .pane-header {
    padding: var(--space-4);
  }
}
</style>
