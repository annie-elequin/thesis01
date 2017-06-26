ClassList = new Mongo.Collection('classrooms');
CourseList = new Mongo.Collection('courses');
UserList = new Mongo.Collection('myusers');
SeatList = new Mongo.Collection('seats');

if(Meteor.isClient){
    Meteor.subscribe('theClasses');

    // HELPER functions for the CLASSROOM LAYOUT
    Template.chooseclassroom.helpers({
        'class': function(){
            // return ClassList.find();   
            return ClassList.find();        
        }
    });

    // HELPER functions for the CLASSROOM LAYOUT
    Template.classroomlayout.helpers({
        'setActive': function(){
            console.log("setActive");
            var usrID = Meteor.userId();
            var curUser = UserList.findOne({ ID: usrID });
            curUser.status = "active";

            // set sessions for this user
            // set user
            Session.set('curUser', curUser.ID);
            // set seat
            var curSeat = SeatList.findOne({ studID: usrID });
            Session.set('curSeat', curSeat._id);
        },
        'selectedClass': function(){
            var selectedClass = Session.get('selectedClass');
            console.log("we are in selectedClass, so "+selectedClass);
            return ClassList.findOne({ room: selectedClass });
        },
        'isStudent': function(){
            console.log("isStudent");
            var usrID = Meteor.userId();
            var curUser = UserList.findOne({ ID: usrID });
            if(curUser.role == "stud"){
                var curSeat = SeatList.findOne({ studID: usrID });
                // console.log(curSeat);
                var table = document.getElementById('myTable');
                // console.log("got the table");
                if(table){
                    var curRow = table.rows[curSeat.row-1];
                    // console.log("row: "+curRow);
                    var ndx=1, i=0;
                    while(ndx != curSeat.col){
                        // console.log("inside while, col: "+curSeat.col);
                        if(curRow.cells.item(i).innerHTML == "seat"){
                            ndx++;
                        }
                        // console.log(curRow.cells[i].innerHTML);
                        i++;
                    }
                    // console.log("finished the while loop");
                    curRow.cells.item(i).style.border = "8px solid green";
                    // console.log("i: "+i);
                }
            }
        },
        'createTable': function(){
            console.log("createTable called");
            var temp = Session.get('selectedClass');
            var cur = ClassList.findOne({ room: temp });
            var table = document.getElementById('myTable');
            if(table){
                table.innerHTML = "";
                for(i=0;i<cur.rows;i++){
                    var newRow = table.insertRow(i);
                    // console.log("insertrow called");
                    for(j=0;j<cur.cols+cur.aisles;j++){
                        var newCell = newRow.insertCell(j);
                        // console.log("insertcell called");
                        // var newText = document.createTextNode('New Row');
                        // newCell.appendChild(newText);
                        var numSeats = (cur.cols / (cur.aisles+1))+1;
                        if((j+1)%numSeats == 0){
                            // console.log(j+1);
                            // console.log("cols/aisles what="+numSeats);
                            newCell.innerHTML = "aisle";
                            newCell.style.background = "black";
                            newCell.style.color = "white";
                        }else{
                            newCell.innerHTML = "seat";
                        }
                    }
                }
            }
            else{
                console.log("There was no myTable");
            }
        }
    });

    Template.statusbuttons.events({
        'click .good': function(event){
            console.log("good");
            var seatID = Session.get('curSeat');
            var mySeat = SeatList.findOne({ _id: seatID });
            var table = document.getElementById("myTable");
            table.rows[mySeat.row-1].cells[mySeat.col].style.border = "8px solid green";
        },
        'click .meh': function(event){
            console.log("meh");
            var seatID = Session.get('curSeat');
            var mySeat = SeatList.findOne({ _id: seatID });
            var table = document.getElementById("myTable");
            table.rows[mySeat.row-1].cells[mySeat.col].style.border = "8px solid yellow";
        },
        'click .bad': function(event){
            console.log("bad");
            var seatID = Session.get('curSeat');
            var mySeat = SeatList.findOne({ _id: seatID });
            var table = document.getElementById("myTable");
            table.rows[mySeat.row-1].cells[mySeat.col].style.border = "8px solid red";
        }
    })

    Template.chooseclassroom.events({
        'change .classroomdropdown': function(event){
            // console.log("chosen: "+event.target.value);
            Session.set('selectedClass', event.target.value);
            console.log("change detected.");
            Meteor.userId();
        }
    });

    Template.classroomlayout.events({

    });
}