<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Connect, Discover, and Experience</h1>
        <p class="hero-subtitle">
          A confident event platform designed to bring ideas together. Discover hundreds of events
          near you.
        </p>
        <div class="hero-actions">
          <router-link to="/browse/events" class="btn btn-primary">Discover Events</router-link>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="features-header">
        <h2>Why Choose Gatherly?</h2>
        <p>Everything you need to host or attend unforgettable events.</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Discover Easily</h3>
          <p>Find events tailored to your interests using our smart category and location filters.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎟️</div>
          <h3>Seamless Ticketing</h3>
          <p>Register with one click and get your digital QR ticket instantly on your device.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Host Like a Pro</h3>
          <p>Manage attendees, track revenue, and scan QR codes with our comprehensive dashboard.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  width: 100%;
  max-width: 1100px;
  margin-inline: auto;
  animation: fadeIn 0.5s ease;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: var(--space-12) var(--space-8);
  background: #f8f9fa;
  border-radius: 24px;
  border: 1px solid #eee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.hero-content {
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, auto);
  grid-template-areas:
    'title title'
    'subtitle actions';
  align-items: end;
  gap: var(--space-8);
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f0f0ff;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6644ff;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

.hero-title {
  grid-area: title;
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1c1948;
  margin: 0;
  max-width: 14ch;
}

.hero-subtitle {
  grid-area: subtitle;
  font-size: 1.15rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
  max-width: 600px;
}

.hero-actions {
  grid-area: actions;
  display: flex;
  gap: 1rem;
  justify-self: end;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #6644ff;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 68, 255, 0.2);
}

.btn-primary:hover {
  background: #5533e8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #1c1948;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  border-color: #6644ff;
  color: #6644ff;
  transform: translateY(-2px);
}

.features-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.features-header {
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-8);
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-color: #ddd;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: #1c1948;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.sitemap-visual {
  padding: 3rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.sitemap-visual h2 {
  color: #1c1948;
  margin-bottom: 0.5rem;
}

.sitemap-desc {
  color: #666;
  margin-bottom: 2.5rem;
}

.tree,
.tree ul {
  list-style: none;
  padding-left: 20px;
}

.tree li {
  margin: 12px 0;
  position: relative;
}

.tree li::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -12px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  width: 10px;
  height: 23px;
}

.tree li:last-child::before {
  border-left: none;
}

.tree a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 8px;
  display: inline-block;
  transition: all 0.2s;
  background: white;
  border: 1px solid #eee;
}

.tree a:hover {
  border-color: #ccc;
  color: #1c1948;
}

.tree .router-link-active {
  background: #6644ff;
  color: white;
  border-color: #6644ff;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 80svh;
    padding: var(--space-8) var(--space-4);
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    justify-self: auto;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
