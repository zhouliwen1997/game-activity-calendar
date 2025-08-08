const app = Vue.createApp({
  data() {
    return {
      events: [],
      games: ['All Games', '原神', '崩坏：星穹铁道'],
      selectedGame: 'All Games',
      selectedStatus: ['upcoming', 'ongoing', 'ended'],
      viewMode: 'calendar',
      selectedEvent: null,
      showForm: false,
      editData: null
    };
  },
  computed: {
    filteredEvents() {
      return this.events
        .filter(e => this.selectedGame === 'All Games' || e.game === this.selectedGame)
        .filter(e => this.selectedStatus.includes(e.status));
    }
  },
  methods: {
    loadEvents() {
      const saved = localStorage.getItem('gameEvents');
      if (saved) {
        this.events = JSON.parse(saved);
      } else {
        this.events = [{
          id: Date.now(),
          title: "测试活动示例",
          game: "原神",
          startDate: this.today(),
          endDate: this.addDays(3),
          status: "ongoing"
        }];
        this.saveEvents();
      }
      this.updateStatuses();
    },
    today() { return new Date().toISOString().split('T')[0]; },
    addDays(n) {
      const d = new Date();
      d.setDate(d.getDate() + n);
      return d.toISOString().split('T')[0];
    },
    saveEvents() { localStorage.setItem('gameEvents', JSON.stringify(this.events)); },
    updateStatuses() {
      const today = new Date();
      this.events.forEach(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        if (today < start) e.status = 'upcoming';
        else if (today > end) e.status = 'ended';
        else e.status = 'ongoing';
      });
      this.saveEvents();
    },
    selectEvent(ev) { this.selectedEvent = ev; },
    saveEvent(ev) {
      if (ev.id) {
        const idx = this.events.findIndex(e => e.id === ev.id);
        if (idx > -1) this.events[idx] = ev;
      } else {
        ev.id = Date.now();
        this.events.push(ev);
      }
      this.showForm = false;
      this.editData = null;
      this.updateStatuses();
    },
    deleteEvent(id) {
      this.events = this.events.filter(e => e.id !== id);
      this.selectedEvent = null;
      this.saveEvents();
    },
    editEvent(ev) {
      this.editData = { ...ev };
      this.showForm = true;
    }
  },
  mounted() { this.loadEvents(); }
});
app.mount('#app');
