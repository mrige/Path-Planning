/**
 * Created by mrige on 10/04/17.
 */

function landObject(i,j){
    this.x = i;
    this.y = j;
    this.free = true;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.prev = null;

    this.neighbors = [];
    this.createObstacle =  function (i,j,objSize) {

        noStroke();
        fill(255, 204, 0);
        rect(i,j,objSize,objSize);

    };

    this.createStartEnd = function (i,j,objSize,startEnd) {

        noStroke();

        if(startEnd == 0){

            fill('red');
            ellipse(i,j,objSize,objSize);

        }
        else if(startEnd==1){

            fill(255);
            ellipse(i,j,objSize,objSize);

        }
    };

    this.findNeighbours = function() {
        var i = this.x;
        var j = this.y;
        if (i < length - 1) {
            this.neighbors.push(land[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(land[i - 1][j]);
        }
        if (j < length - 1) {
            this.neighbors.push(land[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(land[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(land[i - 1][j - 1]);
        }
        if (i < length - 1 && j > 0) {
            this.neighbors.push(land[i + 1][j - 1]);
        }
        if (i > 0 && j < length - 1) {
            this.neighbors.push(land[i - 1][j + 1]);
        }
        if (i < length - 1 && j < length - 1) {
            this.neighbors.push(land[i + 1][j + 1]);
        }
    };


    this.show = function (col) {
        fill(col);
        noStroke();
        rect(cmToPixel(this.x),cmToPixel(this.y),cmToPixel(1),cmToPixel(1));
    };
}