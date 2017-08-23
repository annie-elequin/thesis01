import { SeatList } from '/imports/api/SeatList';
import { Questions } from '/imports/api/Questions';
import { Log } from '/imports/api/Log';

Meteor.methods({
    'changeStatus': function(studID, stat){
        SeatList.update({_id: studID}, {$set:{status:stat}});

        var today = Date();
        var stateChange = "Student is now "+stat;
        Log.insert({ date: today, student: studID, change: stateChange });
    },
    'submitQuestion': function(seatID, ipaddress, question, scr, stat, d){
        Questions.insert({ IP: ipaddress, content: question,
            score: scr, status: stat, date: d });

        var today = Date();
        var stateChange = "Submitted question: "+question;
        Log.insert({ date: today, student: seatID, change: stateChange });
    },
    'changeQuestionStatus': function(seatID, questionID, stat){
        Questions.update({ _id: questionID }, { $set: {status:stat} });

        var today = Date();
        var stateChange = "Question "+questionID+" status changed to: "+stat;
        Log.insert({ date: today, student: seatID, change: stateChange });      
    },
    'setScore': function(seatID, questionID, score){
        Questions.update({ _id: questionID }, { $inc:score });

        var today = Date();
        var stateChange = "Question "+questionID;
        if(score > 0){
            stateChange += " voted UP.";
        }else{
            stateChange += " voted DOWN.";
        }
        Log.insert({ date: today, student: seatID, change: stateChange });
    }
});