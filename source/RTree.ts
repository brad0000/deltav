namespace deltav {

    export class RTree {

        private root: RTreeNode;

        constructor(world: World) {
            
            let iBoxes: Box[], jBoxes: Box[], kBoxes: Box[];
            let iNode: RTreeNode, jNode: RTreeNode, kNode: RTreeNode;
            
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
                        // No children
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
        
        constructor(public box: Box, public isLeaf: boolean) {
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
        
        public add(body: Body): RTreeNode {
            if (this.isLeaf) {
                return null;
            } else {
                let result: RTreeNode = null;
                
                // First try adding it to my children
                for (let i = 0; i < this.children.length; i++) {
                    result = this.children[i].add(body);
                    if (result != null) {
                        return result;
                    }
                }
                
                // Otherwise check if i can take it
                if (this.box.contains(body.getBoundingBox())) {
                    // I can take it.
                    result = new RTreeNode(body.getBoundingBox(), true);
                    result.body = body;
                    
                    this.children.push(result);
                    return result;
                } else {
                    // Neither my kids nor I can take it.
                    return null;
                }
            }
        }
    }
}
