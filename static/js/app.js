// Create demographic table in sample metadata of html
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    });
  }

  function buildCharts(sample) {

    // Use `d3.json` to fetch the sample data for the plots
    d3.json("samples.json").then((data) => {
      var samples= data.samples;
      var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
    
      // use ids for x values, samples for y values and other values for marker colors and text values
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;

        // Build a Bubble Chart using the sample data
        var LayoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "Id's" },
            hovermode: "closest",
            };
      
            var DataBubble = {
              x: ids,
              y: values,
              text: labels,
              mode: "markers",
              marker: {
                color: ids,
                size: values,
                }
            };
            
            var bubbleData = [DataBubble]
      
          Plotly.plot("bubble", bubbleData, LayoutBubble);
          
          //Build horizontal bar chart of top 10 otu's
          var bar_data = {
              x:values.slice(0,10).reverse(),
              y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              text:labels.slice(0,10).reverse(),
              type:"bar",
              orientation:"h"
            };
           
          var barData = [bar_data]
          
          //Create layout with title
          var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
          };
      
          Plotly.newPlot("bar", barData, barLayout);
        });
      }

      function init() {
        // Grab a reference to the dropdown select element
        var selector = d3.select("#selDataset");
      
        // Use the list of sample names to populate the select options
        d3.json("samples.json").then((data) => {
          var sampleNames = data.names;
          sampleNames.forEach((sample) => {
            selector
              .append("option")
              .text(sample)
              .property("value", sample);
          });
    
    //Build all charts and data from functions using samples
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    });
}
      
    // Fetch new data each time a new sample is selected
      function optionChanged(newSample) {
        buildCharts(newSample);
        buildMetadata(newSample);
      }
      
      // Initialize the dashboard
      init();