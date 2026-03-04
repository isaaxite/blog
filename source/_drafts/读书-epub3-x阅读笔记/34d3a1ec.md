---
title: 读书-epub3.x阅读笔记
excerpt: 读书-epub3.x阅读笔记
date: 2025-06-02 11:11:33
tags:
categories:
---

# 背景

阅读 idpf 的 epub 3.0.1 手册。原文是英文，内容结构也不是我熟悉的，因此做些解析，重点记录。手册来源：[https://idpf.org/epub/301/spec/epub-publications.html](https://idpf.org/epub/301/spec/epub-publications.html)

- 索引（点击跳转到解析的）使用：[https://idpf.org/epub/idx/](https://idpf.org/epub/idx/)

- manifest item 的 Properties 属性使用：[4.3.4 Manifest `item` Properties](https://idpf.org/epub/301/spec/epub-publications.html#sec-item-property-values "Link here") 


# Terminology（术语）

- Conformance：翻译为“一致性”。从内容上看，可能是开发时必须遵守的规范，比如 “2.1 Content Conformance”
- [Package Document](https://idpf.org/epub/301/spec/epub-publications.html#gloss-package-document "Package Document")：指的应该就是 content.opf
- raster images：位图，如 jpg、png等常见格式的图片
- vector images（矢量图像），如svg

# 记录

> [!NOTE]
> Unique Identifier
> 
> The Unique Identifier is the primary identifier for an [EPUB Publication](https://idpf.org/epub/301/spec/epub-publications.html#gloss-epub-publication "EPUB Publication"), as identified by the `[unique-identifier](https://idpf.org/epub/301/spec/epub-publications.html#attrdef-package-unique-identifier)` attribute. The Unique Identifier may be shared by one or many [Rendition](https://idpf.org/epub/301/spec/epub-publications.html#gloss-rendition "Rendition")s of the same EPUB Publication that conform to the EPUB standard and embody the same content.
> 
> The Unique Identifier is less granular than the ISBN. However, significant revision, abridgement, etc. of the content requires a new Unique Identifier.

[unique-identifier](https://idpf.org/epub/301/spec/epub-publications.html#attrdef-package-unique-identifier) 属性，从引用中判断在内容变更（开发中的feat，bugfix）时，需要更新这个唯一标识。这个时临时的猜测，还需要验证。

> [!NOTE]
> Release Identifier
> 
> The Release Identifier allows any instance of an [EPUB Publication](https://idpf.org/epub/301/spec/epub-publications.html#gloss-epub-publication "EPUB Publication") to be compared against another to determine if they are identical, different versions, or unrelated.
> 
> Refer to [Release Identifier](https://idpf.org/epub/301/spec/epub-publications.html#sec-opf-metadata-identifiers-pid "4.1.2 Release Identifier") for more information.

参考 Unique Identifier 的说明，开发时也具备同样功能。实际那个符合开发时使用有待验证。我关心的时，唯一标识的变化是否影响修复、功能的更新！

-----

关于资源的声明：

> [!NOTE]
> All Publication Resources
> 
> [›](https://idpf.org/epub/301/spec/epub-publications.html#confreq-manifest "Link here") All [Publication Resource](https://idpf.org/epub/301/spec/epub-publications.html#gloss-publication-resource-cmt-or-foreign "Publication Resource")s must be listed in the Package Document (as defined in [manifest](https://idpf.org/epub/301/spec/epub-publications.html#sec-manifest-elem "3.4.10 The manifest Element")), adhere to the [constraints for Core Media Types and Fallback](https://idpf.org/epub/301/spec/epub-publications.html#sec-publication-resources "5 Publication Resources") and be located as per [Publication Resource Locations](https://idpf.org/epub/301/spec/epub-publications.html#sec-resource-locations "5.3 Publication Resource Locations").

资源只要被使用，都需要在 manifest 标签中声明。这个准则早前已经知悉，但手册中的描述证实了。

----

至少包含一个导航文件，即不能不编写导航相关的代码！

> [!NOTE]
> The EPUB Navigation Document
> 
> [›](https://idpf.org/epub/301/spec/epub-publications.html#confreq-nav-occur "Link here") It must contain exactly one [EPUB Navigation Document](https://idpf.org/epub/301/spec/epub-publications.html#gloss-content-document-epub-nav "EPUB Navigation Document") conformant to the content requirements defined in [EPUB Navigation Documents — Content Conformance](https://idpf.org/epub/301/spec/epub-contentdocs.html#sec-xhtml-nav-content-conf) [[ContentDocs301]](https://idpf.org/epub/301/spec/epub-publications.html#refContentDocs3 "EPUB Content Documents 3.0.1") .


----

> [!NOTE]
> EPUB Pronunciation Lexicons
> 
> [›](https://idpf.org/epub/301/spec/epub-publications.html#confreq-pls "Link here") It may contain zero or more PLS Documents conformant to the content requirements defined in [PLS Documents — Content Conformance](https://idpf.org/epub/301/spec/epub-contentdocs.html#sec-pls-conf-content) [[ContentDocs301]](https://idpf.org/epub/301/spec/epub-publications.html#refContentDocs3 "EPUB Content Documents 3.0.1") .

pls 文件，可能就是在 epub 电子书中正文中的解析性跳转（一般跳到章节底部）

---

> [!NOTE]
> The [Package Document](https://idpf.org/epub/301/spec/epub-publications.html#gloss-package-document "Package Document") carries bibliographic and structural metadata about a [Rendition](https://idpf.org/epub/301/spec/epub-publications.html#gloss-rendition "Rendition") of an [EPUB Publication](https://idpf.org/epub/301/spec/epub-publications.html#gloss-epub-publication "EPUB Publication"), and is thus the primary source of information about how to process and display that Rendition.

说明了 package document 的作用是：编写目录、metadata、资源如何处理和展示的文件


----

## package document 的文件后缀

> [!NOTE]
> File Properties
> 
> [›](https://idpf.org/epub/301/spec/epub-publications.html#confreq-package-fileprops-name "Link here") The Package Document filename should use the file extension `.opf`.
> 
> Package Documents have the MIME media type `application/oebps-package+xml` [[RFC4839]](https://idpf.org/epub/301/spec/epub-publications.html#refRFC4839 "Media Type Registrations for the Open eBook Publication Structure (OEBPS) Package File (OPF) (RFC 4839)").

明确指出：package document 的文件后缀必须是 `.opf`


----

## Release Identifier(用于开发更新)

针对bug修复，次要功能更新等变动，epub3中使用发行标识（Release Identifier）进行区分同一个唯一标识（Unique Identifier）的epub书籍。

> #### 4.1.2 Release Identifier
> 
> The [Unique Identifier](https://idpf.org/epub/301/spec/epub-publications.html#gloss-unique-identifier "Unique Identifier") of an [EPUB Publication](https://idpf.org/epub/301/spec/epub-publications.html#gloss-epub-publication "EPUB Publication") typically should not change with each minor revision to the package or its contents, as Unique Identifiers are intended to have maximal persistence both for referencing and distribution purposes. Each release of an EPUB Publication normally requires that the new version be uniquely identifiable, however, which results in the contradictory need for reliable Unique Identifiers that are changeable.
> 
> To redress this problem of identifying minor modifications and releases without changing the Unique Identifier, this specification defines the semantics for a _Release Identifier_, or means of distinguishing and sequentially ordering EPUB Publications with the same Unique Identifier. The Release Identifier is not an actual property in the package `metadata` section, but is a value that can be obtained from two required pieces of metadata: the Unique Identifier and the last modification date of the Rendition.
> 
> When the taken together, the combined value represents a unique identity that can be used to distinguish any particular version of an EPUB Publication from another. To ensure that a Release Identifier can be constructed, each [Rendition](https://idpf.org/epub/301/spec/epub-publications.html#gloss-rendition "Rendition") must include exactly one [[DCTERMS]](https://idpf.org/epub/301/spec/epub-publications.html#refDCTERMS "DCMI Metadata Terms") modified property containing its last modification date (see [meta](https://idpf.org/epub/301/spec/epub-publications.html#elemdef-meta)). The value of this property must be an XML Schema [[XSD-DATATYPES]](https://idpf.org/epub/301/spec/epub-publications.html#refXSDDatatypes "XML Schema Part 2: Datatypes Second Edition") dateTime conformant date of the form:
> 
> CCYY-MM-DDThh:mm:ssZ


发行标识不是一个meta属性，它是由唯一标识和最后修改时间组成的：

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
	<dc:identifier id="pub-id">urn:uuid:A1B0D67E-2E81-4DF5-9E67-A64CBE366809</dc:identifier>
	<meta property="dcterms:modified">2011-01-01T12:00:00Z</meta>
	…
</metadata>

results in the Package ID:

urn:uuid:A1B0D67E-2E81-4DF5-9E67-A64CBE366809@2011-01-01T12:00:00Z
```


### 计划

发行标识的核心是最后修改时间。在每次打包 epub 时都应该更新这个属性，而这个属性是存放在metadata标签内的。为了自动化，应该：

1. 将content.opf做成模板化
	1. 寻找合用的xml模板（不限制必须是xml，只要可以实现模板替换即可）
2. 自动生成时间戳
	1. 首先需要封装打包命令；
	2. 时间戳的生成、模板替换前置加入到打包命令

## metadata 标签必须是首个

> [!NOTE]
> Element Name
> 
> `metadata`
> 
> Usage
> 
> Required first child of `[package](https://idpf.org/epub/301/spec/epub-publications.html#elemdef-opf-package)` .

手册中明确指出，metadata 标签必须是 package 标签的第一个标签！

---
metadata标签至少有三个子标签和 `dcterms:modified`：

```xml
<package … unique-identifier="pub-id">
	…
	<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
		<dc:identifier id="pub-id">urn:uuid:A1B0D67E-2E81-4DF5-9E67-A64CBE366809</dc:identifier>
		<dc:title>Norwegian Wood</dc:title>
		<dc:language>en</dc:language>
		<meta property="dcterms:modified">2011-01-01T12:00:00Z</meta>
	</metadata>
	…
</package>
```

> [!NOTE]
> The minimal required metadata that each Rendition of an [EPUB Publication](https://idpf.org/epub/301/spec/epub-publications.html#gloss-epub-publication "EPUB Publication") must include consists of three elements from the Dublin Core Metadata Element Set [[DCMES]](https://idpf.org/epub/301/spec/epub-publications.html#refDCMES "Dublin Core Metadata Element Set, Version 1.1") — `[title](https://idpf.org/epub/301/spec/epub-publications.html#sec-opf-dcidentifier "3.4.3 The DCMES identifier Element")` , `[identifier](https://idpf.org/epub/301/spec/epub-publications.html#elemdef-opf-dcidentifier)` and `[language](https://idpf.org/epub/301/spec/epub-publications.html#elemdef-opf-dclanguage)` — together with the `[modified](https://idpf.org/epub/301/spec/epub-publications.html#last-modified-date)` property from DCMI Metadata Terms [[DCTERMS]](https://idpf.org/epub/301/spec/epub-publications.html#refDCTERMS "DCMI Metadata Terms").


## DCMES 元素

### contributor

> [!NOTE]
> The `contributor` element is used to represent the name of a person, organization, etc. that played a secondary role in the creation of the content of an EPUB Publication.

注意：contributor 元素是 secondary role


### creator

> [!NOTE]
> The `creator` element represents the name of a person, organization, etc. responsible for the creation of the content of an EPUB Publication. The `[role](https://idpf.org/epub/301/spec/epub-publications.html#role)` property can be [attached](https://idpf.org/epub/301/spec/epub-publications.html#attrdef-meta-refines) to the element to indicate the function the creator played in the creation of the content.
> 
> The following example shows how to represent a `creator` as an author using a MARC relators term.

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    …
    <dc:creator id="creator">Haruki Murakami</dc:creator>
    <meta refines="#creator" property="role" scheme="marc:relators" id="role">aut</meta>
    …
</metadata>
```

==疑问点： role 属性的内容是任意的，还是固定集合中选取的？==

在阅读 scheme 的描述时了解到关于 aut 的信息（role 属性的内容）：

> [!NOTE]
> 
> ```xml
> <meta refines="#creator" property="role" scheme="marc:relators" id="role">aut</meta>
> ```
> 
> - **`property="role"`**：表示这个 `<meta>` 在定义角色（如作者、译者等）。
>     
> - **`scheme="marc:relators"`**：声明 `aut` 这个角色代码遵循 **MARC Relators 标准**（图书馆界通用的责任角色编码体系）。
>     
> - **`aut`**：在 MARC Relators 中代表 "Author"（作者）。


## meta 中的 scheme

scheme 属性的作用是声明当前与此关联的属性是遵循那个通用标准，如上面的例子中的`scheme="marc:relators"`，在 `marc:relators` 标准中，aut 就不是任意，而是确定的集合中的一个！


## 发布日期

> [!NOTE]
> The DCMES `date` Element
> 
> The `date` element must only be used to define the publication date of the [EPUB Publication](https://idpf.org/epub/301/spec/epub-publications.html#gloss-epub-publication "EPUB Publication"). The publication date is not the same as the [last modified date](https://idpf.org/epub/301/spec/epub-publications.html#last-modified-date) (the last time the [Rendition](https://idpf.org/epub/301/spec/epub-publications.html#gloss-rendition "Rendition") was changed), which must be included using the [[DCTERMS]](https://idpf.org/epub/301/spec/epub-publications.html#refDCTERMS "DCMI Metadata Terms") modified property.
> 
> It is recommended that the date string conform to [[ISO8601]](https://idpf.org/epub/301/spec/epub-publications.html#refISO8601 "ISO 8601:2004 Data elements and interchange formats -- Information interchange -- Representation of dates and times"), particularly the subset expressed in W3C Date and Time Formats [[DateTime]](https://idpf.org/epub/301/spec/epub-publications.html#refDateTime "Date and Time Formats"), as such strings are both human and machine readable.
> 
> The following example shows a publication date.

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
	…
	<dc:date>2000-01-01T00:00:00Z</dc:date>
	…
</metadata>
```

这是书籍官方的 “发布日期”，注意与更新日期（last modified date）区分

## `meta` 的 `property` 属性

`property` 是 `<metadata>` 的子标签（`<meta>`）中的属性（如，`property="alternate-script"`）。

参考：[https://idpf.org/epub/301/spec/epub-publications.html#sec-meta-property-values](https://idpf.org/epub/301/spec/epub-publications.html#sec-meta-property-values)


### alternate-script

用于 title 和 creator 标签国际化的附属标签：

```xml
<metadata>
    <dc:title>Book Title</dc:title>
    <dc:title xml:lang="es" alternate-script="es">Título del libro</dc:title>
</metadata>
```
上面第二个 title 标签，中指定了 alternate-script 属性，es 是西班牙语的简称。

## display-seq

定义显示顺序。通过 meta 标签 + refines + display-seq 属性定义，meta 标签包含的内容是数字，数字越大，排序越往后！

```xml
<meta refines="#t2" property="display-seq">1</meta>
```

## title-type

标题类型。类型：

- **main**：主要标题
- **subtitle**：副标题
- **short**：短标题
- **collection**：集合标题
- **edition**：版本标题
- **expanded**：扩展标题

> [!NOTE]
> The title-type property indicates the form or nature of a `title`.
> 
> When the title-type value is drawn from a code list or other formal enumeration, the [scheme](https://idpf.org/epub/301/spec/epub-publications.html#attrdef-meta-scheme) attribute should be attached to identify its source. When a scheme is not specified, Reading Systems should recognize the following title type values: `main`, `subtitle`, `short`, `collection`, `edition` and `expanded`.|

例子：

```xml
<meta refines="#title" property="title-type">main</meta>
```

## rendition:flow

定义电子书内容的翻页方式。

```xml
<meta property="rendition:flow">scrolled-doc</meta>
```
可选值：

- **paginated**：内容以分页形式显示，每页需要翻页。
- **scrolled-continuous**：内容在连续滚动中显示，用户可以上下滚动查看所有内容。
- **scrolled-doc**：类似于连续滚动，但通常包含文档导航，用户可以在文档中快速跳转。
- **auto**：根据阅读系统的默认设置或用户偏好自动选择处理方式。


# 反馈

## 发行标识无效

使用发行标识无法解决，在foliate中，《胜利的女人》最后三章在二次打开（从书架）无法显示；样式（h2做了居中处理）丢失


# 附录

## 必要待阅

- https://idpf.org/epub/301/spec/epub-ocf.html
- https://idpf.org/epub/301/spec/epub-contentdocs.html