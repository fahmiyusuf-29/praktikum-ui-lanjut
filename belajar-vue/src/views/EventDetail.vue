<template>
  <div class="event-detail-page">
    <button @click="$router.push('/browse/events')" class="btn-back">← Back to Events</button>

    <div class="detail-header">
      <div class="header-content">
        <span class="event-tag">Workshop &amp; Training</span>
        <h1>Vue.js Mastery Workshop {{ $route.params.id }}</h1>
        <div class="meta-info">
          <span class="meta-item">📅 October 12, 2026</span>
          <span class="meta-item">📍 Tech Hub, Jakarta Pusat</span>
          <span class="meta-item">👥 Quota: 150 Attendees</span>
        </div>
      </div>
    </div>

    <!-- ASYMMETRICAL LAYOUT -->
    <div class="detail-content grid-asymmetric">
      <!-- F-PATTERN: Breaking text with Headings & Bullet Points -->
      <div class="main-desc">
        <h2>About This Event</h2>
        <p>
          Welcome to the biggest web interface development training event of the year! Gatherly is
          collaborating with the local developer community to host a comprehensive workshop
          designed specifically to bring together professionals, enthusiasts, and students.
        </p>
        <p>
          In this session, we will discuss various current industry challenges, dissect the
          implementation of Single Page Applications (SPA), and practice hands-on Layout System
          design prioritizing visual hierarchy. You will gain practical insights that can be
          directly applied to your future projects or career.
        </p>

        <div class="agenda">
          <h2>Event Agenda</h2>
          <ul class="agenda-list">
            <li><strong>09:00 AM</strong> - Registration &amp; QR Check-in Scanning</li>
            <li><strong>10:00 AM</strong> - Session 1: Vue Router &amp; Navigation Fundamentals</li>
            <li><strong>11:30 AM</strong> - Coffee Break &amp; Networking Session</li>
            <li><strong>01:00 PM</strong> - Session 2: Layout System &amp; Grid Implementation</li>
            <li><strong>03:00 PM</strong> - Q&amp;A Closing Remarks</li>
          </ul>
        </div>
      </div>

      <!-- FOCAL POINT & STICKY PANE -->
      <div class="sidebar">
        <div class="ticket-card sticky-pane">
          <h3>Attendee Registration</h3>
          <p class="price">Free</p>
          <p class="ticket-desc">Secure your seat now before the quota is full.</p>
          <!-- STRONGEST FOCAL POINT -->
          <button class="btn-register">Register Now</button>
          <p class="spots">Only 12 seats left!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: var(--space-6);
  transition: color 0.2s;
  padding: 0;
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
}

.header-content {
  max-width: 800px;
}

.event-tag {
  display: inline-block;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--space-2);
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: var(--space-4);
}

.header-content h1 {
  color: var(--text-main);
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-weight: 500;
}

.detail-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.grid-asymmetric {
  /* Rasio lebar 2:1, setara 8:4 pada grid 12 kolom */
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc {
  min-width: 0;
}

.main-desc h2 {
  color: var(--text-main);
  margin-bottom: var(--space-4);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-desc h2::before {
  content: '';
  display: block;
  width: 4px;
  height: 30px;
  background: var(--primary);
  border-radius: 2px;
}

.main-desc p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-4);
  font-size: 1.05rem;
}

.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-list li {
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 1.05rem;
}

.sidebar {
  min-width: 0;
}

.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card {
  background: var(--bg-light);
  padding: var(--space-6);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  text-align: center;
}

.ticket-card h3 {
  color: var(--text-main);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.ticket-desc {
  color: var(--text-muted);
  margin-bottom: var(--space-8);
}

.btn-register {
  width: 100%;
  padding: var(--space-4);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-register:hover {
  background: var(--primary-hover);
}

.spots {
  margin-top: var(--space-4);
  color: #e63946;
  font-weight: 600;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .grid-asymmetric {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .sticky-pane {
    position: static;
  }

  .header-content h1 {
    font-size: 2.2rem;
  }
}
</style>
