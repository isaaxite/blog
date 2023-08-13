---
title: Get Start Of Github Action
date: 2023-08-07 15:23:25
tags:
categories:
---

# 前言

最近持续迭代的npm包，[isubo]。功能已经完成得七七八八，因此开始逐渐完成包开发的一些基本设施，比如自动化的能力。在项目代码使用Github管理，在它开始之初已经略有了解 GitHub-Actions，模糊地知道Gtihub Actions 是 Github 提供的 CICD 工具。由于各种原因的将此增加自动化能力的工作置后到最近。

本文将围绕Github Actions展开，了解Gtihub Actions、CICD概念，常见的CICD。接着回归实际问题，详细了解Github Actions的使用、配置文件的常用配置项。最后，实践上面提到的 [isubo] 的自动化能力。


<!-- more -->

<details>
  <summary><strong>☕️ isubo 是什么？</strong></summary>
  <blockquote>
    <br/>
    <p>As we known, a lost of developer use github isses as their blog which is so great. However, the bad experience of writing articles on the issue page of github is really hard to describe. And Isubo was born for this 💪.

Isubo is a CLI tool to publish markdown content to github issues. It allows you to focus on writing posts in the local environment to obtain a comfortable experience, and gracefully solve the storage and publishing of posts and resources for you 🤟.</p>
    <br/>
  </blockquote>
</details>


# Git Actions

Git Actions是一个GitHub提供的持续集成和持续部署（CI/CD）工具。它允许开发团队在代码存储库中配置自动化的工作流程，以响应不同的事件触发器。

使用Git Actions，您可以在代码提交、分支创建、问题提出等事件发生时触发自定义的工作流程。这些工作流程由一个或多个任务（称为“作业”）组成，可以在不同的操作系统和环境中执行，例如Linux、Windows、macOS等。每个作业可以包含多个步骤，用于执行特定的操作，例如构建项目、运行测试、部署应用程序等。

通过在存储库中创建一个名为`.github/workflows`的目录，并在其中定义一个或多个YAML文件，您可以配置Git Actions工作流程。这些YAML文件指定了工作流程的触发条件、作业和步骤，并可以使用丰富的内置操作和自定义脚本来执行各种任务。

Git Actions提供了强大的自动化能力，可以显著简化软件开发过程中的工作流程。它与GitHub的紧密集成使得团队可以更轻松地构建、测试和部署他们的应用程序，并且可以与其他工具和服务（如Docker、AWS、Azure等）无缝集成，以满足各种需求。

# CICD

CI/CD（持续集成和持续交付/部署）是一种软件开发实践，旨在通过自动化构建、测试和部署过程来加快软件交付的速度和质量。CI/CD 流程通常与版本控制系统（如 Git）和自动化工具（如 Jenkins、Travis CI、CircleCI、GitLab CI/CD 等）结合使用。

以下是一个基本的 CI/CD 流程的示例：

1. 代码托管：将代码存储在版本控制系统中，如 Git。

2. 触发构建：当代码被推送到特定的分支（如主分支）或提交到特定的分支时，CI/CD 工具会自动触发构建过程。

3. 构建：CI/CD 工具会从代码仓库中获取最新的代码，并执行构建过程。构建过程可以包括编译代码、运行单元测试、生成构建产物等。

4. 测试：构建完成后，自动化测试工具会运行各种测试，包括单元测试、集成测试、端到端测试等。测试的目的是确保代码的质量和功能的稳定性。

5. 静态分析：可以使用静态代码分析工具来检查代码质量，并提供反馈和建议以改善代码。

6. 部署：如果构建和测试成功，CI/CD 工具会自动将构建产物部署到目标环境，如开发、测试或生产环境。部署可以包括将代码复制到服务器、配置环境变量、启动服务等操作。

7. 自动化流程：整个 CI/CD 过程可以通过配置和脚本自动化执行，以确保一致性和可重复性。

8. 监控和反馈：在部署完成后，可以设置监控和日志记录系统来跟踪应用程序的性能和行为。如果出现问题，可以通过集成警报系统发送通知。

CI/CD 的好处包括减少手动操作、提高开发团队的效率、加速软件交付、提高代码质量和稳定性等。

具体的 CI/CD 流程会因组织和项目的需求而有所不同，可以根据团队的实际情况进行定制和扩展。常见的 CI/CD 工具提供了丰富的功能和配置选项，使您能够根据项目的特定需求来创建自定义的 CI/CD 流程。

# 常见的CICD

| 工具/平台      | 描述                                                     | 特点                                                         | 出现时间 |
|---------------|----------------------------------------------------------|--------------------------------------------------------------|----------|
| Jenkins       | 开源的 CI/CD 工具，提供丰富的插件和扩展性                         | 可扩展性强，支持各种复杂构建和部署场景                              | 2004年   |
| Bamboo        | Atlassian 公司提供的 CI/CD 工具，适用于大型企业和团队               | 与其他 Atlassian 产品无缝集成，适用于复杂的开发和部署需求              | 2007年   |
| TeamCity      | JetBrains 公司提供的 CI/CD 工具，具有简单易用的界面和强大的可扩展性  | 提供易用的界面和强大的可扩展性，适用于各种构建、测试和部署场景         | 2006年   |
| Travis CI     | 托管的 CI/CD 平台，与 GitHub 集成紧密                             | 简单易用，广泛用于开源项目                                        | 2011年   |
| CircleCI      | 基于云的 CI/CD 平台，适用于小型和中型项目                         | 配置简单，提供快速的构建和部署                                    | 2011年   |
| GitLab CI/CD  | GitLab 内置的 CI/CD 工具，与 GitLab 代码托管平台紧密结合            | 与 GitLab 紧密集成，便于代码管理和版本控制                           | 2011年   |
| Azure DevOps  | Microsoft 提供的全面开发和交付工具，适用于云原生应用程序开发和部署 | 提供完整的开发和交付生命周期管理，与 Microsoft 技术生态紧密集成        | 2018年   |
| GitHub Actions| GitHub 提供的集成 CI/CD 服务，与 GitHub 代码仓库紧密结合            | 与 GitHub 紧密集成，提供丰富的操作库和工作流程定义                    | 2019年   |

以上是按照工具/平台的出现时间排序的常见 CI/CD 工具和平台的表格。













<!-- Defined Refs -->
[isubo]: https://github.com/isaaxite/deploy-posts-to-github-issue
