# 简介

微信小程序request全局的简单封装

## 具体作用

1. 封装了GET, POST方法的基本调用
2. 对请求做了统一的拦截处理，可在每个请求前，做处理，例如添加统一token
3. 对请求返回的数据进行了统一的处理，可在这里进行全局接口错误处理

## 使用方法

```js
// wxRequest.js文件
import wxRequest from './index.js';

// 设置api域名
wxRequest.setConfig({ baseUrl: 'htttps://www.xx.com' })

// 请求拦截处理
wxRequest.interceptor.request((reqOpt) => {
  // your code here
  return reqOpt
})

// 对请求回来的数据进行统一处理
wxRequest.interceptor.response((response, reqOpts) => {
  const { code, message, success } = response.data
  // your code here example
  if (message) {
    uni.showToast({
      title: message,
      icon: 'none',
    })
    throw new Error(errorMsg)
  }
  return response
})

export default wxRequest

// get post的调用示例
wxRequest.post('/api/how/are/you', data, options)
wxRequest.post('/api/i/am/fine', data, options)
```