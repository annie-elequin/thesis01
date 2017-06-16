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
            // return ClassList.findOne({ _id: selectedClass._id });
        },
        'createTable': function(){
            console.log("createTable called");
            // var cur = Session.get('selectedClass');
            /*
            var cur = Session.get('selectedClass');
            var code = "<TABLE>";
            for(i=0;i<cur.rows;i++){
                code += "<TR>";
                for(j=0;j<cur.cols+cur.aisles;j++){
                    code += "<TD></TD>";
                }
                code += "</TR>";
            }
            code += "</TABLE>";
            console.log(code);
            */
            return "wat";
        }
    });

    Template.classroomlayout.events({
        'change .classroomdropdown': function(){
            console.log("chosen: "+event.target.value);
            var cur = ClassList.find({ room: event.target.value });
            var selectedClassroom = cur._id;
            Session.set('selectedClass', );
            console.log("change detected.");
            console.log(selectedClassroom);
            console.log(selectedClassroom._id);
            console.log(selectedClassroom.room);
        }
    });
}