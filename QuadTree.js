/**
 * Created by mrige on 15/04/17.
 */

function QuadTree(node){


    this.node = node;
    const NODE_CAPACITY = 4;

    this.getNode = function () {
        return this.node;
    };

    this.subDivide = function(node) {

        var midX = Math.ceil(node.x1 +  ((node.x2-node.x1)/2));
        var midY = Math.ceil(node.y1 +  ((node.y2-node.y1)/2));
        //console.log(midX.toString());
        //console.log(midY.toString());

        strokeWeight(5);
        stroke('#95d8fa');
        line(cmToPixel(midX),cmToPixel(node.y1),cmToPixel(midX),cmToPixel(node.y2));
        line(cmToPixel(node.x1),cmToPixel(midY),cmToPixel(node.x2), cmToPixel(midY));


        var type = node.checkType(node.x1,midX,node.y1,midY);
        //console.log(type.toString());
        node.northWest = new QuadNode(type,node.x1,midX,node.y1,midY);
        node.northWest.parent = node;
        type = node.checkType(midX,node.x2,node.y1,midY);
        node.northEast = new QuadNode(type,midX,node.x2,node.y1,midY);
        node.northEast.parent = node;

        type = node.checkType(node.x1,midX,midY,node.y2);
        node.southWest = new QuadNode(type,node.x1,midX,midY,node.y2);
        node.southWest.parent = node;

        type = node.checkType(midX,node.x2,midY,node.y2);
        node.southEast = new QuadNode(type,midX,node.x2,midY,node.y2);
        node.southEast.parent = node;


    };

    this.insert = function(node){

        if(node.isPartial == true){
            // console.log("me1");
            this.subDivide(node);
        }
        else{
            // console.log("me");
            return false;
        }

        if(this.insert(node.northWest));
        if(this.insert(node.northEast));
        if(this.insert(node.southWest));
        if(this.insert(node.southEast));

    };

    var k = 0;
    this.contains = function(node,i,j){


        if((i < node.x1 || i > node.x2 )){
            return false;
        }
        if((j < node.y1 || j > node.y2)){

            return false;
        }
        if(node.northWest == null){

            return true;
        }


        if(this.contains(node.northWest,i,j));
        if(this.contains(node.northEast,i,j));
        if(this.contains(node.southWest,i,j));
        if(this.contains(node.southEast,i,j));


    };

}

