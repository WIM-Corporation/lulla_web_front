import React from 'react';
import MobXStoreContext from './MobXStoreContext.js';

// custom hook
function useStores() {
  return React.useContext(MobXStoreContext);
};

export default useStores;