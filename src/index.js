import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

//
// function Cell(props) {
//     return (
//         <input type="text" classname="square" onChange={props.onChange} size="1" name={props.cellName}></input>
//     );
// }

class Puzzle extends React.Component
{


    constructor(props)
    {
        super(props);
        var classGrid = [];
        var initialGrid = [];
        for(let cr = 0; cr < 9; cr++) {
            classGrid.push([])
            initialGrid.push([]);
            for (let cc = 0; cc < 9; cc++) {
                classGrid[cr][cc] = "givenCell";
                initialGrid[cr][cc] = "";
            }
        }

        initialGrid = JSON.parse('[[3,"",5,"","",2,"",6,""],["","","","","","","",1,""],["","",4,"",6,7,9,"",""],["","","","",4,5,"","",9],  ["","","","","","","","",""],[9,"","",2,1,"","","",""],["","",2,7,8,"",1,"",""],["",1,"","","","","","",""],["",8,"",4,"","",7,"",3]]');

        this.state = {
            grid :  initialGrid,
            classGrid : classGrid,
            solved : false,
            validInit : true,
            errorMessage : "",
            lastID : 1

        }
        // for(let r = 0; r < 9; r++) {
        //     for (let c = 0; c < 9; c++) {
        //         this.state.grid[r][c] = "(" + r + "," + c + ")";
        //     }
        // }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    IsInitValid(grid, row, column)
    {
        var errorMessage = null;
        if (!this.IsColumnValid(grid, column))
        {
            column++;
            errorMessage = "Column "+column+ " not valid with new value" ;
        }

        if (!this.IsRowValid(grid, row) && errorMessage == null)
        {
            row++;
            errorMessage = "Row "+row+ " not valid with new value" ;
        }

        if (!this.IsLatinSquareValid(grid, row, column) && errorMessage == null)
        {
            row++;
            column++;
            errorMessage = "Square with cell in row " + row + " and column " + column + " not valid with new value";
        }


        this.setState({errorMessage : errorMessage == null ? "" : errorMessage});

        return errorMessage == null;

    }

    IsColumnValid(grid, whichColumn)
    {
        var found = [false, false, false, false, false, false, false, false, false];
        for (var row = 0; row < 9; row++)
        {
            if (grid[row][whichColumn] !== "") {
                var testValue = Math.abs(grid[row][whichColumn]);
                if (testValue !== 0) {
                    //  We have a candidate for this row.
                    if (found[testValue - 1])
                        return false;
                    else
                        found[testValue - 1] = true;
                }
            }
        }
        return true;
    }

    IsRowValid(grid, whichRow)
    {
        var found = [false, false, false, false, false, false, false, false, false];
        for (var column = 0; column < 9; column++)
        {
            if (grid[whichRow][column] !== "") {
                var testValue = Math.abs(grid[whichRow][column]);
                if (testValue !== 0) {
                    //  We have a candidate for this row.
                    if (found[testValue - 1])
                        return false;
                    else
                        found[testValue - 1] = true;
                }
            }
        }
        return true;
    }

    IsLatinSquareValid(grid, row, column)
    {
        row = 3 * Math.floor(row / 3);
        column = 3 * Math.floor(column / 3);
        var found = [false, false, false, false, false, false, false, false, false];
        for (var checkRow = row; checkRow < row + 3; checkRow++)
        {
            for (var checkColumn = column; checkColumn < column + 3; checkColumn++)
            {
                var testValue = Math.abs(grid[checkRow][checkColumn]);
                if (testValue !== 0) {
                    if (found[testValue - 1])
                        return false;
                    else
                        found[testValue - 1] = true;
                }

            }
        }
        return true;

    }

    handleChange(e)
    {
        let r = Number(e.currentTarget.name[4]);
        let c = Number(e.currentTarget.name[5]);
        //alert("at cell " + r + "," + c);

        //alert(e.toString());
        //  alert(e.currentTarget.name + " got value of " + e.currentTarget.value + " at row " + r + " and column " + c);


        var newGrid = [];
        var newValue = Number(e.currentTarget.value);
        for(let cr = 0; cr < 9; cr++)
        {
            newGrid.push([]);
            for (let cc = 0; cc < 9; cc++) {
                if (cr === r && cc === c) {

                    newGrid[cr][cc] = newValue.toString(); //   !== 'NaN' ? newValue : "";
                   //   alert("value at " + cr + "," + cc + " set to " + newGrid[cr][cc].toString());
                }
                else
                    newGrid[cr][cc] = this.state.grid[cr][cc];
            }
        }

        if (!this.IsInitValid(newGrid, r, c))
        {

            return;
        }

        //  alert(JSON.stringify(newGrid));
        // let newRow = newGrid[r];
        // newRow[c] = newValue !== 'NaN' ? newValue : "";

        this.setState({
            grid:  newGrid
        });

        //  alert(JSON.stringify(this.state.grid));

    }

    renderCell(r,c) {
        let cellName = "cell" + r.toString() + c.toString();

        return (
            <input  key={cellName} type="text" className={this.state.classGrid[r][c]} onChange={this.handleChange} size="1" name={cellName}  value={this.state.grid[r][c]}></input>
        );

    }
     serialCell = 0;
    renderRow(whichRow, whichRowIndex)
    {

        const rowCells =  whichRow.map((column, columnIndex) =>
        {
            return (this.renderCell(whichRowIndex, columnIndex));
        });

        return rowCells.map((cell) => (<td key={this.serialCell++}>{cell}</td>));

    }

    renderMatrix()
    {
        return this.state.grid.map(
            (row, rowIndex) =>
            {
                var rowCells = this.renderRow(row, rowIndex);

                return (<tr key={this.serialCell++}>{rowCells}</tr>);
            }

        )
    }

    render() {
        return (
            <div>
                <table><tbody>{this.renderMatrix()}</tbody></table>
                <div name="ErrorMessage"  className="error">
                    {this.state.errorMessage}
                </div>
                <div>
                    <button className="button" onClick={this.handleSubmit}>
                        Solve

                    </button>

                </div>
                <div>
                    <button className="button" onClick={this.handleDelete}>
                        DeleteLast

                    </button>

                </div>

            </div>

        );
     }

     handleSubmit()
     {

         var newGrid = [];
         var newClassGrid = [];
         for(let cr = 0; cr < 9; cr++)
         {
             newGrid.push([]);
             newClassGrid.push([]);
             for (let cc = 0; cc < 9; cc++) {
                 var testNumber = Number(this.state.grid[cr][cc]);
                 if (testNumber === "NaN" || testNumber === 0) {

                     newGrid[cr][cc] = 0;
                     newClassGrid[cr][cc] = "answerCell";
                     //   alert("value at " + cr + "," + cc + " set to " + newGrid[cr][cc].toString());
                 }
                 else {
                     newGrid[cr][cc] = this.state.grid[cr][cc];
                     newClassGrid[cr][cc] = "givenCell";
                 }
             }
         }
         console.log("grid to send...");
         console.log(newGrid);
         console.log(newClassGrid);

         // var puzzleInit = JSON.stringify(this.state.grid);
         // alert("Solve button pressed to solve with " + puzzleInit);

         axios({method : 'POST',
            url : "http://localhost:8081/solve",
             data : JSON.stringify(newGrid)
         }).then(res => {
             //  console.log(res);
             var newGrid = (res.data);
             for (let cr = 0; cr < 9; cr++) {
                 for (let cc = 0; cc < 9; cc++) {
                     newGrid[cr][cc] = Math.abs(newGrid[cr][cc]);
                 }
             }
             console.log("answer...");
             console.log(newGrid);

             //  Since we got the answer, post the post to the database
             axios({method : 'POST',
                 url : "http://localhost:8081/create",
                 data : JSON.stringify(newGrid)
             }).then(res => {
                console.log("back from saving data");
                 this.setState({grid: newGrid, classGrid: newClassGrid, errorMessage : "Entry saved, #" + res.data, lastID : res.data})
             });

         });


         // axios.post("http://localhost:8081/", {parms : JSON.stringify(newGrid)})
         //     .then(res => {
         //         //  console.log(res);
         //         var newGrid = (res.data);
         //         for(let cr = 0; cr < 9; cr++) {
         //             for (let cc = 0; cc < 9; cc++) {
         //                 newGrid[cr][cc] = Math.abs(newGrid[cr][cc]);
         //             }
         //         }
         //         console.log(newGrid);
         //         this.setState({grid: newGrid, classGrid: newClassGrid})
         //     });


     }

     handleDelete()
     {
         var victim = this.state.lastID;
         //  Since we got the answer, post the post to the database
         axios({method : 'get',
             url : "http://localhost:8081/delete?id=" + victim,
         }).then(res => {
             console.log("back from deleting " + victim);
             this.setState({ errorMessage : "Entry #" + res.data + " deleted"});
         });

     }

}



ReactDOM.render(<Puzzle />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
