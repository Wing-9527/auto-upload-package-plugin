const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH()

class AutoUploadPackagePlugin {
  options
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap('AutoUploadPackagePlugin', async (compilation) => {
      const { log } = console
      await this.connect()
      // 是否连接成功
      if (ssh.connection) {
        log('连接成功')
        // 判断删除指令是否执行有误
        const { stderr } = await this.clean()
        if (stderr) {
          log('删除失败')
        } else {
          log('删除成功')
          const uploadStatus = await this.upload(compilation)
          if (uploadStatus) {
            console.error('上传成功')
          } else {
            console.error('上传失败')
          }
        }
      } else {
        console.log('连接失败')
      }
      // 销毁连接
      ssh.dispose()
      log('断开连接')
    })
  }
  // 连接
  connect() {
    return ssh.connect({
      ...this.options
    })
  }
  // 删除目录下的文件
  clean() {
    const { 'directory': serverDirectory } = this.options
    return ssh.execCommand(`rm -rf ${serverDirectory}/*`)
  }
  // 上传
  upload (compilation) {
    const localOutputPath = compilation.outputOptions.path
    const { 'directory': serverDirectory } = this.options
    return ssh.putDirectory(localOutputPath, serverDirectory)
  }
}

module.exports = AutoUploadPackagePlugin
