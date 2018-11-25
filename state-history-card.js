class StateHistoryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
    const entity = hass.states[this.config.entity];
    if (entity && this.entity !== entity) {
      this.entity = entity;
      this.getHistory();
    }
  }
  
  async getHistory({config} = this) {
    const root = this.shadowRoot;
    const startTime = new Date();
    startTime.setHours(0);
    const stateHistory = await this.fetchRecent(config.entity, startTime);
    root.querySelector("ha-card").header = stateHistory[0][0].attributes.friendly_name;
    root.getElementById("date").innerHTML = (new Date(stateHistory[0][0].last_changed)).toLocaleDateString();
    const options = { hour: '2-digit', minute: '2-digit' };
    var lastZone = '';
    for (let event of stateHistory[0]) {
      var zone = event.state;
      if (zone === lastZone) {
        continue;
      }
      lastZone = zone;
      var timestamp = new Date(event.last_changed);
      var line = `${timestamp.toLocaleTimeString('sv-SE', options)} - ${zone}<br>`;
      root.getElementById("events").innerHTML += line;
    }
  }

  async fetchRecent(entityId, startTime, endTime) {
    let url = 'history/period';
    if (startTime) url += '/' + startTime.toISOString();
    url += '?filter_entity_id=' + entityId;
    if (endTime) url += '&end_time=' + endTime.toISOString();
    return await this._hass.callApi('GET', url);
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);
    
    this.config = config;

    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const date = document.createElement('div');
    date.id = 'date';
    const events = document.createElement('div');
    events.id = 'events';
    content.appendChild(date);
    content.appendChild(events);
    card.appendChild(content);

    const style = document.createElement('style');
    style.textContent = `
      ha-card {
        padding: 0 16px 16px;
      }
      #event {
        color: var(--primary-text-color);
      }
      #date {
        color: var(--secondary-text-color);
      }
    `;
    
    card.appendChild(style);
    root.appendChild(card);
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('state-history-card', StateHistoryCard);