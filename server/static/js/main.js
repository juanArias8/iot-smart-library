$(document).ready(() => {

    // Define local variable for update graphs
    let counter = 0;

    // Get the fields for temperature, noise and number of people
    let temp = $("#temperature");
    let noise = $("#noise");
    let people = $("#people");

    // Get the buttons for temperature, noise and number of people
    let btnTemp = $("#btnTemp");
    let btnNoise = $("#btnNoise");
    let btnPeople = $("#btnPeople");

    // Get the containers for temperature, noise and number of people
    // jQuery way, used for views control
    let tempGraph = $("#tempGraph");
    let noiseGraph = $("#noiseGraph");
    let peopleGraph = $("#peopleGraph");

    // Get the containers for temperature, noise and number of people
    // Javascript way, used for Plotly
    let tempGraphContainer = document.getElementById("tempGraph");
    let noiseGraphContainer = document.getElementById("noiseGraph");
    let peopleGraphContainer = document.getElementById("peopleGraph");

    // Build graphs for temperature, noise and number of people data
    buildGraph(tempGraphContainer, "Temperature");
    buildGraph(noiseGraphContainer, "Noise");
    buildGraph(peopleGraphContainer, "People");

    // Hide noise and people graph
    noiseGraph.hide(0);
    peopleGraph.hide(0);

    // // Change graphs
    btnTemp.click(function () {
        changeGraph(tempGraph, noiseGraph, peopleGraph)
    });
    btnNoise.click(function () {
        changeGraph(noiseGraph, tempGraph, peopleGraph)
    });
    btnPeople.click(function () {
        changeGraph(peopleGraph, tempGraph, noiseGraph)
    });

    // Socket.io settings
    let socket = io.connect('http://' + document.domain + ':' + location.port);
    let topic = "library";
    let qos = "0";
    let data = '{"topic": "' + topic + '", "qos": ' + qos + '}';
    socket.emit('subscribe', data);

    // On message from device
    socket.on('mqtt_message', function (data) {
        let message = JSON.parse(data["payload"]);
        temp.text(message["temp"]);
        noise.text(message["noise"]);
        people.text(message["people"]);

        // Update the graphs
        updateGraph(tempGraphContainer, message["temp"], counter);
        updateGraph(noiseGraphContainer, message["noise"], counter);
        updateGraph(peopleGraphContainer, message["people"], counter);

        // Update counter value
        counter++;
    });
});

/**
 * Build a line graph
 * @param graph: Container for graph
 * @param title: Title for graph
 */
function buildGraph(graph, title) {
    let layout = {title: title, titlefont: {family: 'ubuntu', size: 28, color: '#000'}};
    Plotly.plot(graph, [{y: [0], type: 'line'}], layout);
}

/**
 * Update the values for a graph
 * @param graph: Container for graph
 * @param value: Value to add to the graph
 * @param counter: Indicate the number of points
 */
function updateGraph(graph, value, counter) {
    Plotly.extendTraces(graph, {y: [[value]]}, [0]);

    if (counter > 10) {
        Plotly.relayout(graph, {xaxis: {range: [counter - 10, counter]}});
    }
}

/**
 * Change the graph displayed on screen
 * @param show: Graph to be show
 * @param hideOne: Graph to be hide
 * @param hideTwo: Graph to be hide
 */
function changeGraph(show, hideOne, hideTwo) {
    hideOne.hide("slow");
    hideTwo.hide("slow");
    show.show("slow");
}