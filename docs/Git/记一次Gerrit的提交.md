最近经用到的一条命令：
```
git push origin HEAD:refs/for/<remote-branch>
```
`git push`用得很多，一般我是这么用的：`git push <remote> <local branch>`

当然直接执行
```
git push origin <local branch>
```
当然是不行，一定会被rejected！

对比：`git push origin HEAD:refs/for/<remote-branch>`
我是真的有点迷了：
- HEAD 是什么gui？
- “:“又是有什么？
- refs/for/是什么？

经过一番Google后，总算是有点搜索：
- HEAD 是什么gui？
HEAD是指当前本地分支。

- “:“又是有什么？
git push其实是可以这样写：
```
git push <remote> <local branch>:<remote branch>
```

- refs/for/是什么？
这个我还不是特别清楚，我在Gerrit上看到这么一个分支：
![image](https://user-images.githubusercontent.com/25907273/40575156-0ce1ab40-6112-11e8-8a6c-ec83505af318.png)
可能会有点关系！
&nbsp;
然后再网上也看到这样的描述：
>简单点说，就是refs/for/mybranch需要经过code review之后才可以提交；refs/heads/mybranch不需要code review。
