import * as React from 'react'
import * as D3 from 'd3'
import D3ChartScriptRendererBase from '../ChartRenderer';
import * as ChartClient from '../ChartClient';
import * as ChartUtils from '../Templates/ChartUtils';
import { getClickKeys, translate, scale, rotate, skewX, skewY, matrix, scaleFor, rule, ellipsis } from '../Templates/ChartUtils';


export default class BarsChartScriptRendererBase extends D3ChartScriptRendererBase {

    drawChart(data: ChartClient.ChartTable, chart: D3.Selection<SVGElement, {}, HTMLDivElement, unknown >) {
              
      var charge = parseInt(data.parameters["Charge"]);
      var linkDistance = parseInt(data.parameters["LinkDistance"]);
      
      var size = data.columns.c2.token == null? null : scaleFor(data.columns.c2, data.rows.map(function(r){return r.c2;}), 1, parseFloat(data.parameters["MaxWidth"]), "ZeroMax");
      
      chart.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 5 10")
        .attr("refX", "10")
        .attr("refY", "0")
        .attr("markerWidth", "10")
        .attr("markerHeight", "6")
        .attr("orient", "auto")
        .style("fill", "#ccc")
        	.append("path")
        	.attr("d", "M0,-2L10,0L0,2");
      
    
      var keys = data.rows.map(function(r){return r.c0;})
         .concat(data.rows.map(function(r){return r.c1;}))
         .filter(function(c){return c.key != undefined;}); 
      
       
     var nodes = d3.nest()
        .key(function(c){return c.key; })
        .rollup(function(cs){return cs[0]; })
        .entries(keys)
         .map(function(p){return { column: p.value };}); //distinct
                 
      
      var nodeKeys = nodes.map(function(c){return c.column.key;});
      
      var links =  data.rows
         			.filter(function(r){
                      return r.c0.key != undefined && 
       						 r.c1.key != undefined; })
         		    .map(function(r){
                      return { 
                        source: nodeKeys.indexOf(r.c0.key),
                        target: nodeKeys.indexOf(r.c1.key),
                        value : r.c2,
                        c0: r.c0,
                        c1: r.c1,
                     }; });
      
     var color = d3.scaleOrdinal(ChartUtils.getColorScheme(data.parameters["ColorScheme"], data.parameters["ColorSchemeSteps"]))
       
     var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
     
    //  var force = d3.layout.force()
    //      .charge(-charge) 
    //      .linkDistance(linkDistance)
    //      .size([width, height]);
    
      
    //    force
    //        .nodes(nodes)
    //        .links(links)
    //        .start();
      
        simulation
          .nodes(nodes)
          .on("tick", ticked);
      
       simulation.force("link")
          .links(links);
     
       var link = chart.selectAll("line.link")
           .data(links)
         .enter().append("line")
           .attr('shape-rendering', 'initial')
           .attr("class", "link")
           .style("stroke", "#ccc")
           .attr("marker-end","url(#arrow)")
           .style("stroke-width", size == null ? 2 : function(lk) {  return size(lk.value); });
      
      link.append("title")
        .text(function(lk) { return lk.c0.niceToString() + (size == null?  " -> ": (" -(" + lk.value.niceToString() + ")-> " ))+ lk.c1.niceToString() ; });
     
       var node = chart.selectAll("circle.node")
           .data(nodes)
         .enter().append("circle")
           .attr('shape-rendering', 'initial')
           .attr("class", "node")
           .attr("r", 5)
           .style("fill", function(d) { return d.column.color || color(d.column); })
           .call(force.drag);
      
      
     
       node.append("title")
           .text(function(d) { return d.column.niceToString(); });
     
     function ticked() {
         link.attr("x1", function(d) { return d.source.x; })
             .attr("y1", function(d) { return d.source.y; })
             .attr("x2", function(d) { return d.target.x; })
             .attr("y2", function(d) { return d.target.y; });
     
         node.attr("cx", function(d) { return d.x; })
             .attr("cy", function(d) { return d.y; });
       }
    

    }
}
