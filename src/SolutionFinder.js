
const http = require('http');
const querystring = require('querystring');


class SudokuSolver
{

    constructor()
    {
        this.solution = [];
        for (var r = 0; r < 9; r++)
        {
            var row = [];
            for (var c = 0; c < 9; c++)
            {
                row.push(0);
            }
            this.solution.push(row);

        }

        //  console.log(JSON.stringify(this.solution));
    }

    SetGivens(givenArray)
    {
        for (var r = 0; r < 9; r++)
        {

            for (var c = 0; c < 9; c++)
            {
                if (givenArray[r][c] > 0)
                {
                    //solutionRow[c] = -givenRow[c];
                    this.solution[r][c] = -givenArray[r][c];
                }
            }

        }

        //  console.log(JSON.stringify(this.solution));


    }

    FindSolution()
    {
        this.tryCount = 0;
        var firstRowOptions = this.StartRow(0);
        return this.Try(0, this.MoveToBlankCell(0, -1), firstRowOptions);


    }

    /**
     * Move to the next blank cell skipping over given constants.
     * @param row
     * @param startColumn
     * @constructor
     */
    MoveToBlankCell(row, startColumn)
    {
        for (var nextColumn = startColumn + 1; nextColumn < 9 && this.solution[row][nextColumn] < 0; nextColumn++)
        {
            // do nothing, all handled by the FOR loop
        }
        return nextColumn;

    }

    /**
     * Try values from the options list in the cell identifyed by row and column.  Continue if true, return false if none of them work.
     * @param row
     * @param column
     * @param options
     * @constructor
     */
    Try(row, column, options)
    {
        for (var i = 0; i < options.length; i++)
        {
            var digit = options[i];
            //  Assign the digit into the solution
            this.solution[row][column] = digit;
            this.tryCount++;
            if (this.IsColumnValid(column) && this.IsLatinSquareValid(row, column)) {
                //  this digit works in the cell, so far
                if (options.length > 1) {
                    var nextColumnList = this.CopyExcept(options, digit);
                    var nextColumn = this.MoveToBlankCell(row, column);
                    if (nextColumn < 9) {
                        //  Recursively call the Try routine with the possible digits for the next cell
                        if (this.Try(row, nextColumn, nextColumnList)) {
                            return true;
                        }
                    } else {
                        //  Reached the end of the row and all is well,
                        return true;
                    }
                }
                else
                {
                    //  This row is full.  If we aren't on the last one, then move on to the next row.
                    if (row < 8) {
                        var nextRow = row + 1;
                        var nextRowOptions = this.StartRow(nextRow);
                        //  Now recursively call the Try routine with the fresh, next, new row.
                        if (this.Try(nextRow, this.MoveToBlankCell(nextRow, -1), nextRowOptions))
                            return true;

                    } else {
                        //  We've finished all the rows.  We're done!
                        console.log("Done");
                        return true;
                    }


                }
            }

        }

        //  None of the digits where ok here.  Replace the bad digit with a zero and return false to
        //  indicate nothing worked.
        this.solution[row][column] = 0;
        return false;
    }

    CopyExcept(options, digit)
    {
        var rv = [];
        options.forEach(function(option){
            if (option != digit)
                rv.push(option);

        });

        return rv;

    }
    /**
     * Make an array of possible digits for this row, given that some cells have given constants.
     * @param whichRow
     * @constructor
     */
    StartRow(whichRow)
    {
        var rv = [1,2,3,4,5,6,7,8,9];

        //  Start with an array of all 9 digits9
        // for (var v = 1; v <= 9; v++)
        //     rv.push(v);

        //  Take out the given ones.
        for(var c = 0; c < 9; c++)
        {
            if (this.solution[whichRow][c] < 0)
            {
                //  This cell has given value, so remove it from the list of possibilities
                var deleteIndex = rv.indexOf(Math.abs(this.solution[whichRow][c]));
                if (deleteIndex > -1)
                    rv.splice(deleteIndex,1);
            }
            else
            {
                //  Set this cell in the solution to "nothing determined yet"
                this.solution[whichRow][c] = 0;
            }

        }

        return rv;

    }

    /**
     * A digit has been placed in a cell.  Check to ensure the column is still valid
     * @param whichColumn
     * @returns {boolean}
     * @constructor
     */
    IsColumnValid(whichColumn)
    {
        var found = [false, false, false, false, false, false, false, false, false];
        for (var row = 0; row < 9; row++)
        {
            var testValue = Math.abs(this.solution[row][whichColumn]);
            if (testValue != 0)
            {
                //  We have a candidate for this row.
                if (found[testValue-1])
                    return false;
                else
                    found[testValue-1] = true;
            }
        }
        return true;
    }

    /**
     * Each latin square is a 3x3 matrix.  A digit may appear only once in these squares.
     * Check it here.  We determine which square to check from the row and column of a celll inside
     * it.
     * @param row
     * @param column
     * @returns {boolean}
     * @constructor
     */
    IsLatinSquareValid(row, column)
    {
        row = 3 * Math.floor(row / 3);
        column = 3 * Math.floor(column / 3);
        var found = [false, false, false, false, false, false, false, false, false];
        for (var checkRow = row; checkRow < row + 3; checkRow++)
        {
            for (var checkColumn = column; checkColumn < column + 3; checkColumn++)
            {
                var testValue = Math.abs(this.solution[checkRow][checkColumn]);
                if (testValue != 0) {
                    if (found[testValue - 1])
                        return false;
                    else
                        found[testValue - 1] = true;
                }

            }
        }
        return true;

    }

    /**
     * Print the solution array as a nicely formatted array.
     * @constructor
     */
    PrintSolution()
    {
        for (var row = 0; row < 9; row++)
        {
            var oneLine = ""
            for (var column = 0; column < 9; column++)
            {
                if (this.solution[row][column] > 0)
                    oneLine += " ";
                oneLine += this.solution[row][column];
                oneLine += " ";


            }
            console.log(oneLine);
        }



    }

}
/*
var runner = new SudokuSolver();

var sample = "[[3,0,5,0,0,2,0,6,0],[0,0,0,0,0,0,0,1,0],[0,0,4,0,6,7,9,0,0],[0,0,0,0,4,5,0,0,9],  [0,0,0,0,0,0,0,0,0],[9,0,0,2,1,0,0,0,0],[0,0,2,7,8,0,1,0,0],[0,1,0,0,0,0,0,0,0],[0,8,0,4,0,0,7,0,3]]";

runner.SetGivens(JSON.parse(sample));

var outRow = runner.StartRow(0);
console.log(JSON.stringify(outRow));
// runner.solution[1][0] = 4;
// console.log(runner.IsColumnValid(0));
// console.log(runner.IsLatinSquareValid(0,0));
if (runner.FindSolution()) {
    console.log(JSON.stringify(runner.solution));
    runner.PrintSolution();
}
*/



var greeting = "hello World";

const hostname = 'localhost';
const port = 8081;

const server = http.createServer((req, res) => {
    // console.log(req);
    console.log("Method = " + req.method);
    if (req.method === "POST") {
        console.log("URL = " + req.url);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Access-Control-Allow-Origin', '*');

        let inData = "";
        req.on('data', chunk => {
            console.log("chunk: " + chunk)
            inData += chunk.toString();
        });
        req.on('end', () => {
            console.log("Indata to server: >" + inData + "<");
            // var body = querystring.parse(inData);
            // console.log(body);


            var runner = new SudokuSolver();
            // var sample = "[[3,0,5,0,0,2,0,6,0],[0,0,0,0,0,0,0,1,0],[0,0,4,0,6,7,9,0,0],[0,0,0,0,4,5,0,0,9],  [0,0,0,0,0,0,0,0,0],[9,0,0,2,1,0,0,0,0],[0,0,2,7,8,0,1,0,0],[0,1,0,0,0,0,0,0,0],[0,8,0,4,0,0,7,0,3]]";
            runner.SetGivens(JSON.parse(inData));


            if (runner.FindSolution()) {
                res.end(JSON.stringify(runner.solution));
            } else {
                res.end("No solution found");
            }
            //console.log(res);

            console.log("server hit at " + (new Date()).toString());
        });

    }

});

server.listen(port, hostname, () => {
    console.log("Server running at http://${hostname}:${port}/");
});

