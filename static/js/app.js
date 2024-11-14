
// make the url a conbstant variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Function that populates metadata info
function buildMetadata(sample) {

// Use D3 to retrieve all of the data
d3.json(url).then((data) => {

// Retrieve all metadata
let metadata = data.metadata;
console.log(metadata);

 // Filter based on the value of the sample
 let value = metadata.filter(result => result.id == sample);

 // Log the array of metadata objects after they have been filtered
 console.log(value);

 // Get the first index from the array
 let valueData = value[0];

 // Clear out metadata
 d3.select("#sample-metadata").html("");

 // using Object.entries to add each key/value pair to the panel
 Object.entries(valueData).forEach(([key, value]) => {
   // Log the individual key/value pairs being appended 
   console.log(key, value);
   d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
 });
});
}
// Initialize the dashboard
function init() {

// Use D3 to select the dropdown menu
let dropdownMenu = d3.select("#selDataset");

// Use D3 to get sample names and populate the drop-down selector
d3.json(url).then((data) => {
        
    // Set a variable for the sample names
    let names = data.names;

    // Add  samples to dropdown menu
    names.forEach((id) => {

        // Log the value of id for each iteration of the loop
        console.log(id);

        dropdownMenu.append("option")
        .text(id)
        .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
    });
};


// Function to build the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        //top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // details for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // layout
        let layout = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: {
                title: "Number of Bacteria"
            }
        };

        // render the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function to build the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // details for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // layout
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Number of Bacteria"},
        };

        // render the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function to updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Call to initialize function
init();