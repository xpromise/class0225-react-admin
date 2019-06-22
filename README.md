# React后台管理项目
## 1、git管理
* 创建本地仓库
  * 通过create-react-app创建，会自动生成本地仓库（git init）
  * 本地版本控制
    * 删除多余文件
    * 添加了.idea的忽略
    * git add .
    * git commit -m 'xxx'
* 创建远程仓库
  * 上github创建仓库
* 本地仓库的内容提交到远程仓库去
  * git remote add origin xxx 关联仓库
  * git push -u(首次) origin master/dev  
* 本地分支操作
  * git checkout -b dev 新建并切换到dev分支
  * git checkout master 切换到master分支
  * git merge dev 合并dev分支的内容  
* 克隆仓库
  * git clone xxx 
  * 只能克隆master，需要dev
    * git fetch origin dev:dev
  * 后面更新：git pull origin dev
  * 产生冲突：
    * 版本回退：git reset --hard HEAD^  然后在更新
    * 删库，重新克隆
  
## 代理服务器
* 是什么？ 是一个开发时跨域解决方案，上线不能用    
* 原理：
  * Browser和proxy server是同一个服务器（proxy server负责部署运行Browser代码）
  * Browser向proxy server发送请求，proxy server会将请求转发到target server上，
  * target server接受请求，将响应结果返回到proxy server上，
  * proxy server再将target server响应结果响应给Browser
* 配置：
  * 在package.json中加上 "proxy": "http://localhost:5000"
  * 重启服务器才会开启proxy server