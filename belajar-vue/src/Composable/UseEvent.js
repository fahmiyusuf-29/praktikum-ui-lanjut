import { ref, computed, watch } from 'vue'

const defaultEvents = []

const EVENTS_STORAGE_KEY = 'gatherly_events'
const REGISTRATIONS_STORAGE_KEY = 'gatherly_registrations'

const eventData = ref(JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]'))
const registrationData = ref(
  JSON.parse(localStorage.getItem(REGISTRATIONS_STORAGE_KEY) || '[]'),
)
const eventIdCounter = ref(100)

watch(
  eventData,
  (newEvents) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents))
  },
  { deep: true },
)

watch(
  registrationData,
  (newRegistrations) => {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(newRegistrations))
  },
  { deep: true },
)

export function useEvent() {
  const events = computed(() => eventData.value.filter((event) => !event.deleted))
  const deletedEvents = computed(() => eventData.value.filter((event) => event.deleted))

  const activeEvents = computed(() =>
    events.value.filter((event) => ['active', 'upcoming'].includes(event.status)),
  )
  const completedEvents = computed(() =>
    events.value.filter((event) => ['completed', 'done'].includes(event.status) || event.done),
  )
  const totalRegistrations = computed(() =>
    events.value.reduce((sum, event) => sum + (Number(event.registrationCount) || 0), 0),
  )

  const eventStats = computed(() => {
    const now = new Date()
    const thisMonth = events.value.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      )
    }).length

    return {
      totalEvents: events.value.length,
      upcoming: activeEvents.value.length,
      completed: completedEvents.value.length,
      draft: events.value.filter((event) => event.status === 'draft').length,
      thisMonth,
    }
  })

  if (eventData.value.length === 0) {
    eventData.value = defaultEvents
  }

  const createEvent = (input) => {
    const nextEvent = { ...input }
    const cleanLocation = nextEvent.location?.replace(/[^\w\s,-]/g, '').trim()
    const description = (input.desc ?? input.description ?? '').trim()

    nextEvent.id = Date.now()
    nextEvent.location = cleanLocation || ''
    nextEvent.date = new Date(nextEvent.date)
    nextEvent.createdAt = new Date().toISOString().slice(0, 10)
    nextEvent.eventDate = new Date(nextEvent.date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    nextEvent.desc = description
    nextEvent.description = description
    nextEvent.status = 'upcoming'
    eventData.value.unshift(nextEvent)

    return nextEvent
  }

  const completeEvent = (id) => {
    const target = events.value.find((event) => event.id === Number(id))
    if (target) {
      target.done = true
      target.status = 'completed'
    }
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
    const eventId = Number(id)
    const index = eventData.value.findIndex((event) => event.id === eventId)
    if (index !== -1) {
      eventData.value.splice(index, 1)
      registrationData.value = registrationData.value.filter(
        (registration) => registration.eventId !== eventId,
      )
    }
  }

  const registerAttendee = (eventId, participantData) => {
    const event = events.value.find((item) => item.id === Number(eventId))
    if (!event) return null

    const newRegistration = {
      id: Date.now(),
      bookingCode: `EVT-${Date.now().toString().slice(-4)}`,
      eventId: Number(eventId),
      eventTitle: event.title,
      eventDate: event.date,
      venue: event.location,
      ticket: participantData.ticket,
      quantity: Number(participantData.quantity) || 1,
      fullName: participantData.fullName?.trim(),
      email: participantData.email?.trim(),
      phone: participantData.phone?.trim(),
      dob: participantData.dob,
      date: new Date().toISOString(),
      reason: participantData.reason?.trim(),
    }

    event.quota = Math.max(0, (Number(event.quota) || 0) - 1)
    event.registrationCount = (Number(event.registrationCount) || 0) + 1
    registrationData.value.unshift(newRegistration)

    return newRegistration
  }

  const hasRegistration = (eventId) => {
    const hasRegistered = registrationData.value.some(
      (registration) => registration.eventId === Number(eventId),
    )
    if (!hasRegistered) return false

    const event = events.value.find((item) => item.id === Number(eventId))
    return event ? !event.done && !['completed', 'done'].includes(event.status) : false
  }

  const getRegistrationsByEventId = (eventId) =>
    registrationData.value.filter(
      (registration) => registration.eventId === Number(eventId),
    )

  const cancelRegistration = (registrationId) => {
    const index = registrationData.value.findIndex(
      (registration) => registration.id === Number(registrationId),
    )
    if (index === -1) return false

    const [registration] = registrationData.value.splice(index, 1)
    const event = eventData.value.find((item) => item.id === registration.eventId)
    if (event) {
      event.quota = (Number(event.quota) || 0) + 1
      event.registrationCount = Math.max(0, (Number(event.registrationCount) || 0) - 1)
    }

    return true
  }

  const clearAllEvents = () => {
    eventData.value = []
    localStorage.removeItem(EVENTS_STORAGE_KEY)
  }

  const clearAllRegistrations = () => {
    registrationData.value = []
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY)
  }

  return {
    events,
    deletedEvents,
    activeEvents,
    completedEvents,
    totalRegistrations,
    eventStats,
    createEvent,
    completeEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    permanentDelete,
    registerAttendee,
    hasRegistration,
    getRegistrationsByEventId,
    cancelRegistration,
    clearAllEvents,
    clearRegistrations: clearAllRegistrations,
    clearAllRegistrations,
  }
}
