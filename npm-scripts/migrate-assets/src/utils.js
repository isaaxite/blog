const fs = require('fs');
const path = require('path');
class PathTree {
  constructor({ filter }) {
    this.filter = filter;
  }

  initNode(parent = null) {
    return { parent, value: '', children: [] };
  }

  buildChildren(dirPath, parent) {
    const names = fs.readdirSync(dirPath);
    const children = [];
    for (const name of names) {
      const subPath = path.join(dirPath, name);
      if (
        !fs.statSync(subPath).isDirectory()
        || !this.filter({ dirPath, name })
      ) {
        continue;
      }
      const node = this.initNode();
      node.value = name;
      node.parent = parent;
      node.children = this.buildChildren(subPath, node);
      children.push(node);
    }

    return children;
  }

  buildByDirPaths(dirPaths) {
    const root = this.initNode();

    for (const dirPath of dirPaths) {
      const node = this.initNode();
      node.value = path.basename(dirPath);
      node.parent = root;
      node.children = this.buildChildren(dirPath, node);
      root.children.push(node);
    }

    return root;
  }
}

module.exports = { PathTree };
