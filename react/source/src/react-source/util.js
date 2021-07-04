export function isFunction(virtualDOM) {
  return virtualDOM && typeof virtualDOM.type === "function"
}
