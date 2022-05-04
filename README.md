## Description 
webpack插件，将打好的包自动部署到服务器。  
auto upload your build package to the server.
## Example
```
npm i auto-upload-package-plugin
```
```
import AutoUploadPackagePlugin from 'auto-upload-package-plugin'
```
```
new AutoUploadPackagePlugin({
  host: '192.168.1.1'
  username: 'root',
  password: 'abc123.',
  directory: '/root/myProject'
})
```