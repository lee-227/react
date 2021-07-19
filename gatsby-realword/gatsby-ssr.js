const React = require("react")
const { Provider } = require("react-redux")
const createStore = require("./src/store/createStore").default

exports.wrapRootElement = ({ element }) => {
  return <Provider store={createStore()}>{element}</Provider>
}
