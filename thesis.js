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
            // var code = "";
            // var code = "<TABLE>";
            var table = document.getElementById('myTable');
            if(table){
                table.innerHTML = "";
                for(i=0;i<cur.rows;i++){
                    // code += "<TR>";
                    var newRow = table.insertRow(i);
                    console.log("insertrow called");
                    for(j=0;j<cur.cols+cur.aisles;j++){
                        // code += "<TD></TD>";
                        var newCell = newRow.insertCell(j);
                        console.log("insertcell called");
                        var newText = document.createTextNode('New Row');
                        newCell.appendChild(newText);
                        if(j == (cur.cols / cur.aisles)){
                            newCell.colSpan = 2;
                        }
                    }
                    // code += "</TR>";
                }
            }
            else{
                console.log("There was no myTable");
            }
            // code += "</TABLE>";
            // console.log(code);
            // document.getElementById("mytable").innerHTML = code;
            return "wat";
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