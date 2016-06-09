"using strict";

/**
 * Clone a binary tree
 *
 * @param {BEE.Node} node - Node to clone.
 *     If you change a parent property in your cloned BST, the change will also
 *     be applied on the original BST. That is why all parents in the path
 *     between the root and "node" will be also cloned.
 * @param {BEE} cloned_bst - One can send a new BEE() that will be used to
 *     store the clone. Otherwise, it will be initialize in the 1st recursion.
 *
 * @returns {[cloned_bst, cloned_node]} Returns an the cloned BST and a
 *     reference to the cloned node. Cloned node can be useful if you want
 *     to get the equivalent point in the cloned BST of where you were in the
 *     original tree.
 */
BEE.prototype.clone = function(node=null, cloned_bst=null) {
  let root_node = this.getRootNode();

  // if node is null, will only copy the root. Recursively clone the indicated
  // node and its parents otherwise.
  if(node == undefined)
    node = root_node;
  if(cloned_bst == undefined)
    cloned_bst = new BEE();

  let cloned_node = cloned_bst.createNode(node.data);
  for(let branch of ["left", "right"]) {
    let child = node[branch + "Branch"];
    if(child)
      cloned_node.addLeaf(child, {branch: dir});
  }

  let p = node.parent;
  if(p) {
    // on which branch is the current node beside p
    let branch = (p.left === node) ? "left" : "right";
    let [_, cloned_p] = this.clone(node=p, cloned_bst=cloned_bst);

    // replace node by cloned_node in cloned_p
    cloned_p[branch + "Branch"] = null;
    cloned_p.children--;
    cloned_node.add_parent(cloned_p, {branch: branch});
  }
  cloned_node.update();

  return [cloned_bst, cloned_node];
};


var jam = {
  add_room: function (bst, room) {
  },

  jam: function (rooms) {
    bst = new BEE();
    let node = bst.createNode(data);
  }
}

// vim: set ts=2 sw=2:
