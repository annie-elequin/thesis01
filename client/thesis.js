import { SeatList } from '/imports/api/SeatList';
import { Questions } from '/imports/api/Questions';
import { Log } from '/imports/api/Log';
import { HTTP } from 'meteor/http'

if(Meteor.isClient){
    Meteor.subscribe('seats');
    Meteor.subscribe('questions');
    Meteor.subscribe('log');

    function rgb(r, g, b){
        return "rgb("+r+","+g+","+b+")";
    }

    inactiveFunction = function(){
        console.log("inactive Function");
        var seatID = Session.get('selectedSeat');
        console.log("seatid: "+seatID);
        if(seatID){
            Meteor.call('changeStatus', seatID, "inactive");
        }
    }

    Template.classroomlayout.helpers({
        'getIP': function(){
            console.log("getip");
            $.get('http://ipinfo.io', function(r){
                // console.log("in the ip function");
                Session.set('curIP',r.ip);
                // console.log(r.ip);
            }, "jsonp");
        },
        'setActive': function(){
            console.log("setActive");
            
            // var curIP = "129.62.150.10";

            if(SeatList){
                // console.log("seatlist exists");
                var curIP = Session.get('curIP');
                // console.log("ip: "+curIP);
                if(curIP){
                    var curSeat = SeatList.findOne({ IP: curIP });
                    // console.log("curseat: "+curSeat);
                    if(curSeat){
                        Meteor.call('changeStatus', curSeat._id, "active");
                        Session.set('selectedSeat', curSeat._id);
                    }
                }
            }
        },
        'isActive': function(){
            console.log("isActive?");
            var seatID = Session.get('selectedSeat');
            console.log(seatID);
            if(seatID){
                return false;
            }else{
                return true;
            }
        },
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
            var curSeatID = this._id;
            var curSeat = SeatList.findOne({ _id: curSeatID });
            if(curSeat){
                return curSeat.status;
            }
        }
    });

    Template.statusbuttons.helpers({
        'getname': function(){
            console.log("getname");
            HTTP.call('GET', 'http://meteor.ecs.baylor.edu:5000', {name: "studentID"}, function(error,response){
                if(error){
                    console.log('http get FAILED');
                    console.log(error);
                }else{
                    console.log('http get success');
                    console.log(response);
                }
            });
            console.log("finished I guess");
        }
    });

    Template.statusbuttons.events({
        'click .goodbtn': function(event){
            console.log("good");
            var seatID = Session.get('selectedSeat');
            console.log("id: "+seatID);
            Meteor.call('changeStatus', seatID, "good");
        },
        'click .mehbtn': function(event){
            console.log("meh");
            var seatID = Session.get('selectedSeat');
            Meteor.call('changeStatus', seatID, "meh");
        },
        'click .badbtn': function(event){
            console.log("bad");
            var seatID = Session.get('selectedSeat');
            Meteor.call('changeStatus', seatID, "bad");
        }
    });

    Template.questions.helpers({
        'question': function(){
            var today = new Date();
            today.setHours(8,0,0,0);
            return Questions.find({ status: "active", date: {$gt: today} }, { sort: {score:-1} });
        },
        'professor': function(){
            console.log("is this the prof?");
            var seatID = Session.get('selectedSeat');
            if(seatID){
                var curSeat = SeatList.findOne({ _id: seatID});
                console.log(curSeat);
                if(curSeat.IP == "129.62.150.10"){
                    return true;
                }else{
                    return false;
                }
            }
        },
        'colorize': function(){
            var scr = this.score;
            var id = this._id;
            if(scr > 0){
                document.getElementById("content"+id).style.backgroundColor = rgb(45, (scr*8)+140, 0);
            }else if(scr < 0){
                document.getElementById("content"+id).style.backgroundColor = rgb((scr*(8))+255,130,180);
            }
        }
    });

    Template.questions.events({
        'submit form': function(event){
            event.preventDefault();
            var question = event.target.question.value;
            console.log("your question is: "+question);
            var seatID = Session.get('selectedSeat');
            if(seatID){
                var curSeat = SeatList.findOne({ _id: seatID });
                var d = new Date();
                Meteor.call('submitQuestion', curSeat.IP, question, 0, "active", d);
            }
            event.target.question.value = "";
        },
        'click .activebut': function(){
            console.log("hide the question");
            Meteor.call('changeQuestionStatus', this._id, "inactive");
        },
        'click .up': function(){
            console.log("voted up " + this._id);
            var upsesh = Session.get("up"+this._id);
            console.log("upsesh: "+upsesh);
            var temp = this.score;
            if(!upsesh){
                // "up" has not been clicked
                var downsesh = Session.get("down"+this._id);
                if(downsesh){
                    console.log(downsesh);
                    // down HAS been clicked
                    delete Session.keys["down"+this._id];
                    console.log("down sesh deleted");

                    Meteor.call('setScore', this._id, 2);
                    temp+=2;
                }else{
                    console.log("down had not been clicked");
                    Meteor.call('setScore', this._id, 1);
                    temp+=1;                   
                }
                Session.set("up"+this._id, "upvote");
                console.log("up sesh set, score: "+temp); 
                
                console.log("lets set the background color");
                document.getElementById("vote"+this._id).style.backgroundColor = rgb(50, 200, 50);
                if(temp > 0){
                    document.getElementById("content"+this._id).style.backgroundColor = rgb(50, (temp*8)+100, 50);
                }else if(temp < 0){
                    document.getElementById("content"+this._id).style.backgroundColor = rgb((temp*(-8))+150,60,60);
                }
            }

            
        },
        'click .down': function(){
            console.log("voted down " + this._id);
            var downsesh = Session.get("down"+this._id);
            console.log("downsesh: "+downsesh);
            var temp = this.score;
            if(!downsesh){
                // "down" has not been clicked
                var upsesh = Session.get("up"+this._id);
                if(upsesh){
                    console.log(upsesh);
                    // up HAS been clicked
                    delete Session.keys["up"+this._id];
                    console.log("up sesh deleted");

                    Meteor.call('setScore', this._id, -2);
                    temp-=2;
                }else{
                    Meteor.call('setScore', this._id, -1);
                    temp-=1;                    
                }
                Session.set("down"+this._id, "downvote");
                console.log("down sesh set");  

                document.getElementById("vote"+this._id).style.backgroundColor = rgb(220, 0, 0);
                if(temp > 0){
                    document.getElementById("content"+this._id).style.backgroundColor = rgb(50, (temp*8)+100, 50);
                }else if(temp < 0){
                    document.getElementById("content"+this._id).style.backgroundColor = rgb((temp*(-8))+150,60,60);
                }
            }

        }
    });

}

if(Meteor.isServer){
    Meteor.publish('seats', function(){
        return SeatList.find();
    });
    Meteor.publish('questions', function(){
        return Questions.find();
    });
    Meteor.publish('log', function(){
        return Log.find();
    });
}

Meteor.methods({
    'changeStatus': function(studID, stat){
        SeatList.update({_id: studID}, {$set:{status:stat}});
    },
    'submitQuestion': function(ipaddress, question, scr, stat, d){
        Questions.insert({ IP: ipaddress, content: question,
            score: scr, status: stat, date: d });
    },
    'changeQuestionStatus': function(questionID, stat){
        Questions.update({ _id: questionID }, { $set: {status:stat} });        
    },
    'setScore': function(questionID, score){
        Questions.update({ _id: questionID }, { $inc:score });
    },
    'recordLog': function(time, name, statechange){
        Log.insert({ timestamp: time, student: name, log: statechange });
    }
});