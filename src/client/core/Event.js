export default function Event() {
  const listeners = new Map();

  // Добавляет слушатель
  this.addEventListener = (eventType, listener) => {
    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Set());
    }
    return listeners.get(eventType).add(listener);
  }

  // Удаляет слушатель
  this.removeEventListener = (eventType, listener) => {
    if (!listeners.has(eventType)) return false;
    return listeners.get(eventType).delete(listener);
  }

  // Создаёт событие
  this.dispatchEvent = (eventType, options=[]) => {
    if (!listeners.has(eventType)) return false;
    listeners.get(eventType).forEach(v => v(...options));
  }
}