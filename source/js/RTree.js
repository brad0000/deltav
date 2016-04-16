var deltav;
(function (deltav) {
    class RTree {
        constructor(world) {
            let iBoxes, jBoxes, kBoxes, lBoxes, mBoxes;
            let iNode, jNode, kNode, lNode, mNode;
            this.root = new RTreeNode(world, false, false);
            iBoxes = world.divide();
            for (let i = 0; i < iBoxes.length; i++) {
                iNode = new RTreeNode(iBoxes[i], false, false);
                jBoxes = iBoxes[i].divide();
                for (let j = 0; j < 4; j++) {
                    jNode = new RTreeNode(jBoxes[j], false, false);
                    kBoxes = jBoxes[j].divide();
                    for (let k = 0; k < 4; k++) {
                        kNode = new RTreeNode(kBoxes[k], false, false);
                        lBoxes = kBoxes[k].divide();
                        for (let l = 0; l < 4; l++) {
                            lNode = new RTreeNode(lBoxes[l], false, false);
                            mBoxes = lBoxes[l].divide();
                            for (let m = 0; m < 4; m++) {
                                mNode = new RTreeNode(mBoxes[m], true, false);
                                lNode.children.push(mNode);
                            }
                            kNode.children.push(lNode);
                        }
                        jNode.children.push(kNode);
                    }
                    iNode.children.push(jNode);
                }
                this.root.children.push(iNode);
            }
        }
        add(body) {
            return this.root.add(body);
        }
        search(box) {
            let hits = new Array();
            this.root.search(box, hits);
            return hits;
        }
    }
    deltav.RTree = RTree;
    class RTreeNode {
        constructor(box, isLastBranch, isLeaf) {
            this.box = box;
            this.isLastBranch = isLastBranch;
            this.isLeaf = isLeaf;
            this.children = new Array();
        }
        search(searchArea, hits) {
            if (this.isLeaf) {
                if (searchArea.intersects(this.body.getBoundingBox())) {
                    hits.push(this.body);
                }
            }
            else {
                if (this.box.intersects(searchArea)) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].search(searchArea, hits);
                    }
                }
                else {
                    return;
                }
            }
        }
        add(body) {
            if (this.isLeaf) {
                return null;
            }
            else if (this.isLastBranch) {
                if (this.box.intersects(body.getBoundingBox())) {
                    let result = new RTreeNode(body.getBoundingBox(), false, true);
                    result.body = body;
                    this.children.push(result);
                }
            }
            else {
                if (this.box.intersects(body.getBoundingBox())) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].add(body);
                    }
                }
            }
        }
    }
    deltav.RTreeNode = RTreeNode;
})(deltav || (deltav = {}));

//# sourceMappingURL=RTree.js.map
