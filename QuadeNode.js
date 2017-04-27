/**
 * Created by mrige on 15/04/17.
 */

function QuadNode(type, initX,finX,initY, finY,qSize){

    this.isPartial = type;
    this.x1 = initX;
    this.x2 = finX;
    this.y1 = initY;
    this.y2 = finY;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.parent = null;
    this.quadSize = qSize;


    this.northWest = null;
    this.northEast = null;
    this.southWest = null;
    this.southEast = null;

    this.checkType = function(intX,finX,initY,finY){
        var numType = 1;
        var iniTialType = land[initX][initY].free;
        for(var i = initX+1; i < finX; i++){
            for(var j = initY+1; j < finY ;j++){
                if(iniTialType == true && land[i][j].free==false){
                    // console.log("dd");
                    numType++;
                    return true;
                }
                else if(iniTialType == false && land[i][j].free==true){
                    numType++;
                    return true;
                }


            }
        }
        return false;

    };



}
