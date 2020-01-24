// //function sampleMetadata() {
//     d3.json("data/samples.json").then((importedData) => {
//         var data = importedData;
//         data.sort(function(a, b) {
//             return parseFloat(a.)
//         })
//     }
// }

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("data/samples.json").then((data) => {
      var sampleNames = data.names;
      //console.log(data);
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
}

function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata
    console.log(metadata);

    var clear_metadata = d3.select("#sample-metadata");
    clear_metadata.html("");

    Object.entries(metadata).forEach(([key,value]) => {
      var row = clear_metadata.append("p");
      row.text(`${key}: ${value}`);
    })

  })
}

function buildCharts(sample) {
    var url = d3.json("data/samples.json");

    url.then((data) => {
      var sampleData = data.samples;
      console.log(sampleData);

      var arr = sampleData.filter(object => object.id == sample);
      var result = arr[0];

      var trace1 = {
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: 'markers',
        marker: {
          size: result.sample_values,
          color: result.otu_ids
        }
      };

      var bubbleData = [trace1];
      var bubbleLayout = {
        title: 'Belly Button Bacteria Bubble Chart'
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      var trace2 = {
        y: result.otu_ids.slice(0,10).reverse(),
        labels: result.sample_values.slice(0,10).reverse(),
        text: result.otu_labels.slice(0,10).reverse(),
        type: "bar",
        textinfo: 'percent',
        orientation: 'h'
      }

      var barData = [trace2];
      var barLayout = {
        title: 'Belly Button Bacteria Pie Chart'
      };

      Plotly.newPlot("bar", barData, barLayout);

    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();