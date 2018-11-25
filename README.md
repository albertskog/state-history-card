# State History Card
This is a card for the Home Assistant UI, Lovelace. The card shows all state changes for a given entity.

# Setup
* Place the .js-file from here under Home Assistant's `config/www/`
* Add the following to `ui-lovelace.yaml`:

  ```yaml
  resources:
	  - url: /local/state-history-card/state-history-card.js
	    type: js
    
  views:
	  - title: Location
	    id: location
	    cards:
	      - type: "custom:state-history-card"
	        entity: device_tracker.alberts_phone
  ```