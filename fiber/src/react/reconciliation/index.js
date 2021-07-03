import {
  createTaskQueue,
  arrified,
  createStateNode,
  getTag,
  getRoot,
} from "../Misc/index";
import { updateNodeElement } from "../DOM";

// 创建任务队列，在浏览器空闲时会去除任务队列中的任务执行
const taskQueue = createTaskQueue();
let subTask = null;
let pendingCommit = null;

function commitAllWork(fiber) {
  // 根fiber中的effects 存储这所有fiber
  fiber.effects.forEach((item) => {
    if (item.tag === "class_component") {
      // 当前fiber 是类组件 在fiber 的stateNode上存储对应的fiber 供后续类组件更新使用
      item.stateNode.__fiber = item;
    }
    if (item.effectTag === "delete") {
      // 该fiber是删除操作删除对应的fiber.stateNode的真实节点
      item.parent.stateNode.removeChild(item.stateNode);
    } else if (item.effectTag === "update") {
      // 更新操作
      if (item.type === item.alternate.type) {
        // 类型一致 可服用 更新其属性
        updateNodeElement(item.stateNode, item, item.alternate);
      } else {
        // 类型不一致 替换即可
        item.parent.stateNode.replaceChild(
          item.stateNode,
          item.alternate.stateNode,
        );
      }
    } else if (item.effectTag === "placement") {
      // 新增节点操作
      let fiber = item;
      let parentFiber = item.parent;
      // 向父fiber中插入dom时,要检查 不能是类组件 函数组件
      while (
        parentFiber.tag === "class_component" ||
        parentFiber.tag === "function_component"
      ) {
        parentFiber = parentFiber.parent;
      }
      // 如果子节点是普通节点 找到父级 将子节点追加到父级中
      if (fiber.tag === "host_component") {
        parentFiber.stateNode.appendChild(fiber.stateNode);
      }
    }
  });
  // 在根fiber 的根dom节点上存储 此次生成的 fiber
  fiber.stateNode.__rootFiberContainer = fiber;
}
function getFirstTask() {
  const task = taskQueue.pop();
  // 根据 from 标记判断任务类型
  if (task.from === "class_component") {
    // 组件更新任务
    // 在组件实例上拥有 _fiber属性 值为上次生成的fiber 根据fiber父子关系 获取根fiber
    const root = getRoot(task.instance);
    // 在上次生成的fiber中添加partialState数据 为setState传入的数据
    task.instance.__fiber.partialState = task.partialState;
    // 生成根fiber任务
    return {
      props: root.props,
      stateNode: root.stateNode,
      tag: "host_root",
      effects: [],
      child: null,
      alternate: root,
    };
  }
  //  返回 根 fiber
  return {
    props: task.props,
    stateNode: task.dom, // root 根dom
    tag: "host_root", // 标记为根节点
    effects: [], // 存储需要改动的所有fiber任务
    child: null, // 存储子节点
    alternate: task.dom.__rootFiberContainer, // 通过 root 根dom 获取旧的fiber
  };
}
function reconcileChildren(fiber, children) {
  const arrifiedChildren = arrified(children);
  let index = 0;
  let numberOfElements = arrifiedChildren.length;
  let element = null;
  let newFiber = null;
  let prevFiber = null;
  let alternate = null;
  // 当前节点的旧fiber 做对比用
  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child;
  }
  // 遍历子元素vdom
  while (index < numberOfElements || alternate) {
    element = arrifiedChildren[index];
    if (!element && alternate) {
      // 没有子节点 但是有对应的 旧fiber 说明要删除
      alternate.effectTag = "delete"; // // 该fiber为删除动作
      fiber.effects.push(alternate); // 将删除的任务添加到effets中
    } else if (element && alternate) {
      // 有子节点 且 有对应的旧fiber 更新操作
      // 生成新fiber
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: "update", // 该fiber为更新动作
        parent: fiber,
        alternate,
      };
      if (element.type === alternate.type) {
        // 新元素 与 旧 fiber type一致 节点可复用
        newFiber.stateNode = alternate.stateNode;
      } else {
        // 节点不可复用 创建新dom
        newFiber.stateNode = createStateNode(newFiber);
      }
    } else if (element && !alternate) {
      // 有新节点 没有旧fiber 新增元素
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element), // 标记 fiber 类型, 普通元素,类组件,函数组件
        effects: [],
        effectTag: "placement", // 该fiber为新增动作
        parent: fiber, // 给 fiber 添加父 fiber 依赖
      };
      // stateNode 存储 fiber 对应的真实dom
      // 函数组件时 存储对应函数
      // 类组件时 存储组件实例
      newFiber.stateNode = createStateNode(newFiber);
    }
    if (index === 0) {
      // 第零个元素时 给父fiber标记子依赖
      fiber.child = newFiber;
    } else if (element) {
      // 后续元素需要标记兄弟关系
      prevFiber.sibling = newFiber;
    }

    // fiber迭代 维持与 当前元素对应
    if (alternate && alternate.sibling) {
      alternate = alternate.sibling;
    } else {
      alternate = null;
    }
    // prevFiber 存储前一个 fiber
    prevFiber = newFiber;
    index++;
  }
}
function executeTask(fiber) {
  // 1. 遍历当前 fiber 的子元素 生成父子 父子 兄弟 关系 fiber
  if (fiber.tag === "class_component") {
    if (fiber.stateNode.__fiber && fiber.stateNode.__fiber.partialState) {
      // 获取 setState 出入的数据 更新组件state
      fiber.stateNode.state = {
        ...fiber.stateNode.state,
        ...fiber.stateNode.__fiber.partialState,
      };
    }
    // 类组件 调用render获取虚拟dom 生成fiber
    reconcileChildren(fiber, fiber.stateNode.render());
  } else if (fiber.tag === "function_component") {
    // 函数组件 调用方法生成虚拟dom 使用虚拟dom生成对应fiber
    reconcileChildren(fiber, fiber.stateNode(fiber.props));
  } else {
    reconcileChildren(fiber, fiber.props.children);
  }
  // 2. 获取当前 fiber 第一个子节点返回 会在 workLoop 继续循环执行
  if (fiber.child) {
    return fiber.child;
  }

  let currentExecutelyFiber = fiber;
  // 3. 此时已经遍历到dom树最后一层的第一个节点 再继续向上遍历兄弟节点
  while (currentExecutelyFiber.parent) {
    // 在 父 fiber 中 effects 存储所有的子 fiber 用于生成真实dom树使用
    currentExecutelyFiber.parent.effects =
      currentExecutelyFiber.parent.effects.concat(
        currentExecutelyFiber.effects.concat([currentExecutelyFiber]),
      );
    if (currentExecutelyFiber.sibling) {
      // 返回兄弟节点 继续遍历
      return currentExecutelyFiber.sibling;
    }
    // 向上递归
    currentExecutelyFiber = currentExecutelyFiber.parent;
  }
  pendingCommit = currentExecutelyFiber;
}
function workLoop(deadline) {
  if (!subTask) {
    // 两种情况
    // 1. 第一次挂载
    // 2. 组件更新
    subTask = getFirstTask(); // 获取第一个根任务
  }
  while (subTask && deadline.timeRemaining() > 1) {
    // 在浏览器空闲时间执行 fiber 任务
    // 后序遍历 dom树 一次生成对应节点的 fiber 对象
    subTask = executeTask(subTask);
  }
  // 此时已经遍历完成 准备根据父子 兄弟关系 生成真实 dom 树
  // 此时 pendingCommit 是 根fiber
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}
function performTask(deadline) {
  workLoop(deadline);
  // 当浏览器有高级任务进入 requestIdleCallback 会在此地中断，后续任务需要通过 requestIdleCallback 重新注册
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask);
  }
}
export const render = (element, dom) => {
  // 任务队列中添加 root根 fiber 任务
  taskQueue.push({
    dom,
    props: { children: element },
  });
  // 核心API requestIdleCallback 在浏览器空闲时执行任务
  requestIdleCallback(performTask);
};

// 类组件 setState 会调用此方法进行更新
export const scheduleUpdate = (instance, partialState) => {
  // 生成新任务 添加 from 标记任务类型为类组件更新
  taskQueue.push({
    from: "class_component",
    instance,
    partialState,
  });
  requestIdleCallback(performTask);
};
