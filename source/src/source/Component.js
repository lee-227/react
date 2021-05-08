import { compareTwoVdom } from './react-dom'
import { isFunction } from './utils'

// 更新队列，发布订阅模式
export let updateQueue = {
  updaters: [],
  isBatchingUpdate: false,
  add(updater) {
    // 存放所有需要更新的组件
    this.updaters.push(updater)
  },
  batchUpdate() {
    // 发射组件更新命令 该函数由 event.js 执行
    this.updaters.forEach((updater) => updater.updateComponent())
    this.isBatchingUpdate = false
  },
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingStates = []
  }
  addState(partialState) {
    // 将每次 setState 传入的 state 对象 存入待更新队列
    this.pendingStates.push(partialState)
    // 发射更新事件
    this.emitUpdate()
  }
  emitUpdate(nextProps) {
    // 当组件的 props 发生变化时会传入新的 props 属性
    // 通过 updateQueue.isBatchingUpdate 来判断是否需要立即进行更新 isBatchingUpdate 的值由 event.js 进行管理
    this.nextProps = nextProps
    nextProps || !updateQueue.isBatchingUpdate
      ? this.updateComponent()
      : updateQueue.add(this)
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this
    if (nextProps || pendingStates.length > 0) {
      // 判断是否需要更新 this.getState() 获取最终待更新的state
      shouldUpdate(classInstance, nextProps, this.getState())
    }
  }
  getState() {
    // 在待更新队列中获取所有的 state 合并为最终需要更新的 state 进行更新
    let { classInstance, pendingStates } = this
    let { state } = classInstance
    if (pendingStates.length) {
      pendingStates.forEach((nextState) => {
        // 待更新的 state 是函数时 传入最新的 state
        if (isFunction(nextState)) {
          nextState = nextState.call(classInstance, state)
        }
        state = { ...state, ...nextState }
      })
      pendingStates.length = 0
    }
    return state
  }
}
function shouldUpdate(classInstance, nextProps, nextState) {
  // 触发 shouldComponentUpdate 钩子 传入最终的 props 跟 state 
  let noUpdate =
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  if (nextProps) {
    // 修改组件实例的 props
    classInstance.props = nextProps
  }
  // 修改组件实例的 state
  classInstance.state = nextState
  // 根据 shouldComponentUpdate 返回值判断是否进行更新
  if (!noUpdate) {
    // 调用 forceUpdate 更新组件
    classInstance.forceUpdate()
  }
}
class Component {
  // 所有的类组件都继承自该基类

  // 通过 静态属性 isReactComponent 标记该虚拟dom为类组件
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
    // 负责处理 组件的更新操作
    this.updater = new Updater(this)
    this.nextProps = null
  }
  setState(partialState) {
    // setState 不会直接修改 state 的值，为了防止多次 setState，优化性能，交由 updater 进行处理
    this.updater.addState(partialState)
  }
  forceUpdate() {
    // 强制更新之前 触发 componentWillUpdate 钩子
    if (this.componentWillUpdate) this.componentWillUpdate()
    // 获取更新后的虚拟 DOM
    let newVdom = this.render()
    // 第一次挂载类组件时为其添加了 oldVdom 属性，通过 oldVdom 与 newVdom 对比，实现组件更新
    let currentVdom = compareTwoVdom(
      this.oldVdom.dom.parentNode,
      this.oldVdom,
      newVdom
    )
    // 将更新后的虚拟 dom 作为下一次更新时 老的虚拟 dom
    this.oldVdom = currentVdom
    // 更新结束 触发 componentDidUpdate 钩子
    if (this.componentDidUpdate) this.componentDidUpdate(this.props, this.state)
  }
}
export default Component
