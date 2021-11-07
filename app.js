  
// Use D3 library to read in samples.json

function buildMetadata(sample) {
    d3.json("samples.json").then(function(data) {
        var metadata = data.metadata;
        var resultsArray = metadata.filter(sampleObject => 
            sampleObject.id == sample);
        var result = resultsArray[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h5").text(`${key}: ${value}`);
        });
    });
}
// create a function to build the charts
function buildbarCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObject => 
            sampleObject.id == sample);
        var result = resultsArray[0];
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;


        var y_labels3 = ids.slice(0,10).toString();
        var y_labels2 = y_labels3.split(',');
        var y_labels = y_labels2.map(i=> 'OTU '+i)
        // console.log(y_labels)


        var bar_data = [
            {
                x: values.slice(0, 10).reverse(),
                y: y_labels.reverse(),
                text: labels,
                type: 'bar',
                //text:ids,
                orientation: 'h',        
            }
        ];
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {
            tickmode: "linear", //  If "linear", the placement of the ticks is determined by a starting position `tick0` and a tick step `dtick`
            tick0: 0,
            dtick: 25
        }
        //yaxis: y_labels,
      };
    
      Plotly.newPlot("bar", bar_data, barLayout);

    });

}

// create a function to build the charts
function buildbubbleChart(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObject => 
            sampleObject.id == sample);
        var result = resultsArray[0];
        var bubbleids = result.otu_ids;
        var bubblelabels = result.otu_labels;
        var bubblevalues = result.sample_values;

    // Create a bubble chart

      var bubblelayout = {
        title:'Bubble Chart for Belly Button Bacteria',
        xaxis: {title: "OTU ID"},
        yaxis: {title: "OTU #"},
    };

      var bubbledata = [
            {
            x: bubbleids,
            y: bubblevalues,
            text: bubblelabels,
            mode: "markers",
            marker: {
                color: bubbleids,
                size: bubblevalues,
                sizeref:0.1,
                sizemode: 'area',
                line: {
                    color:'black', 
                    width:1,
            }
        }
            }
    ];
        Plotly.newPlot("bubble", bubbledata, bubblelayout);

    });

}

function buildgauge(sample) {
        d3.json("samples.json").then(function(data) {
            var metadata = data.metadata;
            var resultsArray = metadata.filter(sampleObject => 
                sampleObject.id == sample);
            var result = resultsArray[0];
        var bubbleids = result.otu_ids;
        var wash = result.wfreq;
        console.log(wash)

    // Create a bubble chart

    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wash,
          title: " Weekly Bellly Button Washes" ,
          type: "indicator",
          mode: "gauge+number",
          delta: { reference: 2.83 },
          gauge: {
            axis: { range: [null, 10], dtick: 1  },
            steps: [
              { range: [0, 10], color: "lightgray" }
            ],
            threshold: {
              line: { color: "black", width: 3 },
              //thickness: 5.75,
              value: wash,
            }
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);

    });

}

function init() {
    // select the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the dropdown options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildbarCharts(firstSample);
        buildgauge(firstSample);
        buildbubbleChart(firstSample);
        buildMetadata(firstSample);
    });
    }
    
    function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildbarCharts(newSample);
    buildgauge(newSample);
    buildbubbleChart(newSample);
    buildMetadata(newSample);
    }
    
    
    
    // Initialize the dashboard
init();
