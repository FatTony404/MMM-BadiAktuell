Module.register("MMM-RecyclingCalendar", {
    
  defaults: {
    zipCode: 8047, 
    daysToDisplay: 7,  
    url: "http://openerz.metaodi.ch/api/calendar.json",
    sort: "date",
    showDate: "daysAndDate",
    showTypes: "",
    showStations: false,
    showExplanation: false, 
    showColorIcons: false,
    limitEntries: "50", 
    showUpdateHint: true,
    pollFrequency: 10 * 60 * 1000, // every 10 minutes 
  },
  

  // define required style sheets 
  getStyles: function () {
    return ["MMM-RecyclingCalendar.css"];
  },  
  
  // define required scripts
  getScripts: function(){
    return ["moment.js"]
  },

  getTranslations: function(){
    return {
      en: "translations/en.json", 
      de: "translations/de.json"
    }
  },
    
  start: function (){ // is executed when module is loaded successfully 
    Log.info('Starting module: ' + this.name);

    // setting locale
    moment.locale(config.language);

    this.calendarData = [];
    this.init = true;
    this.pollTime; 
    this.hideTime = 30000; // hides update hint after given time 

    this.getRecyclingData();
    var self = this; 
    setInterval(function() {
      self.getRecyclingData();
      self.pollTime = moment().format('HH:mm:ss');
    }, this.config.pollFrequency);
  },

  getRecyclingData: function(){
    this.sendSocketNotification('CALENDAR_GET', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    // Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);

    if(notification == "CALENDAR_RESULT" && payload['result'].length >= 0){
      this.calendarData = payload['result'];    
      this.updateDom(1000);
    } else if (notification == "CALENDAR_ERROR"){
      this.updateDom(1000);    
    }
  },

  svgIconFactory: function(type) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttributeNS(null, "class", "entry-icon " + type);
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    if(this.config.showColorIcons){
      use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("icons/icon_sprite_color.svg#") + type);
    } else {
      use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("icons/icon_sprite.svg#") + type);
    }
    
    svg.appendChild(use);
    return(svg);

  },

  getDom: function() {
    var wrapper = document.createElement("div");
    var header = document.createElement("header");
    var name = document.createElement("span");
    name.innerHTML = "" + this.translate("HEADER");
    header.appendChild(name);
    wrapper.appendChild(header);

    if(this.init == true){
      wrapper.innerHTML = this.translate("FETCHING"); 
      wrapper.className = "dimmed light small"; 
      this.init = false; 
      return wrapper; 
    }

    if(this.calendarData.length == 0){
      wrapper.innerHTML = this.translate("NO_RESULTS"); 
      wrapper.className = "light small"; 
      return wrapper; 
    }

    var today = moment();
    var tomorrow = moment().add(1, 'days');
    for(var i = 0; i<this.calendarData.length; i++){
      var entry = this.calendarData[i];

      var entriesContainer = document.createElement("div");
      entriesContainer.classList.add("entries-container");

      // add date 
      var dateContainer = document.createElement("span");
      dateContainer.classList.add("entry-date");
      var date = entry['date'];
      switch(this.config.showDate){
        case 'inDays': 
          date = moment(date, 'YYYY-MM-DD').format('dddd');
          break;
        case 'shortDate':
          date = moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
          break; 
        case 'daysAndDate':
          date = moment(date, 'YYYY-MM-DD').format('dddd, DD.MM.YYYY');          
          if (date == today.format('dddd, DD.MM.YYYY')){
            dateContainer.innerHTML = this.translate("TODAY")+", "+date; 
          } else if (date == tomorrow.format('dddd, DD.MM.YYYY')){
            dateContainer.innerHTML = this.translate("TOMORROW")+", "+date;
          } else {
            dateContainer.innerHTML = date; 
          }
          break;
      }
      entriesContainer.appendChild(dateContainer);

      // TODO add translations
      // add icon for type 
      var iconContainer = document.createElement("span");
      iconContainer.classList.add("entry-icon-container"); 
      if(this.config.showExplanation){
        iconContainer.appendChild(this.svgIconFactory(entry['type']));
        var expl = document.createElement("span");
        expl.className = "light xsmall";
        expl.innerHTML = "  - "+this.translate(entry['type'].toUpperCase()); 
        iconContainer.appendChild(expl);
      } else {
        iconContainer.appendChild(this.svgIconFactory(entry['type']));
      }
      entriesContainer.appendChild(iconContainer);
      
      // add station 
      if(this.config.showStations && entry['station']){
        var stationContainer = document.createElement("div");
        stationContainer.className = "xsmall light";
        stationContainer.innerHTML = entry['station'];
        entriesContainer.appendChild(stationContainer);  
      }
      
      wrapper.appendChild(entriesContainer);
    }

    // add update hint 
    if(this.config.showUpdateHint && this.pollTime !== undefined){
      var updateHint = document.createElement('div');
      updateHint.className = 'xsmall dimmed italic'; 
      updateHint.innerHTML = 'last update fetched at '+this.pollTime+'.'; 

      setTimeout(function() {
        updateHint.style.display='none';
      }, this.hideTime);

      wrapper.appendChild(updateHint);
    }

    return wrapper;
  },
});