console.log("no seatlist");
SeatList = new Mongo.Collection('seats');
console.log("seatlist");

if(Meteor.isClient){
    Meteor.subscribe('theClasses');

    window.onload = function(){
        console.log("setActive");
        
        var curIP = "129.62.150.32";
        // later, we'll get the actual IP address
        // $.getJSON('//ipapi.co/json/', function(data) {
        //     console.log(JSON.stringify(data, null, 2));
        // });


        // set seat session
        var curSeat = SeatList.findOne({ IP: curIP });
        if(curSeat){
            console.log("found the current seat "+curSeat._id);
            SeatList.update({ _id: curSeat._id }, { $set: {status: "active"} });
            Session.set('selectedSeat', curSeat._id);
        }
    }

    window.onunload = function(){
        console.log("setInactive");
        var curSeatID = Session.get('selectedSeat');
        console.log(curSeatID);
        SeatList.update({ _id: curSeatID }, { $set: {status:"inactive"} });
        var thing = SeatList.findOne({ _id: curSeatID }).status;
        console.log(thing);
    }

    // HELPER functions for the CLASSROOM LAYOUT
    Template.classroomlayout.helpers({
        // 'seatInactive': function(){
        //     console.log("is it inactive?");
        //     var seatID = Session.get('selectedSeat');
        //     var stat = SeatList.findOne({ _id: seatID }).status;
        //     if(stat == "inactive"){
        //         console.log("its inactive");
        //         return true;
        //     }else{
        //         console.log("nah");
        //         return false;
        //     }
        // },
        // 'setInactive': function(){
        //     console.log("setInactive");
        //     var curSeatID = Session.get('selectedSeat');
        //     console.log(curSeatID);
        //     SeatList.update({ _id: curSeatID }, { $set: {status:"inactive"} });
        //     var thing = SeatList.findOne({ _id: curSeatID }).status;
        //     console.log(thing);
        // },
        // 'setActive': function(){
        //     console.log("setActive");
            
        //     var curIP = "129.62.150.32";
        //     // later, we'll get the actual IP address
        //     // $.getJSON('//ipapi.co/json/', function(data) {
        //     //     console.log(JSON.stringify(data, null, 2));
        //     // });


        //     // set seat session
        //     var curSeat = SeatList.findOne({ IP: curIP });
        //     if(curSeat){
        //         console.log("found the current seat "+curSeat._id);
        //         SeatList.update({ _id: curSeat._id }, { $set: {status: "active"} });
        //         Session.set('selectedSeat', curSeat._id);
        //     }
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
        'seatstatus': function(){
            console.log("seatstatus");
            var curSeatID = this._id;
            var curSeat = SeatList.findOne({ _id: curSeatID });

            if(curSeat){
                return curSeat.status;
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
            }
        },
        
    });

    Template.statusbuttons.events({
        'click .good': function(event){
            console.log("good");
            var seatID = Session.get('selectedSeat');
            console.log("id: "+seatID);
            SeatList.update({ _id: seatID }, { $set: {status: "good"} });
        },
        'click .meh': function(event){
            console.log("meh");
            var seatID = Session.get('selectedSeat');
            SeatList.update({ _id: seatID }, { $set: {status: "meh"} });
        },
        'click .bad': function(event){
            console.log("bad");
            var seatID = Session.get('selectedSeat');
            SeatList.update({ _id: seatID }, { $set: {status: "bad"} });
        }
    })

    Template.classroomlayout.events({

    });
}