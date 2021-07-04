import { diff } from "./react-dom";
export const updateQueue = {
  isBatchingUpdate: false,
  updaters: [],
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    // 发射组件更新命令 该函数由 event.js 执行
    this.updaters.forEach((updater) => updater.updateComponent());
    this.isBatchingUpdate = false;
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  addState(state) {
    this.pendingStates.push(state);
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
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState.call(classInstance, state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
  }
}
function shouldUpdate(classInstance, nextProps, nextState) {
  let noUpdate = !classInstance.shouldComponentUpdate(nextProps, nextState);
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState;
  if (!noUpdate) {
    classInstance.forceUpdate();
  }
}
export default class Component {
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
  }
  setState(state) {
    this.updater.addState(state);
    // this.state = Object.assign({}, this.state, state);
    // // 获取最新的要渲染的 virtualDOM 对象
    // let virtualDOM = this.render();
    // // 获取旧的 virtualDOM 对象 进行比对
    // let oldDOM = this.getDOM();
    // // 获取容器
    // let container = oldDOM.parentNode;
    // // 实现对象
    // diff(virtualDOM, container, oldDOM);
  }
  forceUpdate() {
    this.componentWillUpdate();
    let virtualDOM = this.render();
    let extraArgs =
      this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
    let oldDOM = this.getDOM();
    let container = oldDOM.parentNode;
    diff(virtualDOM, container, oldDOM);
    this.componentDidUpdate(this.props, this.state, extraArgs);
  }
  setDOM(dom) {
    this._dom = dom;
  }
  getDOM() {
    return this._dom;
  }
  updateProps(props) {
    this.props = props;
  }
  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, preState) {}
  componentWillUnmount() {}
}
