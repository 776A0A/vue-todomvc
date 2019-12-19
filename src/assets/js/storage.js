const storage = window.localStorage;

export default {
  set(key, value) {
    storage.setItem(key, JSON.stringify(value));
    return this;
  },
  get(key, def) {
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : def;
  },
  remove(key) {
    storage.removeItem(key);
    return this;
  },
  clear() {
    storage.clear();
    return this;
  }
}