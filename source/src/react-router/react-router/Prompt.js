import React from 'react';
import RouterContext from './RouterContext';
import Lifecycle from './Lifecycle';
function Prompt({ when, message }) {
  return (
    <RouterContext.Consumer>
      {(contextValue) => {
        //如果不需要阻止，则直接返回null 什么都不干 什么都不渲染
        if (!when) return null;
        const block = contextValue.history.block; //需要给history添加一个 block方法
        return (
          <Lifecycle
            onMount={(self) => (self.release = block(message))}
            onUnmount={(self) => self.release()}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}
export default Prompt;
