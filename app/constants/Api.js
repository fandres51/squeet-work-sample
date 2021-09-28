import Constants from 'expo-constants';

const apiBase = Constants.manifest.env ?
  Constants.manifest.env.EXPO_SQUEET_API : Constants.manifest.extra.apiBase;


export default { apiBase };