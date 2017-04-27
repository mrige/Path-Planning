/**
 * Created by mrige on 10/04/17.
 */


//Global Variable
var length = 100;
var numObstacles = 10;
var instance = 1;
var instance2 = 1;
var startPosRow = 0;
var startPosCol = 0;
var endPosRow = 0;
var endPosCol = 0;
var itr = 0;
var count = 0;
var stepLenght = 20;
var land = new Array(length);
var obsSize = [];
var rowObsList = [];
var colObsList = [];
var openSet = [];
var closeSet = [];
var path = [];
var tree = [];
var QTimeStart = 0;
var QTimeEnd = 0;
var RTimeStart = 0;
var RTimeEnd = 0;

pathLen = 0;
treelen = 0;


/**************************************************************
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *************************************************************/
function setup(){

    var pixLen = cmToPixel(length);
    var myCanvas = createCanvas(pixLen,pixLen);


   for(var i = 0; i < length; i++){
        land[i] = new Array(length);
    }

    for(var i = 0; i < length; i++){
        for(var j = 0; j < length ;j++){

            land[i][j] = new landObject(i,j);
        }
    }


    for(var i = 0; i < length; i++){
        for(var j = 0; j < length ;j++){

            land[i][j].findNeighbours(land);
        }
    }


}

function draw() {

    background('#4d4e52');



    placeObstacles();
    placeStartEnd();

    QTimeStart = new Date().getTime();
    AStarQuad();

    //rrt();
    //treelen = path.length;
    //console.log("For " + numObstacles + " The PathLength is : " + treelen);

}


//
function deleteVal(list, val) {

    for(var i = list.length-1; i >=0; i--){
        if(list[i] == val) {
            list.splice(i,1);
        }
    }
}
/*************************************************************
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * *************************************************************/

function cmToPixel(len){
    return len * 37.795275591;
}



function placeObstacles(){

    for(var i = 0; i < numObstacles; i++){

        if(instance ==1) {
            var row = Math.floor(Math.random() * length);
            var col = Math.floor(Math.random() * length);
            var obSize = Math.floor((Math.random() * 20) + 10);


            rowObsList.push(row);
            colObsList.push(col);
            obsSize.push(obSize);
        }
        var spot = land[rowObsList[i]][colObsList[i]];
        //console.log(obSize);
        //spot.free = true;



        for(var j = 0; j < obsSize[i] && rowObsList[i] + j < length;j++){
            for(var k = 0; k < obsSize[i] && colObsList[i] + k < length; k++) {

                spot = land[rowObsList[i]+j][colObsList[i]+k];
                spot.createObstacle(cmToPixel(rowObsList[i] + j), cmToPixel(colObsList[i] + k), cmToPixel(1), cmToPixel(1));
                spot.free = false;

            }
        }


    }
    instance++;
}


function placeStartEnd(){


    var row = Math.floor(Math.random() * (length-2));
    var col = Math.floor(Math.random() * (length-2));

    while (land[row][col].free != true){
        row = Math.floor(Math.random() * (length-2));
        col = Math.floor(Math.random() * (length-2));
    }
            if(instance2 == 1) {
                startPosRow = row;
                startPosCol = col;
                openSet.push(land[startPosRow][startPosCol]);
                tree.push(new rrtNode(land[startPosRow][startPosCol], null));
                instance2++;
            }

    var startSpot = land[startPosRow][startPosCol];
    startSpot.createStartEnd(cmToPixel(startPosRow+0.5),cmToPixel(startPosCol+0.5),cmToPixel(1),0);

     row = Math.floor(Math.random() * (length-2));
     col = Math.floor(Math.random() * (length-2));

    if (instance2 == 2 && land[row][col].free == true){

        endPosRow = row;
        endPosCol = col;
        instance2++;
    }

    var endSpot = land[startPosRow][startPosCol];
    endSpot.createStartEnd(cmToPixel(endPosRow+0.5),cmToPixel(endPosCol+0.5),cmToPixel(1),1);

}

function distance(init , end){
    return Math.sqrt(((init.x - end.x)* (init.x - end.x)) + ((init.y - end.y)* (init.y - end.y)));
}


function stepNext(init, end ){
    if(distance(init,end) < cmToPixel(stepLenght)){


        //console.log(distance(init, end).toString() + "  oooo");
        return end;
    }
    else{

        angle = Math.atan2(end.y-init.y,end.x-init.x);
        var xPos = Math.floor(init.x + (cmToPixel(stepLenght)*Math.cos(angle)));
        var yPos = Math.floor(init.y+(cmToPixel(stepLenght)*Math.sin(angle)));

        var pos= new landObject(xPos,yPos);
        var k = distance(init,pos);
       while(new landObject(pos.x/k,pos.y/k).free = false ){
            pos =  new landObject(xPos/k,yPos/k);
            k--;

        }
        //console.log(distance(init, end).toString() + "  oooo");
        return pos;
    }
}


function isCollide(pos) {
    //console.log(pos.x.toString() + ' fff');
    return land[pos.x][pos.y].free;
}


function getValidRandom() {
    while (true) {

        var xRnd = Math.floor(Math.random() * (length-1));
        var yRnd = Math.floor(Math.random() * (length-1));
        var rAnd= new landObject(xRnd,yRnd);
        //console.log(rAnd.x.toString() + "dddd");

        if (isCollide(rAnd)) {
            return rAnd;
        }
    }
}

function surroundingRad(init, end , radius){
    var disT = distance(init,end);
    if(cmToPixel(disT) <= radius){
        return true;
    }
    return false;
}

/******************************************************
 *
 * PATH PLANNING ALGORITHMS
 *
 *
 *
 *
 *
 * *************************************************/



function AStarQuad(){
    var node = new QuadNode(true,0,length,0,length);
    var tree = new QuadTree(node);
    tree.insert(tree.getNode());

    tree.contains(tree.getNode(),12,49);


    if(openSet.length > 0){
        // continue
        var next = 0;
        for(var i = 0; i < openSet.length;i++ ){
            if(openSet[i].f < openSet[next].f){
                next = i;
            }
        }

        var curr = openSet[next];
        if(curr === land[endPosRow][endPosCol]){
            QTimeEnd = new Date().getTime();

            pathLen = path.length;
            console.log("Quad Tree A* For " + numObstacles + " The PathLength is : " + pathLen + " in" + (QTimeEnd - QTimeStart));
            RTimeStart = new Date().getTime();
            rrt();
            noLoop();
            console.log("DONE");
        }
        //else{
        deleteVal(openSet,curr);
        closeSet.push(curr);
        var neighB =  curr.neighbors;

        for(var i = 0; i <neighB.length;i++ ){

            var n = neighB[i];

            if(closeSet.indexOf(n) == -1&&land[n.x][n.y].free){
                var tempGScore = n.g + dist(n.x,n.y,curr.x,curr.y);

                var newPath = false;
                if(openSet.indexOf(n)!=-1 ){
                    if(tempGScore < n.g){
                        n.g = tempGScore;
                        newPath = true;
                    }
                }
                else{
                    n.g = tempGScore;
                    newPath = true;
                    openSet.push(n);
                }

                if(newPath) {
                    n.h = dist(n.x,n.y,endPosRow, endPosCol);
                    //n.h = abs(n.x - endPosRow) + abs(n.y - endPosCol);

                    n.f = n.g + n.h;

                    n.prev = curr;
                }
            }
        }
    }
    else{
        console.log("noSolution");
        pathLen = path.length;
        QTimeEnd = new Date().getTime();
        console.log("For " + numObstacles + " The PathLength is : " + pathLen + " in " + (QTimeEnd - QTimeStart));
        noLoop();
        return;

    }

    for(var i = 0; i < closeSet.length;i++){
        closeSet[i].show(color(255,0,0));
    }
    for(var i = 0; i < openSet.length;i++) {
        openSet[i].show(color(255));
    }
    path = [];
    var temp = curr;
    path.push(temp);
    while(temp.prev){
        path.push(temp.prev);
        temp = temp.prev;
    }
    for(var i = 0; i < path.length;i++){
        path[i].show(color(0,0,255));
    }




}
function rrt(){

      var foundNext = false;
      var goal = false;
      var goalNode = null;
      var pathS = 0;


      while(true){
          //frameRate(100000);
          count++;
          if(goal == true){

              var currNode = goalNode;
              while (currNode.parent != null){
                  pathS ++;
                  strokeWeight(7);
                  stroke("#0bff09");
                  line(cmToPixel(currNode.curr.x),cmToPixel(currNode.curr.y),cmToPixel(currNode.parent.curr.x),cmToPixel(currNode.parent.curr.y));
                  currNode = currNode.parent;


              }
              treelen = pathS;
              RTimeEnd = new Date().getTime();
              console.log("RRT For " + numObstacles + " The PathLength is : " + treelen + " in " + (RTimeEnd - RTimeStart));
              noLoop();
              return;
          }

          if(count < 5000) {
            count++;
              foundNext = false;
              while (foundNext == false) {
                  var rNode = getValidRandom();
                  var parentNode = tree[0];


                  for (var i = 0; i < tree.length; i++) {

                      if (distance(tree[i].curr, rNode) <= distance(parentNode.curr, rNode)) {

                          var newPoint = stepNext(tree[i].curr, rNode);
                          //console.log(distance(tree[i].curr, newPoint).toString() + "  uuuu");
                          if (isCollide(newPoint) == true) {
                              //console.log(tree[i].curr.x);
                              parentNode = tree[i];
                              foundNext = true;
                          }
                      }
                  }
              }
              var newNode = stepNext(parentNode.curr, rNode);
              tree.push(new rrtNode(newNode, parentNode));
              strokeWeight(4);
              stroke('red');

              line(cmToPixel(parentNode.curr.x), cmToPixel(parentNode.curr.y),cmToPixel(newNode.x),cmToPixel(newNode.y));
              stroke(255);
              point(cmToPixel(newNode.x),cmToPixel(newNode.y));

              //if at goal
              if (surroundingRad(newNode, land[endPosRow][endPosCol], cmToPixel(1))) {
                  goal = true;
                  goalNode = tree[tree.length - 1];

              }
          }
          else{

                console.log("End Not Found ");
                noLoop();
                return;
          }


      }

}




