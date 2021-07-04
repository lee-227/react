## React路由原理
- HashRouter
```js
// 路径监听
window.addEventListener('hashchange',()=>{});

// 修改hash
window.location.hash
```
- BrowserRouter 利用h5 Api实现路由的切换
```js
history.pushState(stateObject, title, url)
// 第一个参数用于存储该url对应的状态对象，该对象可在onpopstate事件中获取，也可在history对象中获取
// 第二个参数是标题，目前浏览器并未实现
// 第三个参数则是设定的url
// pushState函数向浏览器的历史堆栈压入一个url为设定值的记录，并改变历史堆栈的当前指针至栈顶

history.replaceState()
// 该接口与pushState参数相同，含义也相同
// 唯一的区别在于replaceState是替换浏览器历史堆栈的当前历史记录为设定的url
// 需要注意的是replaceState不会改动浏览器历史堆栈的当前指针

window.onpopstate
// 该事件是window的属性
// 该事件会在调用浏览器的前进、后退以及执行history.forward、history.back、和history.go触发，因为这些操作有一个共性，即修改了历史堆栈的当前指针
// 在不改变document的前提下，一旦当前指针改变则会触发onpopstate事件
```

## 路由懒加载
```js
const LazyHome = React.lazy(() => import(/* webpackChunkName: "Home" */'./components/Home'));

<Suspense fallback={<Loading />}>
  <LazyHome />
</Suspense>
// Loading 组件会在 LazyHome组件加载完之前显示
```