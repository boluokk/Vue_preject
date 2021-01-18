const prodPlugin = []
// 判断当前是开发阶段还是生产阶段 以便来处理一些配置
if (process.env.NODE_ENV === 'production') {
  prodPlugin.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugin,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
