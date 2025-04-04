export function loadFromLocalStorage() {
  const savedData = localStorage.getItem('tpv_data');
  return savedData ? JSON.parse(savedData).categories || [] : [];
}

export function saveToLocalStorage(categories) {
  localStorage.setItem('tpv_data', JSON.stringify({ categories }));
}