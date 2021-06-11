class Http {
  defaultConfig = {
    baseUrl: '',
    useMiniStoreCode: false,
    header: {},
    method: 'POST',
    loading: false,
  }

  interceptor = {
    request(f) {
      if (f) {
        Http.requestBeforeFun = f
      }
    },
    response(f) {
      if (f) {
        Http.requestComFun = f
      }
    },
  }

  setConfig(options) {
    this.defaultConfig = { ...this.defaultConfig, ...options }
  }

  static requestBeforeFun(requestOpt) {
    return requestOpt
  }

  static requestComFun(response) {
    return response
  }

  request(options = {}) {
    const initReqOpts = { ...this.defaultConfig, ...options }
    const reqOpts = { ...initReqOpts, ...Http.requestBeforeFun(initReqOpts) }
    reqOpts.url = `${reqOpts.baseUrl}${reqOpts.url}`
    if (reqOpts.loading) wx.showLoading({ title: '', mask: true })
    return new Promise((resolve, reject) => {
      wx.request({
        ...reqOpts,
        success: (res) => {
          const response = Http.requestComFun(res, reqOpts, options)
          resolve(response)
        },
        fail: (err) => {
          reject(Http.exception(err, reqOpts.data, reqOpts.url))
        },
        complete: () => {
          if (reqOpts.loading) wx.hideLoading({})
        },
      })
    })
  }

  static exception(err, data, url) {
    if (/timeout/.test(err.errMsg)) {
      uni.showToast({
        title: '请求服务器超时，请稍后再试',
        icon: 'none',
      })
    }
    console.error(`${url} - weChat server exception: `, data, err)
    return err
  }

  get(url, data = {}, options = {}) {
    const opt = { ...options }
    opt.url = url
    opt.data = data
    opt.method = 'GET'
    return this.request(opt)
  }

  post(url, data = {}, options = {}) {
    const opt = { ...options }
    opt.url = url
    opt.data = data
    opt.method = 'POST'
    return this.request(opt)
  }
}

export default new Http()
