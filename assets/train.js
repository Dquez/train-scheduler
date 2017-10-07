// Users from many different machines must be able to view same train times.


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

    // Uploads employee data to the database
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
});