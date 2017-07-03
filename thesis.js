SeatList = new Mongo.Collection('seats');

if(Meteor.isClient){
    Meteor.subscribe('theClasses');

    // HELPER functions for the CLASSROOM LAYOUT
    Template.classroomlayout.helpers({
        'setActive': function(){
            console.log("setActive");
            
            var curIP = "33.33.000.00";
            // later, we'll get the actual IP address

            // set seat session
            var curSeat = SeatList.findOne({ IP: curIP });
            if(curSeat){
                console.log("found the current seat "+curSeat._id);
                SeatList.update({ _id: curSeat._id }, { $set: {status: "active"} });
                console.log(curSeat);
                console.log("set the status");
                Session.set('selectedSeat', curSeat._id);
                console.log("set the session");
            }
        },
        'setInactive': function(){
            console.log("setInactive");
            var curSeatID = Session.get('selectedSeat');
            SeatList.update({ _id: curSeatID }, { $set: {status:"inactive"} });
        },
        // 'isStudent': function(){
        //     console.log("isStudent");
        //     var usrID = Meteor.userId();
        //     var curUser = UserList.findOne({ ID: usrID });
        //     if(curUser.role == "stud"){
        //         var curSeat = SeatList.findOne({ studID: usrID });
        //         // console.log(curSeat);
        //         var table = document.getElementById('myTable');
        //         // console.log("got the table");
        //         if(table){
        //             var curRow = table.rows[curSeat.row-1];
        //             // console.log("row: "+curRow);
        //             var ndx=1, i=0;
        //             while(ndx != curSeat.col){
        //                 // console.log("inside while, col: "+curSeat.col);
        //                 if(curRow.cells.item(i).innerHTML == "seat"){
        //                     ndx++;
        //                 }
        //                 // console.log(curRow.cells[i].innerHTML);
        //                 i++;
        //             }
        //             // console.log("finished the while loop");
        //             curRow.cells.item(i).style.border = "8px solid green";
        //             // console.log("i: "+i);
        //         }
        //     }
        // },
        // 'createTable': function(){
        //     console.log("createTable called");
        //     var temp = Session.get('selectedClass');
        //     var cur = ClassList.findOne({ room: temp });
        //     var table = document.getElementById('myTable');
        //     if(table){
        //         table.innerHTML = "";
        //         for(i=0;i<cur.rows;i++){
        //             var newRow = table.insertRow(i);
        //             // console.log("insertrow called");
        //             for(j=0;j<cur.cols+cur.aisles;j++){
        //                 var newCell = newRow.insertCell(j);
        //                 // console.log("insertcell called");
        //                 // var newText = document.createTextNode('New Row');
        //                 // newCell.appendChild(newText);
        //                 var numSeats = (cur.cols / (cur.aisles+1))+1;
        //                 if((j+1)%numSeats == 0){
        //                     // console.log(j+1);
        //                     // console.log("cols/aisles what="+numSeats);
        //                     newCell.innerHTML = "aisle";
        //                     newCell.style.background = "black";
        //                     newCell.style.color = "white";
        //                 }else{
        //                     newCell.innerHTML = "seat";
        //                 }
        //             }
        //         }
        //     }
        //     else{
        //         console.log("There was no myTable");
        //     }
        // }
        // 'fromsection11': function(){
        //     return SeatList.find({ row: 1, col: { $lt: 5 }});
        // },
        // 'fromsection12': function(){
        //     return SeatList.find({ row: 1, col: { $gt: 4, $lt: 9 }});
        // },
        // 'fromsection13': function(){
        //     console.log("section1-3");
        //     return SeatList.find({ row: 1, col: { $gt: 8, $lt: 13 }});
        // },
        // 'fromsection21': function(){
        //     return SeatList.find({ row: 2, col: { $gt: 12, $lt: 17 }});
        // },
        // 'fromsection22': function(){
        //     return SeatList.find({ row: 2, col: { $gt: 16, $lt: 21 }});
        // },
        // 'fromsection23': function(){
        //     return SeatList.find({ row: 2, col: { $gt: 20, $lt: 25 }});
        // },
        // 'fromsection31': function(){
        //     return SeatList.find({ row: 3, col: { $gt: 24, $lt: 29 }});
        // },
        // 'fromsection32': function(){
        //     return SeatList.find({ row: 3, col: { $gt: 28, $lt: 33 }});
        // },
        // 'fromsection33': function(){
        //     return SeatList.find({ row: 3, col: { $gt: 32 }});
        // },
        'aisle': function(){
            var col = SeatList.findOne({ _id: this._id }).col;
            if(col){
                if(col == 5 || col == 9 || col == 17
                    || col == 21 || col == 29 || col == 33){
                    return true;
                }else{
                    return false;
                }
            }
        },
        'rowone': function(){
            return SeatList.find({ row: 1 });
        },
        'rowtwo': function(){
            return SeatList.find({ row: 2 });
        },
        'rowthree': function(){
            return SeatList.find({ row: 3 });
        },
        'derp': function(){
            console.log("status");
            // var curSeatID = this._id;
            // // var curSeat = SeatList.findOne({ _id: curSeatID });

            // if(curSeat.status == "inactive"){
            //     return;
            // }else if(curSeat.status == "active"){
            //     return "active";
            // }else if(curSeat.status == "bad"){
            //     return "bad";
            // }else if(curSeat.status == "meh"){
            //     return "meh";
            // }else if(curSeat.status == "good"){
            //     return "good";
            // }
        },
        
    });

    Template.statusbuttons.events({
        'click .good': function(event){
            console.log("good");
            var seatID = Session.get('curSeat');
            var mySeat = SeatList.findOne({ _id: seatID });
        },
        'click .meh': function(event){
            console.log("meh");
            var seatID = Session.get('curSeat');
            var mySeat = SeatList.findOne({ _id: seatID });
        },
        'click .bad': function(event){
            console.log("bad");
            var seatID = Session.get('curSeat');
            var mySeat = SeatList.findOne({ _id: seatID });
        }
    })

    Template.classroomlayout.events({

    });
}