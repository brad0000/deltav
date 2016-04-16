namespace deltav {

    export class RTree {

        private root: RTreeNode;

        constructor(world: World) {
            
            let iBoxes: Box[], jBoxes: Box[], kBoxes: Box[], lBoxes: Box[], mBoxes: Box[];
            let iNode: RTreeNode, jNode: RTreeNode, kNode: RTreeNode, lNode: RTreeNode, mNode: RTreeNode;
            
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

        public add(body: Body): RTreeNode {
            return this.root.add(body);
        }
        
        public search(box: Box): Body[] {
            let hits = new Array<Body>();
            
            this.root.search(box, hits);
            
            return hits;
        }
    }

    export class RTreeNode {
        public children = new Array<RTreeNode>();
        public body: Body;
        
        constructor(public box: Box, public isLastBranch, public isLeaf: boolean) {
            // nothing
        }
        
        public search(searchArea: Box, hits: Array<Body>) {
            if (this.isLeaf) {
                if (searchArea.intersects(this.body.getBoundingBox())) {
                    hits.push(this.body);
                }
            } else {
                // Searching a branch            
                if (this.box.intersects(searchArea)) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].search(searchArea, hits);
                    }
                } else {
                    return;
                }
            }   
        }
        
        public add(body: Body) {
            if (this.isLeaf) {
                // this node IS a star, don't add stars to stars.
                return null;
            } else if (this.isLastBranch) {
                // this is the ONLY level that we add stars.
                if (this.box.intersects(body.getBoundingBox())) {
                    let result = new RTreeNode(body.getBoundingBox(), false, true);
                    result.body = body;
                    this.children.push(result);
                }
            } else {
                // this is an internal branch, just check to see if it's worth notifying children.
                if (this.box.intersects(body.getBoundingBox())) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].add(body);
                    }
                }
            }
        }
    }
}
