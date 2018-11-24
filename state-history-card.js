class StateHistoryCard extends HTMLElement {

    set hass(hass) {
      this.render();
      this._hass = hass;
      const entity = hass.states[this.config.entity];
      if (entity && this.entity !== entity) {
        this.entity = entity;
        this.getHistory();
      }
    }
    
    async getHistory({config} = this) {
      const startTime = new Date();
      startTime.setHours(0);
      const stateHistory = await this.fetchRecent(config.entity, startTime);
      console.log(stateHistory);
      for (let event of stateHistory[0]) {
        var zone = event.state;
        var timestamp = new Date(event.last_changed);
        var line = timestamp.toLocaleString() + ": " + zone + "<br>";
  
        this.content.innerHTML += line;
      }
    }
  
    async fetchRecent(entityId, startTime, endTime) {
      let url = 'history/period';
      if (startTime) url += '/' + startTime.toISOString();
      url += '?filter_entity_id=' + entityId;
      if (endTime) url += '&end_time=' + endTime.toISOString();
      return await this._hass.callApi('GET', url);
    }
  
    render() {
      if(this.content) return;
      
      const card = document.createElement('ha-card');
      card.header = 'Example card';
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);
      const entityId = this.config.entity;
      this.content.innerHTML = `<h2>${entityId}<h2>`;
    }
  
    setConfig(config) {
      if (!config.entity) {
        throw new Error('You need to define an entity');
      }
      this.config = config;
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define('state-history-card', StateHistoryCard);