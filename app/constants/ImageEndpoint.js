import Constants from 'expo-constants';

const apiBase = Constants.manifest.env ?
  Constants.manifest.env.EXPO_SQUEET_IMAGES : Constants.manifest.extra.imageBase;

export default { apiBase };