const store = Object.entries(localStorage)
  .filter(([key]) => key.endsWith('Store'))
  .reduce((acc, [key, value]) => ({
    ...acc,
    [key]: JSON.parse(value),
  }), {});

window.store = store;
