## 概念
- css-in-js 是 web 项目中将 css 代码捆绑在 js 代码中的解决方案
- 这种方案旨在解决 css 的局限性，例如缺乏动态功能，作用域（只在某个组件内有效），可移植性（组件不再依赖于外部 css）等。

## 优点
1. 让 css 代码拥有独立的作用域，组织 css 代码泄漏到外部组件，防止样式泄露。
2. 让组件更具有可移植性，实现开箱即用，轻松创建低耦合的应用程序（组件不再依赖于外部 css文件）。
3. 让组件更具有可重用性，只需编写一次，即可在任何地方运行。不仅可以在同一应用中重用组件，也可以在相同框架构建的其他应用中重用。
4. 让样式具有动态功能，可以将复杂的逻辑应用于样式规则，创建动态功能的复杂 ui

## 缺点
1. 为项目增加了额外的复杂性，需要单独学习该解决方案。
2. 自动生成的选择器大大降低了代码的可读性。 

## Emotion
- css-in-js方案的具体实施库。
- 一个使用 js 编写 css 样式的库
- yarn add @emotion/core @emotion/styled

### 支持 emotion 的 css 属性
`yarn add @emotion/babel-preset-css-prop`
- 修改 babel 预设 用于处理 css 属性
```json
"babel":{
    "preset":[
        "@emotion/babel-perset-css-prop"
    ]
}
```

### css 方法
```js
import { css } from '@emotion/core'
const style = css`
    height:100px;
    width:200px;
    background:blue;
`
const style = css({
    height:100,
    width:200,
    background:blue
})
const style2 = css({
    height:200,
    width:100,
    background:blue
})
<div css={style}></div>
<div css={[style,style2]}></div>
// css 属性为数组时 后边覆盖前边样式
// props 对象中的 css 属性优先级高于组件内部自己的css 属性，这样再调用子组件时可以传入 props css 覆盖子组件自己的 css 样式
```

### 样式化组件
- 样式化组件是用来构建用户界面的，它可以为某些元素添加样式
```js
import styled from '@emotion/styled'
const Button = styled.button`
    height: 100px;
    width: 20px;
    background: blue;
`
const Span = styled.span({
    height: 100,
    width: 20,
    background: "blue",
})
// 创建了一个带样式的button 跟 带样式的 span
```
- 根据 props 属性覆盖样式
```js
import styled from '@emotion/styled'
const Button = styled.button`
    height: 100px;
    width: 20px;
    background: ${props => props.color || "blue"};
`
const Span = styled.span(props =>({
    height: 100,
    width: 20,
    background: props.color || "blue",
}))
const Span = styled.span({
    height: 100,
    width: 20,
    background: "blue",
},props =>({
    background: props.color,
}))
```
- 为任何组件添加样式
```js
import styled from '@emotion/styled'
const Demo = ({className})=><div className={className}>demo</div>
const Fancy = styled(Demo)`
    color: red
`
const Fancy = styled(Demo)({
    color: 'red'
})
```
- 父组件中设置子组件样式
```js
import styled from '@emotion/styled'
const Children = styled.div`
    background: red
`
const Parent = styled.div`
    ${Children}{
        background: blue
    }
`
const Children = styled.div(
    background: 'red'
)
const Parent = styled.div({
    [Children]: {
        background: "blue"
    }
})
<Parent>Parent<Children></Children></Parent>
```
- 嵌套选择器 & 表示组件本身 与 scss 一致
```js
import styled from '@emotion/styled'
const Demo = styled.div`
    background: red;
    & > a {
        color: black
    };
    &:hover {
        background: yellow
    }
`
```
- as 修改 标记
```js
import styled from '@emotion/styled'
const Button = styled.button`
    color: red
`
<Button as='a' href='#'></Button>
// 会被渲染为 a 标签
```

### 全局样式
```js
import {css,Global} from '@emotion/core'
const styles = css`
    color:red
`
function App(){
    return <>
        <Global styles={styles}></Global>
        ...
    </>
}
```

### 动画
```js
const move = keyframes`
    0% {left: 0;top: 0}
    100% {left: 100px;top: 100px}
`
const box = css`
    animation: ${move} 2s ease infinite alternate;
`
<div css={box}></div>
```

### 主题
```js
import { ThemeProvider, useTheme } from 'emotion-theming'
const theme = {
    colors:{
        primary:'tomato'
    }
}
<ThemeProvider theme={ theme }>
    <App/>
</ThemeProvider>

const primaryColor = props => css`
    color: ${props.colors.primary}
`
useTheme() // 获取传入的主题对象
function App(){
    return <div css={primaryColor}>app</div>
}
```