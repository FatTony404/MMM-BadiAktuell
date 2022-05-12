# MMM-BadiAktuell
Module to display watertemperatures of Zurichs public baths

Data source: 
- https://data.stadt-zuerich.ch/dataset/wassertemperaturen-freibaeder
- https://data.stadt-zuerich.ch/dataset/wassertemperaturen-freibaeder/resource/548d1ceb-1daf-4cf9-a14a-92c86326824d

## Installation - todo 
Clone this repository in your modules folder, and install dependencies:

```
cd ~/MagicMirror/modules 
git clone https://github.com/FatTony404/MMM-RecyclingCalendar.git
cd MMM-RecyclingCalendar
npm install 
```

## Configuration - todo 
Go to the MagicMirror/config directory and edit the config.js file. Add the module to your modules array in your config.js.

```
{
  module: "MMM-RecyclingCalendar",
  position: "top_left",
  header: "Recycling Calendar",
  config: {
    zipCode: 8001, 
    daysToDisplay: 7,
    showStations: true,
    showExplanation: true, 
    showTypes: ['cardboard', 'waste', 'organic'],
    showDate: "daysAndDate",
    showColorIcons: true, 
  }
}
```