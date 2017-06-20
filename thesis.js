ClassList = new Mongo.Collection('classrooms');

if(Meteor.isClient){
    Meteor.subscribe('theClasses');

    // HELPER functions for the CLASSROOM LAYOUT
    Template.classroomlayout.helpers({
        'class': function(){
            // return ClassList.find();   
            return ClassList.find();        
        },
        'selectedClass': function(){
            var selectedClass = Session.get('selectedClass');
            console.log("we are in selectedClass, so "+selectedClass);
            return ClassList.findOne({ room: selectedClass });
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
                            console.log(j+1);
                            console.log("cols/aisles what="+numSeats);
                            newCell.innerHTML = "<div class='aisle'>aisle</div>";
                            newCell.style.background = "black";
                            newCell.style.width = "18px";
                        }else{
                            newCell.innerHTML = "<div class='seat'>seat</div>";
                        }
                    }
                }
            }
            else{
                console.log("There was no myTable");
            }
        }
    });

    Template.classroomlayout.events({
        'change .classroomdropdown': function(){
            // console.log("chosen: "+event.target.value);
            Session.set('selectedClass', event.target.value);
            console.log("change detected.");
        }
    });
}