import React from "react";

const AccountContext = React.createContext({
  location: true,
  setLocation: () => {}
});
export default AccountContext;