# cherry-pick的简单使用

## 前言
提示一下尖括号和方括号的异同：
```
<必选>
[可选]
```

## 正文
- cherry-pick的作用
	提交一个当前分支没有的commit，这个commit来自其他分支。就结果而言，和merge一样，但是用cherry-pick却是可以保持分支树的美观、干净、合理。
	

- cherry-pick的基本语法：
    ```
    git cherry-pick [--edit] [-n] [-m parent-number] [-s] [-x] [--ff]
              [-S[<keyid>]] <commit>…​
    git cherry-pick --continue // 当出现冲突时，首先是要手动解决冲突，添加到工作区（不需要commit），然后就可以执行该命令继续之前停止的cherry-pick
    git cherry-pick --quit	
    git cherry-pick --abort
    
    git cherry-pick <start-commit-id>..<end-commit-id>
	git cherry-pick <start-commit-id>^..<end-commit-id>
    // 前者表示把<start-commit-id>到<end-commit-id>之间(左开右闭，不包含start-commit-id)的提交cherry-pick到当前分支；
    后者有"^"标志的表示把<start-commit-id>到<end-commit-id>之间(闭区间，包含start-commit-id)的提交cherry-pick到当前分支
    ```

