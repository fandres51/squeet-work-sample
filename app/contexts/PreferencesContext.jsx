import React from "react";

const PreferencesContext = React.createContext({
  deck: {},
  setDeck: () => {},
  places: [],
  setPlaces: () => {}
});
export default PreferencesContext;