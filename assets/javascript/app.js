// Initialize Firebase
var config = {
  apiKey: "AIzaSyB8Y9V7Z7uubsoiXUsGw5mMvJkyVCNYH8w",
  authDomain: "train-schedule-4f794.firebaseapp.com",
  databaseURL: "https://train-schedule-4f794.firebaseio.com",
  projectId: "train-schedule-4f794"
};
firebase.initializeApp(config);
var database = firebase.database();

//Run Time
setInterval(function(startTime) {
  $("#timer").html(moment().format("hh:mm a"));
}, 1000);

// Add train Button Click
$("#add-train").on("click", function() {
  event.preventDefault();
  var train = $("#trainname")
    .val()
    .trim();
  var destination = $("#destination")
    .val()
    .trim();
  var frequency = $("#frequency")
    .val()
    .trim();
  var firstTime = $("#firsttime")
    .val()
    .trim();

  var trainInfo = {
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirsttime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  database.ref().push(trainInfo);

  $("#trainname").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#firsttime").val("");
});

// Firebase watcher + initial loader
database.ref().on(
  "child_added",
  function(childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    $("#timer").text(currentTime.format("hh:mm a"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;

    var minutesAway = frequency - tRemainder;

    var nextArrival = moment()
      .add(minutesAway, "minutes")
      .format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

    $("#train-table > tbody").append(
      "<tr><td>" +
        train +
        "</td><td>" +
        destination +
        "</td><td>" +
        frequency +
        "</td><td>" +
        nextArrival +
        "</td><td>" +
        minutesAway +
        "</td></tr>"
    );
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

function timeUpdater() {
  $("#train-table > tbody").empty();

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    $("#timer").text(currentTime.format("hh:mm a"));
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);
    var nextArrival = moment()
      .add(minutesAway, "minutes")
      .format("hh:mm a");
    $("#train-table > tbody").append(
      "<tr><td>" +
        train +
        "</td><td>" +
        destination +
        "</td><td>" +
        frequency +
        "</td><td>" +
        nextArrival +
        "</td><td>" +
        minutesAway +
        "</td></tr>"
    );
  });
}
setInterval(timeUpdater, 1000);
