/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/react/Component/index.js":
/*!**************************************!*\
  !*** ./src/react/Component/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _reconciliation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reconciliation */ "./src/react/reconciliation/index.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Component = /*#__PURE__*/function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(partialState) {
      (0,_reconciliation__WEBPACK_IMPORTED_MODULE_0__.scheduleUpdate)(this, partialState);
    }
  }]);

  return Component;
}();

/***/ }),

/***/ "./src/react/CreateElement/index.js":
/*!******************************************!*\
  !*** ./src/react/CreateElement/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createElement)
/* harmony export */ });
function createElement(type, props) {
  var _ref;

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var childElements = (_ref = []).concat.apply(_ref, children).reduce(function (result, child) {
    if (child !== false && child !== true && child !== null) {
      if (child instanceof Object) {
        result.push(child);
      } else {
        result.push(createElement("text", {
          textContent: child
        }));
      }
    }

    return result;
  }, []);

  return {
    type: type,
    props: Object.assign({
      children: childElements
    }, props)
  };
}

/***/ }),

/***/ "./src/react/DOM/createDOMElement.js":
/*!*******************************************!*\
  !*** ./src/react/DOM/createDOMElement.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createDOMElement)
/* harmony export */ });
/* harmony import */ var _updateNodeElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateNodeElement */ "./src/react/DOM/updateNodeElement.js");

function createDOMElement(virtualDOM) {
  var newElement = null;

  if (virtualDOM.type === "text") {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent);
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type);
    (0,_updateNodeElement__WEBPACK_IMPORTED_MODULE_0__.default)(newElement, virtualDOM);
  }

  return newElement;
}

/***/ }),

/***/ "./src/react/DOM/index.js":
/*!********************************!*\
  !*** ./src/react/DOM/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDOMElement": () => (/* reexport safe */ _createDOMElement__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "updateNodeElement": () => (/* reexport safe */ _updateNodeElement__WEBPACK_IMPORTED_MODULE_1__.default)
/* harmony export */ });
/* harmony import */ var _createDOMElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createDOMElement */ "./src/react/DOM/createDOMElement.js");
/* harmony import */ var _updateNodeElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateNodeElement */ "./src/react/DOM/updateNodeElement.js");



/***/ }),

/***/ "./src/react/DOM/updateNodeElement.js":
/*!********************************************!*\
  !*** ./src/react/DOM/updateNodeElement.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ updateNodeElement)
/* harmony export */ });
function updateNodeElement(newElement, virtualDOM) {
  var oldVirtualDOM = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // 获取节点对应的属性对象
  var newProps = virtualDOM.props || {};
  var oldProps = oldVirtualDOM.props || {};

  if (virtualDOM.type === "text") {
    if (newProps.textContent !== oldProps.textContent) {
      if (virtualDOM.parent.type !== oldVirtualDOM.parent.type) {
        virtualDOM.parent.stateNode.appendChild(document.createTextNode(newProps.textContent));
      } else {
        virtualDOM.parent.stateNode.replaceChild(document.createTextNode(newProps.textContent), oldVirtualDOM.stateNode);
      }
    }

    return;
  }

  Object.keys(newProps).forEach(function (propName) {
    // 获取属性值
    var newPropsValue = newProps[propName];
    var oldPropsValue = oldProps[propName];

    if (newPropsValue !== oldPropsValue) {
      // 判断属性是否是否事件属性 onClick -> click
      if (propName.slice(0, 2) === "on") {
        // 事件名称
        var eventName = propName.toLowerCase().slice(2); // 为元素添加事件

        newElement.addEventListener(eventName, newPropsValue); // 删除原有的事件的事件处理函数

        if (oldPropsValue) {
          newElement.removeEventListener(eventName, oldPropsValue);
        }
      } else if (propName === "value" || propName === "checked") {
        newElement[propName] = newPropsValue;
      } else if (propName !== "children") {
        if (propName === "className") {
          newElement.setAttribute("class", newPropsValue);
        } else {
          newElement.setAttribute(propName, newPropsValue);
        }
      }
    }
  }); // 判断属性被删除的情况

  Object.keys(oldProps).forEach(function (propName) {
    var newPropsValue = newProps[propName];
    var oldPropsValue = oldProps[propName];

    if (!newPropsValue) {
      // 属性被删除了
      if (propName.slice(0, 2) === "on") {
        var eventName = propName.toLowerCase().slice(2);
        newElement.removeEventListener(eventName, oldPropsValue);
      } else if (propName !== "children") {
        newElement.removeAttribute(propName);
      }
    }
  });
}

/***/ }),

/***/ "./src/react/Misc/Arrified/index.js":
/*!******************************************!*\
  !*** ./src/react/Misc/Arrified/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var arrified = function arrified(arg) {
  return Array.isArray(arg) ? arg : [arg];
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrified);

/***/ }),

/***/ "./src/react/Misc/CreateTaskQueue/index.js":
/*!*************************************************!*\
  !*** ./src/react/Misc/CreateTaskQueue/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var createTaskQueue = function createTaskQueue() {
  var taskQueue = [];
  return {
    /**
     * 向任务队列中添加任务
     */
    push: function push(item) {
      return taskQueue.push(item);
    },

    /**
     * 从任务队列中获取任务
     */
    pop: function pop() {
      return taskQueue.shift();
    },

    /**
     * 判断任务队列中是否还有任务
     */
    isEmpty: function isEmpty() {
      return taskQueue.length === 0;
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createTaskQueue);

/***/ }),

/***/ "./src/react/Misc/createReactInstance/index.js":
/*!*****************************************************!*\
  !*** ./src/react/Misc/createReactInstance/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createReactInstance": () => (/* binding */ createReactInstance)
/* harmony export */ });
var createReactInstance = function createReactInstance(fiber) {
  var instance = null;

  if (fiber.tag === "class_component") {
    instance = new fiber.type(fiber.props);
  } else {
    instance = fiber.type;
  }

  return instance;
};

/***/ }),

/***/ "./src/react/Misc/createStateNode/index.js":
/*!*************************************************!*\
  !*** ./src/react/Misc/createStateNode/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../DOM */ "./src/react/DOM/index.js");
/* harmony import */ var _createReactInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../createReactInstance */ "./src/react/Misc/createReactInstance/index.js");



var createStateNode = function createStateNode(fiber) {
  if (fiber.tag === "host_component") {
    return (0,_DOM__WEBPACK_IMPORTED_MODULE_0__.createDOMElement)(fiber);
  } else {
    return (0,_createReactInstance__WEBPACK_IMPORTED_MODULE_1__.createReactInstance)(fiber);
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createStateNode);

/***/ }),

/***/ "./src/react/Misc/getRoot/index.js":
/*!*****************************************!*\
  !*** ./src/react/Misc/getRoot/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var getRoot = function getRoot(instance) {
  var fiber = instance.__fiber;

  while (fiber.parent) {
    fiber = fiber.parent;
  }

  return fiber;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRoot);

/***/ }),

/***/ "./src/react/Misc/getTag/index.js":
/*!****************************************!*\
  !*** ./src/react/Misc/getTag/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Component */ "./src/react/Component/index.js");


var getTag = function getTag(vdom) {
  if (typeof vdom.type === "string") {
    return "host_component";
  } else if (Object.getPrototypeOf(vdom.type) === _Component__WEBPACK_IMPORTED_MODULE_0__.Component) {
    return "class_component";
  } else {
    return "function_component";
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getTag);

/***/ }),

/***/ "./src/react/Misc/index.js":
/*!*********************************!*\
  !*** ./src/react/Misc/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTaskQueue": () => (/* reexport safe */ _CreateTaskQueue__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "arrified": () => (/* reexport safe */ _Arrified__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "createStateNode": () => (/* reexport safe */ _createStateNode__WEBPACK_IMPORTED_MODULE_2__.default),
/* harmony export */   "getTag": () => (/* reexport safe */ _getTag__WEBPACK_IMPORTED_MODULE_3__.default),
/* harmony export */   "getRoot": () => (/* reexport safe */ _getRoot__WEBPACK_IMPORTED_MODULE_4__.default)
/* harmony export */ });
/* harmony import */ var _CreateTaskQueue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateTaskQueue */ "./src/react/Misc/CreateTaskQueue/index.js");
/* harmony import */ var _Arrified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Arrified */ "./src/react/Misc/Arrified/index.js");
/* harmony import */ var _createStateNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createStateNode */ "./src/react/Misc/createStateNode/index.js");
/* harmony import */ var _getTag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getTag */ "./src/react/Misc/getTag/index.js");
/* harmony import */ var _getRoot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getRoot */ "./src/react/Misc/getRoot/index.js");






/***/ }),

/***/ "./src/react/index.js":
/*!****************************!*\
  !*** ./src/react/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _reconciliation__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   "Component": () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_2__.Component),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateElement */ "./src/react/CreateElement/index.js");
/* harmony import */ var _reconciliation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reconciliation */ "./src/react/reconciliation/index.js");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Component */ "./src/react/Component/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  createElement: _CreateElement__WEBPACK_IMPORTED_MODULE_0__.default
});

/***/ }),

/***/ "./src/react/reconciliation/index.js":
/*!*******************************************!*\
  !*** ./src/react/reconciliation/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "scheduleUpdate": () => (/* binding */ scheduleUpdate)
/* harmony export */ });
/* harmony import */ var _Misc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Misc/index */ "./src/react/Misc/index.js");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DOM */ "./src/react/DOM/index.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


 // 创建任务队列，在浏览器空闲时会去除任务队列中的任务执行

var taskQueue = (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.createTaskQueue)();
var subTask = null;
var pendingCommit = null;

function commitAllWork(fiber) {
  // 根fiber中的effects 存储这所有fiber
  fiber.effects.forEach(function (item) {
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
        (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.updateNodeElement)(item.stateNode, item, item.alternate);
      } else {
        // 类型不一致 替换即可
        item.parent.stateNode.replaceChild(item.stateNode, item.alternate.stateNode);
      }
    } else if (item.effectTag === "placement") {
      // 新增节点操作
      var _fiber = item;
      var parentFiber = item.parent; // 向父fiber中插入dom时,要检查 不能是类组件 函数组件

      while (parentFiber.tag === "class_component" || parentFiber.tag === "function_component") {
        parentFiber = parentFiber.parent;
      } // 如果子节点是普通节点 找到父级 将子节点追加到父级中


      if (_fiber.tag === "host_component") {
        parentFiber.stateNode.appendChild(_fiber.stateNode);
      }
    }
  }); // 在根fiber 的根dom节点上存储 此次生成的 fiber

  fiber.stateNode.__rootFiberContainer = fiber;
}

function getFirstTask() {
  var task = taskQueue.pop(); // 根据 from 标记判断任务类型

  if (task.from === "class_component") {
    // 组件更新任务
    // 在组件实例上拥有 _fiber属性 值为上次生成的fiber 根据fiber父子关系 获取根fiber
    var root = (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.getRoot)(task.instance); // 在上次生成的fiber中添加partialState数据 为setState传入的数据

    task.instance.__fiber.partialState = task.partialState; // 生成根fiber任务

    return {
      props: root.props,
      stateNode: root.stateNode,
      tag: "host_root",
      effects: [],
      child: null,
      alternate: root
    };
  } //  返回 根 fiber


  return {
    props: task.props,
    stateNode: task.dom,
    // root 根dom
    tag: "host_root",
    // 标记为根节点
    effects: [],
    // 存储需要改动的所有fiber任务
    child: null,
    // 存储子节点
    alternate: task.dom.__rootFiberContainer // 通过 root 根dom 获取旧的fiber

  };
}

function reconcileChildren(fiber, children) {
  var arrifiedChildren = (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.arrified)(children);
  var index = 0;
  var numberOfElements = arrifiedChildren.length;
  var element = null;
  var newFiber = null;
  var prevFiber = null;
  var alternate = null; // 当前节点的旧fiber 做对比用

  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child;
  } // 遍历子元素vdom


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
        tag: (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.getTag)(element),
        effects: [],
        effectTag: "update",
        // 该fiber为更新动作
        parent: fiber,
        alternate: alternate
      };

      if (element.type === alternate.type) {
        // 新元素 与 旧 fiber type一致 节点可复用
        newFiber.stateNode = alternate.stateNode;
      } else {
        // 节点不可复用 创建新dom
        newFiber.stateNode = (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.createStateNode)(newFiber);
      }
    } else if (element && !alternate) {
      // 有新节点 没有旧fiber 新增元素
      newFiber = {
        type: element.type,
        props: element.props,
        tag: (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.getTag)(element),
        // 标记 fiber 类型, 普通元素,类组件,函数组件
        effects: [],
        effectTag: "placement",
        // 该fiber为新增动作
        parent: fiber // 给 fiber 添加父 fiber 依赖

      }; // stateNode 存储 fiber 对应的真实dom
      // 函数组件时 存储对应函数
      // 类组件时 存储组件实例

      newFiber.stateNode = (0,_Misc_index__WEBPACK_IMPORTED_MODULE_0__.createStateNode)(newFiber);
    }

    if (index === 0) {
      // 第零个元素时 给父fiber标记子依赖
      fiber.child = newFiber;
    } else if (element) {
      // 后续元素需要标记兄弟关系
      prevFiber.sibling = newFiber;
    } // fiber迭代 维持与 当前元素对应


    if (alternate && alternate.sibling) {
      alternate = alternate.sibling;
    } else {
      alternate = null;
    } // prevFiber 存储前一个 fiber


    prevFiber = newFiber;
    index++;
  }
}

function executeTask(fiber) {
  // 1. 遍历当前 fiber 的子元素 生成父子 父子 兄弟 关系 fiber
  if (fiber.tag === "class_component") {
    if (fiber.stateNode.__fiber && fiber.stateNode.__fiber.partialState) {
      // 获取 setState 出入的数据 更新组件state
      fiber.stateNode.state = _objectSpread(_objectSpread({}, fiber.stateNode.state), fiber.stateNode.__fiber.partialState);
    } // 类组件 调用render获取虚拟dom 生成fiber


    reconcileChildren(fiber, fiber.stateNode.render());
  } else if (fiber.tag === "function_component") {
    // 函数组件 调用方法生成虚拟dom 使用虚拟dom生成对应fiber
    reconcileChildren(fiber, fiber.stateNode(fiber.props));
  } else {
    reconcileChildren(fiber, fiber.props.children);
  } // 2. 获取当前 fiber 第一个子节点返回 会在 workLoop 继续循环执行


  if (fiber.child) {
    return fiber.child;
  }

  var currentExecutelyFiber = fiber; // 3. 此时已经遍历到dom树最后一层的第一个节点 再继续向上遍历兄弟节点

  while (currentExecutelyFiber.parent) {
    // 在 父 fiber 中 effects 存储所有的子 fiber 用于生成真实dom树使用
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(currentExecutelyFiber.effects.concat([currentExecutelyFiber]));

    if (currentExecutelyFiber.sibling) {
      // 返回兄弟节点 继续遍历
      return currentExecutelyFiber.sibling;
    } // 向上递归


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
  } // 此时已经遍历完成 准备根据父子 兄弟关系 生成真实 dom 树
  // 此时 pendingCommit 是 根fiber


  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}

function performTask(deadline) {
  workLoop(deadline); // 当浏览器有高级任务进入 requestIdleCallback 会在此地中断，后续任务需要通过 requestIdleCallback 重新注册

  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask);
  }
}

var render = function render(element, dom) {
  // 任务队列中添加 root根 fiber 任务
  taskQueue.push({
    dom: dom,
    props: {
      children: element
    }
  }); // 核心API requestIdleCallback 在浏览器空闲时执行任务

  requestIdleCallback(performTask);
}; // 类组件 setState 会调用此方法进行更新

var scheduleUpdate = function scheduleUpdate(instance, partialState) {
  // 生成新任务 添加 from 标记任务类型为类组件更新
  taskQueue.push({
    from: "class_component",
    instance: instance,
    partialState: partialState
  });
  requestIdleCallback(performTask);
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./react */ "./src/react/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var root = document.getElementById("root"); // const jsx = (
//   <div>
//     <p>Hello React</p>
//     <p>Hi Fiber</p>
//   </div>
// );
// render(jsx, root);
// setTimeout(() => {
//   const jsx = (
//     <div>
//       <div>奥利给</div>
//     </div>
//   );
//   render(jsx, root);
// }, 2000);

var Greating = /*#__PURE__*/function (_Component) {
  _inherits(Greating, _Component);

  var _super = _createSuper(Greating);

  function Greating(props) {
    var _this;

    _classCallCheck(this, Greating);

    _this = _super.call(this, props);
    _this.state = {
      name: "张三"
    };
    return _this;
  }

  _createClass(Greating, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", null, "hahahaha", this.props.title, " ", this.state.name, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("button", {
        onClick: function onClick() {
          return _this2.setState({
            name: "李四"
          });
        }
      }, "button"));
    }
  }]);

  return Greating;
}(_react__WEBPACK_IMPORTED_MODULE_0__.Component);

(0,_react__WEBPACK_IMPORTED_MODULE_0__.render)( /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement(Greating, {
  title: "\u5965\u5229\u7ED9"
}), root); // function FnComponent(props) {
//   return <div>{props.title}FnComponent</div>;
// }
// render(<FnComponent title='Hello' />, root);
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map