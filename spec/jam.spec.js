describe("BEE", function() {
  describe("clone", function() {
    function gen_binary_tree(data="test") {
      let bst = new BEE();
      let root = bst.createNode(data);
      root.update();
      return [bst, root];
    }

    it("Returned root node should be the effective root", function() {
      let [bst, root] = gen_binary_tree();
      let [cloned_bst, cloned_root] = bst.clone();

      expect(cloned_root).to.equal(cloned_bst.getRootNode());
    });

    it("Binary trees with only one root should be equals", function() {
      let [bst, root] = gen_binary_tree();
      let [cloned_bst, cloned_root] = bst.clone();

      let attributes = ["data", "leftBranch", "rightBranch"];
      for(let attr of attributes)
        expect(root[attr]).to.equal(cloned_root[attr]);
    });
  });
});

// vim: set ts=2 sw=2:
