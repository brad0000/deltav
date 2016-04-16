var deltav;
(function (deltav) {
    class RTree {
        constructor(world) {
            let iBoxes, jBoxes, kBoxes;
            let iNode, jNode, kNode;
            this.root = new RTreeNode(world, false);
            iBoxes = world.divide();
            for (let i = 0; i < iBoxes.length; i++) {
                iNode = new RTreeNode(iBoxes[i], false);
                jBoxes = iBoxes[i].divide();
                for (let j = 0; j < 4; j++) {
                    jNode = new RTreeNode(jBoxes[j], false);
                    kBoxes = jBoxes[j].divide();
                    for (let k = 0; k < 4; k++) {
                        kNode = new RTreeNode(kBoxes[k], false);
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
        constructor(box, isLeaf) {
            this.box = box;
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
            else {
                let result = null;
                for (let i = 0; i < this.children.length; i++) {
                    result = this.children[i].add(body);
                    if (result != null) {
                        return result;
                    }
                }
                if (this.box.contains(body.getBoundingBox())) {
                    result = new RTreeNode(body.getBoundingBox(), true);
                    result.body = body;
                    this.children.push(result);
                    return result;
                }
                else {
                    return null;
                }
            }
        }
    }
    deltav.RTreeNode = RTreeNode;
})(deltav || (deltav = {}));

//# sourceMappingURL=RTree.js.map
