var mysql = require('mysql');

class SudokuDatabase {


    constructor() {

        this.con = mysql.createConnection({
            host: "127.0.0.1",
            user: "auctionadmin",
            password: "FHAD675849",
            database: "auction",
            port: 3306
        })

        this.con.connect((err) => {
            if (err) throw err;
            console.log("Connected");
        });


    }

    //  //  The table:  create table sudoku (id serial AUTO_INCREMENT, title varchar(255), entryDate timestamp, puzzle varchar(255));


    InsertRecord(jsonString, res) {
        var insertStmt = "Insert into sudoku set puzzle = '" + jsonString + "'";
        console.log("SQL=" + insertStmt);
        var insertedID;
        this.con.query(insertStmt, (err, results) => {
            if (err) throw err;
            console.log(results);
            insertedID = results.insertId;
            res.end(insertedID.toString());
        });


    }

    DeleteRecord(whichID) {
        var deleteStmt = "delete from sudoku where id = " + whichID;
        console.log("SQL=" + deleteStmt);
        this.con.query(deleteStmt, (err, results) => {
            if (err) throw err;
            console.log(results);
            //  res.end(insertedID.toString());
        });


    }

    FetchAllEntries(res) {
        this.con.query("select * from sudoku", (err, results) => {
            if (err) throw err;
            console.log(results);
            res.end(JSON.stringify(results));
        });
    }

    FetchOneEntry(whichID, res) {
        this.con.query("select * from sudoku where id = " + whichID, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.end(JSON.stringify(results));
        });
    }
}


module.exports = SudokuDatabase;
