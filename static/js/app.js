// use d3 to read in samples.json
// create dropdown menu function to select sample id
function dropdown() {
    d3.json("./samples.json").then(data => {
        var sampleName = data.names;
        var dataid = d3.select("#selDataset")
        sampleName.forEach((sampleid) => {
            dataid.append("option")
                .text(sampleid)
                .property("value", sampleid)
        })
        var firstsample = sampleName[0];
        metadata(firstsample);
        Charts(firstsample);
    });
};
// call created dropdown menu function
dropdown();

// create function to populate demographics metadata for selected sample id
function metadata(id) {
    d3.json("./samples.json").then(data => {
        var sampleMetadata = data.metadata;
        var result = sampleMetadata.filter(obj => obj.id == id);
        var filterresult = result[0];
        var display = d3.select("#sample-metadata");
        display.html("");
        Object.entries(filterresult).forEach(([key, value]) => {
            display.append("h6").text(`${key}: ${value}`);
        });

    });
}

// create function for bar and bubble charts
function Charts(id) {
    d3.json("./samples.json").then(data => {
        var sampledata = data.samples;
        var result = sampledata.filter(obj => obj.id == id);
        var filterresult = result[0];
        var otu_ids = filterresult.otu_ids;
        var otu_labels = filterresult.otu_labels;
        var sample_values = filterresult.sample_values;
        var bubbledata = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];
        var barData = [{
            y: otu_ids.slice(0, 10).map(val => `OTU ${val}`).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }];

        // display bar and bubble charts
        Plotly.newPlot("bar", barData);

        Plotly.newPlot("bubble", bubbledata);

    });
};

// create function to change demographics metadata and charts when 
// different sample id is selected
function optionChanged(changedid) {
    metadata(changedid);
    Charts(changedid);
};