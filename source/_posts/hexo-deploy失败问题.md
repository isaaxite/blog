---
title: hexo deploy失败问题
tags:
  - hexo
  - deploy
  - wsl
  - debian
  - github
categories:
  - hexo
  - deploy
date: 2023-03-10 23:22:46
---


# 前言

当前在WSL的Debian系统中使用hexo写作以及发布部署。

在Win和Mac系统环境下，在deploy的时候，会自动跳转浏览器做OAuth2授权，不影响使用。

但是在WSL环境或者说Linux环境（可能）下，会直接在终端 prompt。要求输入账号和密码，但是无论输入对或错都会失败。本文旨在解决此问题以及deploy的部分逻辑分析。

<!-- more -->

# 为什么输入正确还是push失败？

使用 [默认的deploy配置](https://hexo.io/docs/one-command-deployment#Git) 并进行部署，你会得到以下结果：

![](Snipaste_2023-03-10_23-08-51.png)

在以上日志已经提示：

```shell
remote: Support for password authentication was removed on August 13, 2021.
```

在 2021/08/31 开始，GitHub已经不支持通过账号和密码进行验证！

详细可以查阅：[Github Blog: Git password authentication is shutting down]

# 更换验证方式

既然密码验证方式已经不适用。那只能换个验证方式。

首先WSL环境下，是无法进行OAuth2授权的。

hexo部署使用 [Github Repository: hexo-deployer-git] 库，可以查阅该库支持的验证方式。

![](Snipaste_2023-03-10_21-27-01.png)

README指明，可以使用 Github 的 Access Token 进行验证。

首先，需要在 Gtihub 申请个人Token，可以通过 [Github Docs: Creating a personal access token] 指引进行申请。

注意，在分配权限时需要选择 repo 全部权限：

![](Snipaste_2023-03-10_21-56-44.png)


接着，需要修改hexo配置，添加：

```yml
deploy:
  type: git
  repo:
    github:
      url: https://github.com/<repository>.git
      branch: <branch name>
      token: <GITHUB_TOKEN>

# 例子：
deploy:
  type: git
  repo:
    github:
      url: https://github.com/isaaxite/blog.git
      branch: master
      # 这里使用了环境变量 $GITHUB_TOKEN
      token: $GITHUB_TOKEN
      # name: isaaxite
      # email: isaacgun@outlook.com
```

这里需要注意，虽然README有给出deploy的配置例子，但是不清晰！

![](Snipaste_2023-03-10_21-46-08.png)

比较多人也对此吐槽了，并因此开了个issue！

[Issue: Token deploy prompts for username #159]

另外，README推荐使用环境变量来配置 token。当然，如果项目是私有的或者对安全性无要求，可以直接将token直接配置在 `_config.yml` 中。

还有一个小点需要注意：不需要配置 `name` 和 `email`！

到此，配置即完成！


# [hexo-deployer-git]是怎么使用Token的

在阅读[hexo-deployer-git]部分源码后，得知：

1. 使用git命令push commit;
2. 使用 `spaw` 函数执行git命令；


## 使用git命令push

经阅读源码 [lib/deploy.js] 发现，最后是使用下面这句命令将本地commit推送到GitHub对应分支！ 

```shell
git push -u <repo.url> HEAD:<repo.branch> --force
```

详细代码可以参考 [附录-git push]

但这么看，也没有发现是怎么使用token的。

上面有两个未确定的点是 `<repo.url>` 和 `<repo.branch>`。接下来查看 `repo` 是怎么来的！


从另外一个文件（[lib/parse_config.js] ）中的部分源码中可以发现几句关键逻辑：

1. `repoUrl = new URL(url);`；
2. `repoUrl.username = userToken;`
3. `url = repoUrl.href;`

而 `url` 就是上面使用的 `<repo.url>`！详细代码参考[附录-parseObjRepo]。


以下是一个直观的小实验，展示token是如何被使用的：

1. 创建URL实例 repoUrl；
2. 设置 repoUrl.username；
3. 观测 repoUrl.href。

![](Snipaste_2023-03-10_18-19-20.png)

## 使用执行 spaw 执行 git 命令

在 [lib/deploy.js] 中知道，是使用 [Github Repository: hexojs/hexo-util] 的 `spaw` 执行 git 命令。

这个 `spaw` 推测是使用 [child_process]，类似常见的 npm lib 有：[shelljs]、[simple-git] 等等。

![](Snipaste_2023-03-10_17-59-25.png)

详细就不展开，感兴趣可以参考：
https://github.com/hexojs/hexo-util/blob/master/lib/spawn.ts


# 附录

## git push

以下是核心逻辑，完整代码参考：[lib/deploy.js]

```js
function git(...args) {
  return spawn('git', args, {
    cwd: deployDir,
    verbose: verbose,
    stdio: 'inherit'
  });
}

function push(repo) {
  return git('add', '-A').then(() => {
    return git('commit', '-m', message).catch(() => {
      // Do nothing. It's OK if nothing to commit.
    });
  }).then(() => {
    return git('push', '-u', repo.url, 'HEAD:' + repo.branch, '--force');
  });
}
```

## parseObjRepo

以下是核心逻辑，完整代码参考：[lib/parse_config.js]

```js
function parseObjRepo(repo) {
  let url = repo.url;
  let branch = repo.branch;
  const configToken = repo.token;

  if (!branch) {
    branch = testBranch(url);
  }
  if (rRepoURL.test(url)) {
    const match = url.match(rRepoURL);
    const scheme = match[1];

    if (configToken && (scheme === 'http' || scheme === 'https')) {
      let repoUrl, userToken;
      try {
        repoUrl = new URL(url);
      } catch (e) {
        throw new TypeError('Fail to parse your repo url, check your config!');
      }

      if (configToken.startsWith('$')) {
        userToken = process.env[configToken.substring(1)];
        if (!userToken) throw new TypeError('Fail to read environment varable: ' + configToken + ', check your config!');
      } else {
        userToken = configToken;
      }
      repoUrl.username = userToken;
      url = repoUrl.href;
    }
  }

  return {
    url: url,
    branch: branch || 'master'
  };
}
```

## 参考

- [Github Repository: hexo-deployer-git]

- [Github Docs: Creating a personal access token]

- [Github Repository: hexojs/hexo-util]

- [Issue: Token deploy prompts for username #159]


[lib/parse_config.js]:https://github.com/hexojs/hexo-deployer-git/blob/master/lib/parse_config.js

[lib/deploy.js]:https://github.com/hexojs/hexo-deployer-git/blob/master/lib/deployer.js

[附录-git push]:#git-push

[附录-parseObjRepo]:#parseObjRepo

[Github Repository: hexo-deployer-git]:https://github.com/hexojs/hexo-deployer-git

[hexo-deployer-git]:https://github.com/hexojs/hexo-deployer-git

[Github Docs: Creating a personal access token]:https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

[Github Repository: hexojs/hexo-util]:https://github.com/hexojs/hexo-util#spawncommand-args-options

[Issue: Token deploy prompts for username #159]:https://github.com/hexojs/hexo-deployer-git/issues/159

[shelljs]:https://www.npmjs.com/package/shelljs

[simple-git]:https://www.npmjs.com/package/simple-git

[child_process]:https://nodejs.org/docs/latest-v16.x/api/child_process.html

[Github Blog: Git password authentication is shutting down]:https://github.blog/changelog/2021-08-12-git-password-authentication-is-shutting-down/