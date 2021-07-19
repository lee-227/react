## 概念
- 简单的，模块化的 UI 组件库，提供了丰富的构建 React 应用的 UI 组件
- antd 适用于管理后台，而 chakra 适用于构建用于展示给用户的界面

## 优点
1. 内置了 emotion 是 css-in-jss 解决方案的集大成者
2. 基于 Styled-System （允许我们向组件中添加样式属性，允许我们基于布局，颜色等的全局主题来控制样式）
3. 支持开箱即用的主题功能，默认支持 light dark 两种模式
4. 更简单的使用响应式设计

## 安装
`yarn add @chakra-ui/core @chakra-ui/theme`

## 主题
```js
import { ChakraProvider,CSSReset } from '@chakra-ui/core'
import theme from "@chakra-ui/theme"
// 1. 设置默认主题
theme.config.initialColorMode = "dark"
// 2. 根据操作系统颜色模式 设置颜色模式
theme.config.useSystemColorMode = true
<ChakraProvider theme={theme}>
  <CSSReset/>
  <App></App>
</ChakraProvider>
```

## Style Props 样式属性
- 用来更改组件样式，通过为组件传递属性的方式实现，通过传递简化的样式属性已达到提升开发效率的目的。
```js
import { Box } from '@chakra-ui/core'
//   width     height    padding
<Box w="100px" h="220px" p="20px"></Box>
```

## 颜色模式
- chakra 默认支持两种主题
- chakra 会将颜色模式存储在 localStorage 中，使用类名策略确保颜色模式是持久的
```js
import { useColorMode, Text, Button, Box, useColorModeValue } from '@chakra-ui/core'
const [colorMode,changeColorMode] = useColorMode()
const bgColor = useColorModeValue('yellow','black') // 根据模式不同返回不同的颜色 第一个参数是浅色模式 第二个参数是深色模式
<Box bgColor={bgColor}>
  <Text>当前夜色模式为：{colorMode}</Text>
  <Button onclick={changeColorMode}>切换颜色模式<Button/>
</Box>
```

## 强制颜色模式
```js
import { LightMode, DarkMode } from "@chakra-ui/core"
<LightMode>
  里边的组件不受颜色模式影响 始终保持在该颜色模式下的样式
</LightMode>
```

## 主题对象
```js
import { Box} from '@chakra-ui/core'
// colors 会先到 theme 主题对象中取值 取不到再去判断是不是一个颜色值 
<Box bgColor="gray.500"></Box>
// space 自定义项目间距 这些值可以由 padding margin top left right bottom 引用
<Box space="5"></Box> // 取 space 5 -> 1.25rem
// sizes 自定义元素大小 这些值可以由 width height maxWidth maxHeight 引用
<Box width="6"></Box> // 取 sizes 6 -> 1.5rem
// ....还有很多
```

## 响应式
```js
// 配置响应数组中使用的默认断点，这些值用于生成最小宽度优先的媒体查询
// theme.js
export default {
  breakpoints: ['30em', "48em"]
}
<Box fontSize={['12px', '16px', "18px"]}></Box> // 第一个值是默认值 后续跟断点对应
```

## 创建 chakra-ui 组件
```js
import { chakra } from '@chakra-ui/core'
const MyButton = chakra('button',{
  baseStyle:{
    borderRadius: "lg"
  },
  sizes:{
    sm:{
      px: '3',
      py: "1",
      fontSize: "12px"
    },
    md:{
      px: "4",
      py: "2",
      fontSize: '14px'
    }
  },
  variants:{
    primary:{
      bgColor:'blue.500',
      color:'white'
    },
    danger:{
      bgColor:'red.500',
      color:'white'
    }
  }
})
// 组件默认属性
MyButton.defaultProps = {
  size: "sm",
  variant: "primary"
}
<MyButton size="sm" variant="danger"></MyButton>
```

## 全局化样式组件
```js
// src/components/MyButton.js
export default {
  baseStyle:{
    borderRadius: "lg"
  },
  sizes:{
    sm:{
      px: '3',
      py: "1",
      fontSize: "12px"
    },
    md:{
      px: "4",
      py: "2",
      fontSize: '14px'
    }
  },
  variants:{
    primary:{
      bgColor:'blue.500',
      color:'white'
    },
    danger:{
      bgColor:'red.500',
      color:'white'
    }
  },
  defaultProps:{
    size: "sm",
    variant: "primary"
  }
}
// src/components/index.js
import MyButton from './MyButton'
export default { MyButton }

// main.js
import { ChakraProvider,CSSReset } from '@chakra-ui/core'
import theme from "@chakra-ui/theme"
import components from './components'
const myTheme = {
  ...theme,
  components:{
    ...theme.components,
    ...components
  }
}
<ChakraProvider theme={myTheme}>
  <CSSReset/>
  <App></App>
</ChakraProvider>

// button.js
import { chakra } from '@chakra-ui/core'
const MyButton = chakra('button',{
  thtmeKey: 'MyButton'
})
```