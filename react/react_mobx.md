# MobX 6

## 1. MobX 概念
mobx 是一个简单的可扩展的状态管理库，无样板代码风格简约。适用于单人开发

redux 因为模板代码，规则较强，适用于多人项目中使用
## 2. 核心概念

1. observable：被 MobX 跟踪的状态。
2. action：允许修改状态的方法，在严格模式下只有 action 方法被允许修改状态。
3. computed：根据现有状态衍生出来的状态。
4. flow：执行副作用，它是 generator 函数。可以更改状态值。

## 3. 工作流程

<img src="./images/1.png"/>

### 4. 下载

- mobx：MobX 核心库
- mobx-react-lite：仅支持函数组件
- mobx-react：既支持函数组件也支持类组件

### 5. demo
```js
// index.js
import CounterStore from "./CouterStore"
import { createContext, useContext } from "react"
import TodoStore from "./TodoStore"

class RootStore {
  constructor() {
    this.counterStore = new CounterStore()
    this.todoStore = new TodoStore()
  }
}

const rootStore = new RootStore()
const RootStoreContenxt = createContext()

export const RootStoreProvider = ({ children }) => {
  return (
    <RootStoreContenxt.Provider value={rootStore}>
      {children}
    </RootStoreContenxt.Provider>
  )
}
export const useRootStore = () => {
  return useContext(RootStoreContenxt)
}
// CounterStore.js
import { action, makeObservable, observable } from "mobx"

export default class CounterStore {
  constructor() {
    this.count = 0
    makeObservable(this, {
      count: observable,// 标记为需要响应式的属性，修改该属性会重新渲染使用该属性的视图
      increment: action.bound,// 标记为 action 用于修改数据 bound 绑定 this 为当前类实例
      decrement: action.bound
    })
  }
  increment() {
    this.count += 1
  }
  decrement() {
    this.count -= 1
  }
}
// TodoStore.js
import axios from "axios"
import { action, computed, flow, makeObservable, observable, runInAction } from "mobx"
import Todo from "./Todo"

export default class TodoStore {
  constructor() {
    this.todos = []
    this.filterCondition = "All"
    makeObservable(this, {
      todos: observable,
      loadTodos: flow, // 副作用 使用异步修改数据
      unCompletedTodosCount: computed, // 计算属性
    })
    this.loadTodos()
  }
//   async loadTodos() {
//     let todos = await axios
//       .get("http://localhost:3005/todos")
//       .then(response => response.data)
//     runInAction(() => {
//       todos.forEach(todo => {
//         this.todos.push(new TodoStore(todo.title))
//       })
//     })
//   }
  *loadTodos() {
    let respnose = yield axios.get("http://localhost:3001/todos")
    respnose.data.forEach(todo => this.todos.push(new Todo(todo)))
  }
  addTodo(title) {
    this.todos.push(new Todo({ title, id: this.createId() }))
  }
  createId() {
    if (!this.todos.length) return 1
    return this.todos.reduce((id, todo) => (id < todo.id ? id : todo.id), 0) + 1
  }
  get unCompletedTodosCount() {
    return this.todos.filter(todo => !todo.isCompleted).length
  }
}
// APP.js
import { RootStoreProvider } from "../store"
// 使用context全局提供store
function App() {
  return (
    <RootStoreProvider>
    </RootStoreProvider>
  )
}
export default App

// Counter.js
function Counter() {
  const { counterStore } = useRootStore() // 获取对应的模块store
  const { count, increment, decrement } = counterStore // 获取store中的方法
  return (
    <Container>
      <Button onClick={() => increment()} border="left">
        INCREMENT
      </Button>
      <Button>{count}</Button>
      <Button onClick={() => decrement()} border="right">
        DECREMENT
      </Button>
    </Container>
  )
}
// 使用 observer 包裹组件 是组件动态响应数据更新
export default observer(Counter)

// 类似于 vue 中的 watchEffect 内部的响应式数据变化时重新执行函数
autorun(() => {
  console.log(person.name)
})
// watch
reaction(
    () => counterStore.count,
    (current, previous) => {
    console.log(current)
    console.log(previous)
    }
)
```