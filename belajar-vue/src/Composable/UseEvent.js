import { ref, computed, watch } from 'vue';

// STORAGE KEYS
const EVENTS_STORAGE_KEY = 'gatherly_events';
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations';

// REST API CONFIGURATION
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl ? envUrl.trim().replace(/\/+$/, '') : '';
};

const isApiConfigured = (baseUrl) => {
  if (!baseUrl || /x{4,}/i.test(baseUrl)) return false;

  try {
    const url = new URL(baseUrl);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const normalizeEvent = (event) => {
  const category = event.cat ?? event.category ?? 'General';
  const location = event.loc ?? event.location ?? '';
  const done = Boolean(event.done || ['completed', 'done'].includes(event.status));

  return {
    ...event,
    cat: category,
    category,
    loc: location,
    location,
    done,
    status: done ? 'completed' : (event.status ?? 'active'),
  };
};

// STATE SINGLETON TERPUSAT
const savedData = localStorage.getItem(EVENTS_STORAGE_KEY);
const events = ref(savedData ? JSON.parse(savedData).map(normalizeEvent) : []);

const savedRegs = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
const userRegistrations = ref(savedRegs ? JSON.parse(savedRegs) : []);

// ASYNCHRONOUS NETWORK STATES (MODUL 6)
const loading = ref(false);
const error = ref(null);

// WATCHERS (Sinkronisasi status lokal ke LocalStorage sebagai cache preferensi)
watch(
  events,
  (newEvents) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
  },
  { deep: true },
);

watch(
  userRegistrations,
  (newRegs) => {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(newRegs));
  },
  { deep: true },
);

export function useEvents() {
  // DERIVED STATE (Dihitung otomatis menggunakan computed)
  const totalEvents = computed(() => events.value.length);
  const activeEvents = computed(() => events.value.filter((e) => !e.done));
  const completedEvents = computed(() => events.value.filter((e) => e.done));
  const totalRegistrations = computed(() => userRegistrations.value.length);
  const eventStats = computed(() => ({
    totalEvents: totalEvents.value,
    upcoming: activeEvents.value.length,
    completed: completedEvents.value.length,
  }));

  // 1. HTTP GET: MENGAMBIL SELURUH DATA ACARA DARI REST API
  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    const baseUrl = getApiBaseUrl();

    // Validasi apakah endpoint MockAPI sudah dikonfigurasi di file .env
    if (!isApiConfigured(baseUrl)) {
      loading.value = false;
      return events.value;
    }

    try {
      const response = await fetch(`${baseUrl}/events`);
      if (!response.ok) {
        throw new Error(
          `Gagal mengambil data dari server (Status HTTP: ${response.status} ${response.statusText || ''})`,
        );
      }
      const data = await response.json();
      events.value = Array.isArray(data) ? data.map(normalizeEvent) : [];
      return events.value;
    } catch (err) {
      error.value = err.message || 'Terjadi kegagalan jaringan saat menghubungi server API.';
    } finally {
      loading.value = false;
    }
  };

  // 2. HTTP GET BY ID: MENGAMBIL RINCIAN ACARA BERDASARKAN ID
  const fetchEventById = async (id) => {
    if (!id) return null;
    const strId = String(id);

    // Cek terlebih dahulu di memory state
    const existing = events.value.find((e) => String(e.id) === strId);
    if (existing) return existing;

    const baseUrl = getApiBaseUrl();
    if (!isApiConfigured(baseUrl)) {
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${baseUrl}/events/${strId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Acara tidak ditemukan pada server.');
        }
        throw new Error(`Gagal mengambil detail acara (Status HTTP: ${response.status})`);
      }

      const eventData = normalizeEvent(await response.json());

      // Simpan ke daftar state jika belum ada
      if (!events.value.some((e) => String(e.id) === String(eventData.id))) {
        events.value.push(eventData);
      }

      return eventData;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 3. HTTP POST: MEMBUAT DATA ACARA BARU KE REST API
  const createEvent = async (eventData) => {
    loading.value = true;
    error.value = null;

    const cleanLoc = (eventData.loc || eventData.location || '').replace(/[^\w\s,.-]/g, '').trim();
    const payload = normalizeEvent({
      title: (eventData.title || '').trim(),
      date: eventData.date,
      loc: cleanLoc,
      cat: eventData.cat || eventData.category || 'General',
      quota: Number(eventData.quota) || 100,
      price: eventData.price || 'Free',
      desc: (eventData.desc || eventData.description || '').trim(),
      done: false,
    });

    const baseUrl = getApiBaseUrl();

    try {
      // Jika endpoint sudah aktif, kirim HTTP POST
      if (isApiConfigured(baseUrl)) {
        const response = await fetch(`${baseUrl}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Gagal menyimpan acara ke server (Status HTTP: ${response.status})`);
        }

        const createdEvent = normalizeEvent(await response.json());
        events.value.unshift(createdEvent);
        return createdEvent;
      } else {
        // Simulasi jika belum terhubung MockAPI
        const localCreated = { ...payload, id: String(Date.now()) };
        events.value.unshift(localCreated);
        return localCreated;
      }
    } catch (err) {
      error.value = err.message || 'Gagal menyimpan data ke server API.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 4. HTTP DELETE: MENGHAPUS ACARA DARI SERVER & MEMBERSIHKAN TIKET TERKAIT
  const deleteEvent = async (id) => {
    const strId = String(id);
    loading.value = true;
    error.value = null;

    const baseUrl = getApiBaseUrl();

    try {
      if (isApiConfigured(baseUrl)) {
        const response = await fetch(`${baseUrl}/events/${strId}`, {
          method: 'DELETE',
        });

        if (!response.ok && response.status !== 404) {
          throw new Error(`Gagal menghapus acara dari server (Status HTTP: ${response.status})`);
        }
      }

      // Hapus data dari state lokal
      events.value = events.value.filter((e) => String(e.id) !== strId);

      // Cascading cleanup untuk tiket pendaftaran
      userRegistrations.value = userRegistrations.value.filter(
        (r) => String(r.eventId) !== strId,
      );
    } catch (err) {
      error.value = err.message || 'Gagal menghapus acara dari server';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 5. MUTASI STATE: TANDAI ACARA SELESAI
  const completeEvent = async (id) => {
    const strId = String(id);
    const target = events.value.find((e) => String(e.id) === strId);
    const baseUrl = getApiBaseUrl();

    if (isApiConfigured(baseUrl)) {
      const response = await fetch(`${baseUrl}/events/${strId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: true }),
      });

      if (!response.ok) {
        throw new Error(`Gagal memperbarui status acara (Status HTTP: ${response.status})`);
      }
    }

    if (target) Object.assign(target, normalizeEvent({ ...target, done: true }));
  };

  // 6. PENCARIAN DATA SINKRON DARI STATE
  const getEventById = (id) => {
    return events.value.find((e) => String(e.id) === String(id));
  };

  // 7. PENDAFTARAN PESERTA
  const registerAttendee = (eventId, participantData) => {
    const strId = String(eventId);
    const event = events.value.find((e) => String(e.id) === strId);
    if (!event || event.quota <= 0) return null;

    const bookingCode = 'GTH-' + Date.now().toString().slice(-4);
    const regRecord = {
      id: Date.now(),
      eventId: strId,
      eventTitle: event.title,
      eventCat: event.cat,
      eventDate: event.date,
      eventLoc: event.loc,
      bookingCode,
      registeredAt: new Date().toISOString(),
      date: new Date().toISOString(),
      fullName: participantData.fullName.trim(),
      email: participantData.email.trim(),
      phone: participantData.phone.trim(),
      dob: participantData.dob,
      reason: participantData.reason.trim(),
    };

    // Kurangi kuota event secara reaktif
    event.quota = Math.max(0, event.quota - 1);

    // Simpan pendaftaran ke riwayat registrasi pengguna
    userRegistrations.value.unshift(regRecord);

    return regRecord;
  };

  // 8. HELPER CEK STATUS PENDAFTARAN
  const isUserRegistered = (eventId) => {
    const strId = String(eventId);
    const eventExists = events.value.some((e) => String(e.id) === strId);
    if (!eventExists) return false;
    return userRegistrations.value.some((r) => String(r.eventId) === strId);
  };

  // 9. MENGAMBIL DATA TIKET BERDASARKAN EVENT ID
  const getRegistrationByEventId = (eventId) => {
    return userRegistrations.value.filter((r) => String(r.eventId) === String(eventId));
  };

  const getRegistrationsByEventId = getRegistrationByEventId;

  // 10. PEMBATALAN PENDAFTARAN
  const cancelRegistration = (registrationId) => {
    const strId = String(registrationId);
    let regIdx = userRegistrations.value.findIndex((r) => String(r.id) === strId);
    if (regIdx === -1) {
      regIdx = userRegistrations.value.findIndex((r) => String(r.eventId) === strId);
    }

    if (regIdx !== -1) {
      const [registration] = userRegistrations.value.splice(regIdx, 1);

      const event = events.value.find((e) => String(e.id) === String(registration.eventId));
      if (event) {
        event.quota += 1;
      }
      return true;
    }
    return false;
  };

  // 11. RESET DATA PENGUJIAN PRAKTIKUM
  const clearAllEvents = () => {
    events.value = [];
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  };

  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };

  return {
    events,
    eventStats,
    loading,
    error,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    fetchEvents,
    fetchEventById,
    createEvent,
    deleteEvent,
    completeEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    getRegistrationsByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations,
  };
}

export const useEvent = useEvents;
