import { ref, computed, watch } from 'vue'

// Data awal kosong agar state dapat diisi melalui fitur CRUD.
const defaultEvents = []

const STORAGE_KEY = 'gatherly_events'
const eventData = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const eventIdCounter = ref(100)

watch(
  eventData,
  (newEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents))
  },
  { deep: true },
)

export function useEvent() {
  const events = computed(() => eventData.value.filter((event) => !event.deleted))
  const deletedEvents = computed(() => eventData.value.filter((event) => event.deleted))

  const eventStats = computed(() => {
    const totalEvents = events.value.length
    const upcoming = events.value.filter((event) => event.status === 'upcoming').length
    const completed = events.value.filter((event) => event.status === 'completed').length
    const draft = events.value.filter((event) => event.status === 'draft').length
    const now = new Date()
    const thisMonth = events.value.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      )
    }).length

    return { totalEvents, upcoming, completed, draft, thisMonth }
  })

  if (eventData.value.length === 0) {
    eventData.value = defaultEvents
  }

  const addEvent = (event) => {
    const newEvent = { ...event, id: eventIdCounter.value++ }
    eventData.value.push(newEvent)
    return newEvent
  }

  const updateEvent = (id, updatedData) => {
    const index = eventData.value.findIndex((event) => event.id === Number(id))
    if (index !== -1) {
      eventData.value[index] = { ...eventData.value[index], ...updatedData }
    }
  }

  const deleteEvent = (id) => {
    const target = eventData.value.find((event) => event.id === Number(id))
    if (target) {
      target.deleted = true
    }
  }

  const permanentDelete = (id) => {
    const index = eventData.value.findIndex((event) => event.id === Number(id))
    if (index !== -1) {
      eventData.value.splice(index, 1)
    }
  }

  const clearAllEvents = () => {
    eventData.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    events,
    deletedEvents,
    eventStats,
    addEvent,
    updateEvent,
    deleteEvent,
    permanentDelete,
    clearAllEvents,
  }
}