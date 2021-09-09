export default function createChannel() {
  let listeners = []
  return {
    take(type, listener) {
      listener.type = type
      listener.cancel = () =>
        (listeners = listeners.filter((l) => l !== listener))
      listeners.push(listener)
    },
    put(action) {
      listeners.forEach((listener) => {
        if (listener.type === action.type) {
          listener.cancel()
          listener(action)
        }
      })
    },
  }
}
