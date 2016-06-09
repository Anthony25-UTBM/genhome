"using strict";


BEE.prototype.clone = function(node=null) {
  let cloned_bst;

  // if node is null, will only copy the root. Recursively clone the indicated
  // node and its parents otherwise.
  if(node !== null && node.parents.indexOf(this.getRootNode()) > -1) {
    let cloned_node = cloned_bst.buildNode(node.data, node.left, node.right);

    for(let p of node.parents) {
      // on which branch is the current node beside p
      let branch = (p.left === node) ? "left" : "right";
      cloned_bst, cloned_p = this.clone(node=p);

      // delete the old leftBranch in cloned_p
      cloned_p[branch + "Branch"] = null;
      cloned_p.children--;

      cloned_node.add_parent(cloned_p, {branch: branch });
    }
    cloned_node.update();
  }
  else {
    let cloned_bst = BEE();
    let cloned_node = cloned_bst.createNode(root_node.data);
  }

  return (cloned_bst, cloned_node);
}



var jam = {
  add_room: function (bst, room) {
  },

  jam: function (rooms) {
    bst = BEE();
    let node = bst.createNode(data);
  }
}

// vim: set ts=2 sw=2:
