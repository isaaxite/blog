---
title: Fedora41(gnome47+)
excerpt: Fedora41(gnome47+)
date: 2025-03-24 14:43:10
tags:
categories:
---
# IME 更换
## ibus-rime

ibus-rime的汉语名称是：中州韵，是 linux 端的安装包

共享文件夹：
```shell
# isaac @ fedora in /usr/share/rime-data [16:20:03] 
$ ls
array30.dict.yaml                double_pinyin_pyjj.schema.yaml   luna_pinyin_tw.schema.yaml  terra_pinyin.dict.yaml
array30.schema.yaml              double_pinyin.schema.yaml        luna_quanpin.schema.yaml    terra_pinyin.schema.yaml
bopomofo_express.schema.yaml     emoji.dict.yaml                  pinyin_simp.dict.yaml       wubi86.dict.yaml
bopomofo.schema.yaml             emoji.schema.yaml                pinyin_simp.schema.yaml     wubi86.schema.yaml
bopomofo_tw.schema.yaml          essay.txt                        quick5.dict.yaml            wubi_pinyin.schema.yaml
cangjie5.dict.yaml               hkcantonese.schema.yaml          quick5.schema.yaml          wubi_trad.schema.yaml
cangjie5_express.schema.yaml     ibus_rime.yaml                   sampheng.schema.yaml        wugniu_lopha.dict.yaml
cangjie5.schema.yaml             ipa_xsampa.dict.yaml             scj6.dict.yaml              wugniu_lopha.schema.yaml
combo_pinyin_kbcon.schema.yaml   ipa_xsampa.schema.yaml           scj6.schema.yaml            wugniu.schema.yaml
combo_pinyin_left.schema.yaml    jyutping.dict.yaml               soutzoe.dict.yaml           yale.schema.yaml
combo_pinyin.schema.yaml         jyutping.schema.yaml             soutzoe.schema.yaml         zyenpheng.dict.yaml
default.yaml                     luna_pinyin.dict.yaml            stenotype.schema.yaml       zyenpheng.schema.yaml
double_pinyin_abc.schema.yaml    luna_pinyin_fluency.schema.yaml  stroke.dict.yaml
double_pinyin_flypy.schema.yaml  luna_pinyin.schema.yaml          stroke.schema.yaml
double_pinyin_mspy.schema.yaml   luna_pinyin_simp.schema.yaml     symbols.yaml

```

现成的，rime 提供的小鹤双拼方案：`https://github.com/rime/rime-double-pinyin`

### 设置简繁

使用 rime 现成的小鹤双拼方案，默认是繁体字输出。下面设置简体字输出为默认值：

1 找到 rime 提供的双拼文件 `double_pinyin_flypy.schema.yaml`；

2 找到 `switches` - `name: simplification`

```shell
	switches:
  - name: ascii_mode
    reset: 0
    states: [ 中文, 西文 ]
  - name: full_shape
    states: [ 半角, 全角 ]
  - name: simplification    # 轉換開關
    states: [ 漢字, 汉字 ]

engine:
  filters:
    - simplifier  # 必要組件一
    - uniquifier  # 必要組件二	 
```

增加 `reset: 1`
```shell
- name: simplification    # 轉換開關
		reset: 1
    states: [ 漢字, 汉字 ]
```

`reset` 的值取决于 `states` 数组的序号。

3 重新部署。rime 的默认输入即为简体输入。

参考：https://github.com/rime/home/wiki/CustomizationGuide#%E4%B8%80%E4%BE%8B%E5%AE%9A%E8%A3%BD%E7%B0%A1%E5%8C%96%E5%AD%97%E8%BC%B8%E5%87%BA


ibus-rime 设置横排无效的解决方法：https://github.com/rime/ibus-rime/issues/52


## fcitx5替换默认ibus

当前是一个的尝试——使用 fcitx5 替换 ibus(fedora41(gnome47) 的默认的输入法框架)，非教程！

### 目的

- 修改输入法选词翻页的快捷键；
- 修改输入法选词菜单的字体大小。
### 背景

```shell
# System Details Report
---

## Report details
- **Date generated:**                              2025-03-14 05:04:39

## Hardware Information:
- **Hardware Model:**                              QEMU Standard PC _Q35 + ICH9, 2009_
- **Memory:**                                      4.0 GiB
- **Processor:**                                   Intel® Core™ i5-8600K × 6
- **Graphics:**                                    Software Rendering
- **Disk Capacity:**                               21.5 GB

## Software Information:
- **Firmware Version:**                            1.16.3-3.fc41
- **OS Name:**                                     Fedora Linux 41 (Workstation Edition)
- **OS Build:**                                    (null)
- **OS Type:**                                     64-bit
- **GNOME Version:**                               47
- **Windowing System:**                            Wayland
- **Kernel Version:**                              Linux 6.11.4-301.fc41.x86_64

```
### 安装 fcitx5 及其相关包

```shell
sudo dnf install fcitx5 fcitx5-gtk fcitx5-qt fcitx5-configtool fcitx5-chinese-addons
```
安装过程见：[installtion.log](fcitx5_fcitx5-gtk_fcitx5-qt_fcitx5-configtool_fcitx5-chinese-addons_installtion.log)


### 查看默认ibus的版本

```shell
lok@localhost-live:~$ ibus version
IBus 1.5.31-beta2
```


### 删除 ibus

```shell
lok@localhost-live:~$ sudo dnf remove ibus
Failed to resolve the transaction:
Problem: installed package gnome-shell-47.0-1.fc41.x86_64 requires ibus(x86-64) >= 1.5.2, but none of the providers can be installed
  - conflicting requests
  - problem with installed package
lok@localhost-live:~$ 
```


# N 显卡驱动
