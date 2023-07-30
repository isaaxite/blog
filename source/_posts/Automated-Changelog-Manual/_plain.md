
# 前言

## 需要自动化changelog的原因？

- 最近开发issue-blog，isubo

- 已经 有300commit的体量；

- 版本迭代已经有 9个

- 后面有想增加的功能、优化、重构的计划，应该还会有bug的修复；

- 需要一个渠道、方式告诉使用者、这些版本变动，写changelog；

- changelog

- 一个人开发，精力聚焦在 功能新增、优化、重构 和 bug修复

## changelog的预期

- 一个版本说明列表

- 每个版本包含标题和内容，标题主要内容是版本号，内容的主要内容是介绍新增的功能、修复的bug，实现的优化 和 bug修复等等。

```markdown
// 标题
# 版本号-1

// 内容
- 新增的功能 1
- 修复的bug
- 优化
- ...
```

## 自动化changelog的优点

来自 gpt 的自动化changle的优点：

自动化生成 changelog 的好处如下：

1. 简化了 changelog 的创建流程：手动创建 changelog 可能需要花费大量的时间和精力，特别是对于大型项目来说。自动化创建 changelog 可以减少这种繁琐的工作，允许开发者更专注于编写代码和解决问题。

2. 提高了 changelog 的准确性：手动创建 changelog 可能会出现遗漏或错误，因为开发者需要手动记录每个版本的更改。自动化创建 changelog 可以消除这些错误，因为它们会自动从版本控制系统中提取信息。

3. 帮助团队更好地协作：自动化创建 changelog 可以帮助团队更好地协作和沟通。开发者可以更轻松地了解项目的演变历史和当前状态，从而更好地协调和分配任务。

4. 提高了项目的可维护性：自动化创建 changelog 可以提高项目的可维护性。由于 changelog 可以自动生成，因此开发者可以更容易地了解每个版本的更改，从而更好地维护和更新代码。

总之，自动化创建 changelog 可以提高项目的开发效率、降低错误率、加强团队协作，从而提高项目的可维护性和稳定性。


## 自动化changelog的思路

1. changlog 基于 commit 生成，所以需要规范 commit；

2. 有哪些规范？

3. 约束 commit，让它合符规范；

4. 优化：降低心智成本，半自动化commit编写；

5. 由创建版本这个行为，产生changelog。以版本为节点生成 changelog，所以版本管理；

6. 制定合理的版本管理策略：

  - 版本管理工具，常见有哪些？

  - 使用工具约束 版本号

  - 了解版本管理工具的生命周期和原理，这样可以让changlog的生成更加舒服、顺滑。

7. 生成changelog，现成的解决方案有哪些？

  - conventional-changelog-cli；

  - Standard Version；

8. conventional-changelog-cli 怎么生成？

9. Standard Version 怎么生成？

10. 工作流

---

开发工作以 commit 为基本单位展开，系列的 commit 组成一个又一个的版本，版本的创建需要 CHANGELOG 来说明描述。所谓酒香也怕巷子深。新版本的创建，需要发布到各个地方，Github仓库、npm等。接着展开下一个版本的开发，循环往复，周而复始。

---

*CI*

*1. developer 基于main创建开发分支（feat、fix...）*

*2. 分支内容开发完毕，developer 申请 PR， 提交给 master*

*3. master 审批，确认申请。*

*4. developer 合并分支到main*

*5. 合并动作触发CI/CD：*
  - 版本管理；
  - build源码；
  - push git-tag
  - npm包发布；

*本地*

*2. 分支开发完，push代码；*

*3. 在main分支，保持最新，然后合并开发分支；*

`post-merge` Git钩子：

1）更新与合并

- 更新：`git fetch origin main && git pull origin main`；

- 合并：`git merge <branch>`

2）version
  - 创建版本
  - 创建git-tag
  - 创建版本CHANGELOG

3）publish：
  - push commit 和 git-tag
  - npm login && 那匹马publish

4. 做版本管理、生成changelog，push git-tag，发布npm；


限制main分支仅可做 3、4操作，开发分支禁止，仅可开发。


---

CI 和 CD 都是 DevOps 中的重要概念，用于自动化软件开发和发布的流程。

CI（Continuous Integration，持续集成）是指在开发过程中，将代码频繁地集成到共享的主干（通常是版本控制系统）中，然后进行自动化的构建和测试。这样可以及早发现和解决代码中的问题，避免代码库中的错误逐渐累积，从而保证软件质量和开发效率。

CD（Continuous Delivery，持续交付）和 Continuous Deployment（持续部署）则是指在 CI 的基础上，自动化地将软件构建和测试通过后的更新发布到目标环境中。持续交付通常指将软件构建成可部署的包，并将其交付给测试团队或用户进行测试和验证。持续部署则更进一步，将构建和测试通过后的软件自动部署到生产环境中，从而实现快速、可靠、低风险的软件发布。

总之，CI 和 CD 都是 DevOps 中的关键实践，可以帮助团队实现更高效、高质量、快速、可靠的软件开发和发布流程。

CI/CD 放到服务端做（github），或者放到本地做

GitHub Actions是github的CI/CD

---

非main分支禁止：

1. npm version | npx standard-version

2. npm publish；

3. 禁止修改package.json的version

---

npm version 做了：

1. 修改package.json的version；

2. 提交了version的commit

3. 创建了 version git-tag

---

npm version是否可以拦截并终止？

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "scripts": {
    "preversion": "if [ $NODE_ENV != 'production' ]; then echo 'Error: Only production environment can update package version.'; exit 1; fi"
  }
}
```

---

*单人开发*

  - commit 变动；

  - 版本管理内含的2个基本行为：1）生成changlog；2）生成 git-tag

  - 发布 git-tag，push 分支commits；

  - 源码 build，发布版本到npm；

*多人开发*

1. 只能在main分支做版本管理；
  1）添加禁用其他分支常见版本的逻辑；

2. 自动化版本管理，在合于main分支时通过 githook 触发版本管理逻辑
  思考：*不能每个meged都发包，需要有逻辑判断。*
  思路1：上一个版本到HEAD的commit，检查是否包含需要发包的commit；
  思路2：根据分支名，限定仅仅 feat/xxx、fix/xxx等等分支的合并才需要发包

  - 所以，将 *单人开发的逻辑*

  - 限制 main 分支可以做的commit事情：
    合并的动作可能发生在本地；可能发生在远端仓库，比如github，发起PR，master负责通过PR。
    1）版本commit；
    2）合并子分支：合并前先拉去最新变动，然后合并；


TODO

- 为什么要开始自动化 CHANGELOG?

- 现成的自动化 CHANGELOG 有那些解决方案？

- CHANGELOG 的来源是 commits，那些 commmit 应该 自动化到 CHANGELOG ?

- commits 可以被筛选的前提是commits有规律的，意味commits需要被规范化。commits 的规范化标准如何制定？

- 人类的特性是混乱，人类是不可信的。需要强制执行 commits 规范，尽管是要求的自动化的自己！强制执行的解决方案有那些，是否存在现成的？

- 强制commit规范的原理探讨一下。

