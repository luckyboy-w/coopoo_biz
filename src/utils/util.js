
/**
 * 把一个树的子list的树结构转换成全平级的list结构
 */
export function treeChildToList(tree, list) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].children == null || tree[i].children.length == 0) {
      list.push(tree[i])
    } else {
      treeChildToList(tree[i].children, list)
    }
  }
}
