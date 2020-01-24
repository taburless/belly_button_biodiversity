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
  d3.json("/metadata/"+sample).then((data) => {
    console.log(data);

    var metadata = d3.select("#sample-metadata");
    metadata.html("");

    Object.entries(data).forEach(([key,value]) => {
      var row = metadata.append("p");
      row.text(`${key}: ${value}`);
    })

  })
}

function buildCharts(sample) {
    var url = d3.json("data/samples.json");

    url.then((sampleData) => {
      console.log(sampleData);

      var trace1 = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers'
      };

      var bubbleData = [trace1];
      var bubbleLayout = {
        title: 'Belly Button Bacteria Bubble Chart'
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      var trace2 = {
        values: sampleData.sample_values.slice(0,10),
        labels: sampleData.otu_ids.slice(0,10),
        type: "pie",
        textinfo: 'percent'
      }

      var pieData = [trace2];
      var pieLayout = {
        title: 'Belly Button Bacteria Pie Chart'
      };

      Plotly.newPlot("pie", pieData, pieLayout);

    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();