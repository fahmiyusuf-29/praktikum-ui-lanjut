<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<div class="dashboard-layout">
		<!-- RAIL & PANE SYSTEM -->
		<aside class="dashboard-rail">
			<!-- RAIL: Navigasi samping yang posisinya terkunci (fixed) -->
			<div class="rail-brand">
				<RouterLink to="/">Gatherly Organizer</RouterLink>
			</div>

			<nav class="rail-nav">
				<RouterLink to="/dashboard" class="rail-link active">Overview</RouterLink>
				<a href="#" class="rail-link">Attendees</a>
				<a href="#" class="rail-link">QR Check-in</a>
			</nav>

			<div class="rail-footer">
				<RouterLink to="/" class="rail-link">← Back to Public</RouterLink>
			</div>
		</aside>

		<!-- PANE: Area utama dinamis yang dapat digulir secara mandiri -->
		<main class="dashboard-pane">
			<header class="pane-header">
				<h1>Dashboard</h1>
				<div class="user-profile">Admin</div>
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
	padding: var(--space-6);
	font-size: 1.2rem;
	font-weight: 700;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rail-brand a {
	color: white;
	text-decoration: none;
}

.rail-nav {
	flex: 1;
	padding: var(--space-6) 0;
	display: flex;
	flex-direction: column;
}

.rail-link {
	padding: var(--space-3) var(--space-6);
	color: #a0a0b0;
	text-decoration: none;
	font-weight: 500;
	border-left: 4px solid transparent;
	transition:
		background 0.2s,
		color 0.2s;
}

.rail-link:hover,
.rail-link.active {
	background: rgba(255, 255, 255, 0.05);
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
	border-bottom: 1px solid var(--border-color);
}

.pane-header h1 {
	font-size: 1.5rem;
	margin: 0;
}

.pane-content {
	padding: var(--space-8);
}

@media (max-width: 640px) {
	.dashboard-rail {
		width: 190px;
	}

	.pane-content {
		padding: var(--space-4);
	}
}
</style>
