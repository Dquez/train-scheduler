// Users from many different machines must be able to view same train times.
// Consider updating your "minutes to arrival" and "next train time" text once every minute. This is significantly more challenging; only attempt this if you've completed the actual activity and committed it somewhere on GitHub for safekeeping (and maybe create a second GitHub repo).

// Try adding update and remove buttons for each train. Let the user edit the row's elements-- allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).

// As a final challenge, make it so that only users who log into the site with their Google or GitHub accounts can use your site. You'll need to read up on Firebase authentication for this bonus exercise.

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyC8lfjfnEfGPan4xBhke7yEdSBG8OLCBz4",
    authDomain: "when-is-next-train.firebaseapp.com",
    databaseURL: "https://when-is-next-train.firebaseio.com",
    projectId: "when-is-next-train",
    storageBucket: "when-is-next-train.appspot.com",
    messagingSenderId: "824511745137"
};
firebase.initializeApp(config);
var database = firebase.database();

// Clock that updates every second
var myTimer = setInterval(myTimer, 1000);

function myTimer() {
    var d = new Date();
    $("#current-time").text(d.toLocaleTimeString());
}

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();
    var firstTrainConverted = moment(firstTrain, "hh:mm");
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var minutesTillTrain = frequency - tRemainder;
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("HH:mm");

    // Train object to be stored in database
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        nextTrain: nextTrain,
        minutesTillTrain: minutesTillTrain
    };
    database.ref().push(newTrain);



    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        // Store everything into a variable, can reuse variable names since they are out of scope.
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        var frequency = childSnapshot.val().frequency;
        var nextTrain = childSnapshot.val().nextTrain;
        var minutesTillTrain = childSnapshot.val().minutesTillTrain;

        $("#employee-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + nextTrain + " PM" + "</td><td>" + minutesTillTrain + "</td></tr>");
    },
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


// writeNewPost(trainName, destination, firstTrain, frequency, nextTrain, minutesTillTrain);


// function writeNewPost(trainName, destination, firstTrain, frequency, nextTrain, minutesTillTrain) {

// * Was not able to figure out the update after every minute*

//     // A post entry.


//     // Get a key for a new Post.
//     var newPostKey = firebase.database().ref().child("when-is-next-train").push().key;
//     console.log(newPostKey);

//     // Write the new post's data simultaneously in the posts list and the user's post list.
//     var updates = {};
//     updates[newPostKey] = newTrain;
//     // updates["/user-posts/" + uid + "/" + newPostKey] = postData;

//     return firebase.database().ref().update(updates);
// }

// var myKey = database.ref(/"when-is-next-train"/).key;


// firebase.child("auctions").on('value', function(snapshot) {
//     snapshot.ref().update({a: true}); // or snapshot.ref if you're in SDK 3.0 or higher
// });