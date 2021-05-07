import { compareTwoVdom } from './react-dom';
import { isFunction } from './utils';

export let updateQueue = {
  updaters: [],
  isBatchingUpdate: false,
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    this.updaters.forEach((updater) => updater.updateComponent());
    this.isBatchingUpdate = false;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    nextProps || !updateQueue.isBatchingUpdate
      ? this.updateComponent()
      : updateQueue.add(this);
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }
  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    if (pendingStates.length) {
      pendingStates.forEach((nextState) => {
        if (isFunction(nextState)) {
          nextState = nextState.call(classInstance, state);
        }
        state = { ...state, ...nextState };
      });
      pendingStates.length = 0;
    }
    return state;
  }
}
function shouldUpdate(classInstance, nextProps, nextState) {
  let noUpdate =
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState);
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState;
  if (!noUpdate) {
    classInstance.forceUpdate();
  }
}
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
    this.nextProps = null;
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  forceUpdate() {
    if (this.componentWillUpdate) this.componentWillUpdate();
    let newVdom = this.render();
    let currentVdom = compareTwoVdom(
      this.oldVdom.dom.parentNode,
      this.oldVdom,
      newVdom
    );
    this.oldVdom = currentVdom;
    if (this.componentDidUpdate)
      this.componentDidUpdate(this.props, this.state);
  }
}
export default Component;
