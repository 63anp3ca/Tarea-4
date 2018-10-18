function loadCircularHeatMap (p_anno) {
   $( "#chart" ).empty(); 
 
   d3.csv("https://raw.githubusercontent.com/63anp3ca/Tarea-4/master/data.csv", function (error, dataset) {
            if (error) { throw error; };

        var dom_element_to_append_to = '#chart';
  //      var radial_labels = ["Category 1","Category 2","Category 3","Category 4", "Category 5", "Category 6"];

        var radial_labels = ["AMAZONAS",
                            "ANTIOQUIA",
                            "ARAUCA",
                            "ATLANTICO",
                            "BOLIVAR",
                            "BOYACA",
                            "CALDAS",
                            "CAQUETA",
                            "CASANARE",
                            "CAUCA",
                            "CESAR",
                            "CHOCO",
                            "CORDOBA",
                            "CUNDINAMARCA",
                            "GUAINIA",
                            "GUAJIRA",
                            "GUAVIARE",
                            "HUILA",
                            "MAGDALENA",
                            "META",
                            "NARINO",
                            "NORTE DE SANTANDER",
                            "PUTUMAYO",
                            "QUINDIO",
                            "RISARALDA",
                            "SAN ANDRES",
                            "SANTANDER",
                            "SUCRE",
                            "TOLIMA",
                            "VALLE",
                            "VAUPÉS",
                            "VICHADA"
                            ];


        var segment_labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

       
        //var consulta = Object.assign({}, dataset.filter(function (d) { return d.anno == p_anno }));

        var consultaGroup = d3.nest()
                              .key(function(d) { return d.anno; })
                              .entries(dataset);

     
        var dataFiltered = consultaGroup.filter(function (d) { return d.key === p_anno })
        console.log("dataFiltered");
        console.log(dataFiltered);

        var dataFiltered2 = dataFiltered.map(d=> d.values);
        console.log("dataFiltered2");
        console.log(dataFiltered2);
        var consulta=dataFiltered2[0];


        var margin = {top: 50, right: 50, bottom: 50, left: 50};
        var width = 1200 - margin.left - margin.right;

        var height = width;
        var innerRadius = width/14;
        var segmentHeight = (width - margin.top - margin.bottom - 2*innerRadius )/(2*radial_labels.length)

        var chart = circularHeatChart()
        .innerRadius(innerRadius)
        .segmentHeight(segmentHeight)
        .range(["white", "#01579b"])
        .radialLabels(radial_labels)
        .segmentLabels(segment_labels);

        chart.accessor(function(consulta) {return consulta.value;})

           
        var svg = d3.select(dom_element_to_append_to)
        .selectAll('svg')
        .data([consulta])
        .enter()
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .attr("transform",
            "translate(" + ( (width )/2 - (radial_labels.length*segmentHeight + innerRadius)  ) + "," + margin.top + ")")
        .call(chart);
        console.log("gp2");
        var tooltip = d3.select(dom_element_to_append_to)
        .append('div')
        .attr('class', 'tooltip')
        .attr("fill","#000000" ) ;



        // mapiar etiquetas
        tooltip.append('div')
        .attr('class', 'month');
        tooltip.append('div')
        .attr('class', 'value');
        tooltip.append('div')
        .attr('class', 'type');
         tooltip.append('div')
        .attr('class', 'anno');


        //imprimir etiquetas
        svg.selectAll("path")
        .on('mouseover', function(d) {
           
            tooltip.select('.month').html("<b> Mes: " + d.month + "</b>");
            tooltip.select('.type').html("<b> Departamento: " + d.type + "</b>");
            tooltip.select('.value').html("<b> celulares: " + d.value + "</b>");
            tooltip.select('.anno').html("<b> Año: " + d.anno + "</b>");
            

            tooltip.style('display', 'block');
            tooltip.style('opacity',2);
        })
        .on('mousemove', function(d) {

            tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX - 25) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.style('display', 'none');
            tooltip.style('opacity',0);
        });

   });     
}


function circularHeatChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    innerRadius = 20,
    numSegments = 12,
    segmentHeight = 20,
    domain = null,
    range = ["blue", "red"],
    accessor = function(d) {return d;},
    radialLabels = segmentLabels = [];

   
    function chart(selection) {
        selection.each(function(data) {
     

            var svg = d3.select(this);
    
            var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
            
          
            g = svg.append("g")
                .classed("circular-heat", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            var autoDomain = false;
            if (domain === null) {
                domain = d3.extent(data, accessor);
                autoDomain = true;
            }

            if(autoDomain)
                domain = null;

            g.selectAll("path").data(data)
                .enter().append("path")
                .attr("d", d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
                .attr("stroke", function(d) {return "#4f5b69";})
                .attr("fill",function(d){
                if (d.value <= 10) {
                  return "#fff7fb"  // Green
                } else if (d.value > 10 && d.value <= 50) {
                  return "#ece2f0"  // Yellow
                } else if (d.value > 51 && d.value <= 70) {
                  return "#d0d1e6"  // Orange
                } else if (d.value > 71 && d.value <= 90) {
                  return "#a6bddb"  // Orange
                } else if (d.value > 91 && d.value <= 110) {
                  return "#67a9cf"  // Orange
                } else if (d.value > 111 && d.value <= 200) {
                  return "#3690c0"  // Orange
                } else if (d.value > 201 && d.value <= 500) {
                  return "#02818a"  // Orange
                } else if (d.value > 501 && d.value <= 600) {
                  return "#016c59"  // Orange
                } else if (d.value >600 && d.value <= 1000) {
                  return "#014636"  // Orange
                } else {
                  return "#e31a1c"  // Red
                }
              });


            // Id. único para que las definiciones de la ruta de texto sean únicas
            var id = d3.selectAll(".circular-heat")[0].length;

            //Radial labels
            var lsa = 0.01; //Label start angle
            var labels = svg.append("g")
                .classed("labels", true)
                .classed("radial", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");
             
            // imprime las etiquetas de las categorias  
            labels.selectAll("def")
                .data(radialLabels).enter()
                .append("def")
                .append("path")
                .attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
                .attr("d", function(d, i) {
                    var r = innerRadius + ((i + 0.2) * segmentHeight);
                    return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) +
                            " a" + r + " " + r + " 0 1 1 -1 0";
                });

            labels.selectAll("text")
                .data(radialLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
                .style("font-size", "12px")
                .text(function(d) {return d;});

            //Segment labels
            var segmentLabelOffset = 2;
            var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
            // imprime nombre meses
            labels = svg.append("g")
                .classed("labels", true)
                .classed("segment", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.append("def")
                .append("path")
                .attr("id", "segment-label-path-"+id)
                .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

            labels.selectAll("text")
                .data(segmentLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", "#segment-label-path-"+id)
                .style("font-size", "20px")
                .attr("startOffset", function(d, i) {return i * 100 / numSegments + "%";})
                .text(function(d) {return d;});
        });

    }

    /* Arc functions */
    ir = function(d, i) {
        return innerRadius + Math.floor(i/numSegments) * segmentHeight;
    }
    or = function(d, i) {
        return innerRadius + segmentHeight + Math.floor(i/numSegments) * segmentHeight;
    }
    sa = function(d, i) {
        return (i * 2 * Math.PI) / numSegments;
    }
    ea = function(d, i) {
        return ((i + 1) * 2 * Math.PI) / numSegments;
    }

    /* Configuration getters/setters */
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.innerRadius = function(_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.numSegments = function(_) {
        if (!arguments.length) return numSegments;
        numSegments = _;
        return chart;
    };

    chart.segmentHeight = function(_) {
        if (!arguments.length) return segmentHeight;
        segmentHeight = _;
        return chart;
    };

    chart.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return chart;
    };

    chart.range = function(_) {
        if (!arguments.length) return range;
        range = _;
        return chart;
    };

    chart.radialLabels = function(_) {
        if (!arguments.length) return radialLabels;
        if (_ == null) _ = [];
        radialLabels = _;
        return chart;
    };

    chart.segmentLabels = function(_) {
        if (!arguments.length) return segmentLabels;
        if (_ == null) _ = [];
        segmentLabels = _;
        return chart;
    };

    chart.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return chart;
    };

    return chart;
}