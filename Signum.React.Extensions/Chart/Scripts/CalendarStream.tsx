import * as React from 'react'
import * as D3 from 'd3'
import D3ChartScriptRendererBase from '../ChartRenderer';
import * as ChartClient from '../ChartClient';
import * as ChartUtils from '../Templates/ChartUtils';
import { getClickKeys, translate, scale, rotate, skewX, skewY, matrix, scaleFor, rule, ellipsis } from '../Templates/ChartUtils';


export default class BarsChartScriptRendererBase extends D3ChartScriptRendererBase {

    drawChart(data: ChartClient.ChartTable, chart: D3.Selection<SVGElement, {}, HTMLDivElement, unknown >) {
            {  
      var day = d3.timeFormat("%w"),
        week = d3.timeFormat("%U"),
        format = d3.timeFormat("%Y-%m-%d");
       
      if(data.parameters["StartDate"] == "Monday")
      {
        var oldWeek = week;
        var oldDay = day; 
        
        day = function(d) {
           var old = oldDay(d); 
           if(old == 0)
               return 6;
            
           return old - 1;
        }
        
        week = function(d) 
        {
            if(oldDay(d) == 0)
              return oldWeek(d) - 1;
            return oldWeek(d);
        } 
      }
      
      var scaleFunc = scaleFor(data.columns.c1, data.rows.map(function(r){return r.c1;}), 0, 1, data.parameters["ColorScale"]);
    
      var colorInterpolate = data.parameters["ColorInterpolate"];
      var colorInterpolation = ChartUtils.getColorInterpolation(colorInterpolate); 
      var color = function(v){return colorInterpolation(scaleFunc(v)); }
      
      var minDate = d3.min(data.rows, function(r){return new Date(r.c0) });
      var maxDate = d3.max(data.rows, function(r){return new Date(r.c0) });
     
      var numDaysX = 53;
      var numDaysY = ((maxDate.getFullYear() - minDate.getFullYear() + 1) * (7 + 1));
      
      var horizontal = (numDaysX > numDaysY) == (width > height);
      
      var cellSizeX = (width - 20)  / (horizontal? numDaysX: numDaysY);
      var cellSizeY = (height - 20) / (horizontal? numDaysY: numDaysX);
      var cellSize = Math.min(cellSizeX, cellSizeY); 
      
      function cleanDate(d){
        var str = d.toJSON();
    
         var index = str.lastIndexOf('.'); 
         if (index == -1)
           throw Error(". not found");
    
         return str.substring(0, index);
      }
      
      var yRule = rule({
        _1: '*',
        title: 14,
        _2: 4,
        content: (horizontal? numDaysY : numDaysX) * cellSize,
        _4: '*',
      }, height);
      //yRule.debugY(chart);
      
      var xRule = rule({
        _1: '*',
        title: 14,
        _2: 4,
        content: (horizontal? numDaysX : numDaysY) * cellSize,
        _4: '*',
      }, width);
      //xRule.debugX(chart);
      
      var svg = chart.append('svg:g').attr("transform", translate(xRule.start("content"), yRule.start("content")))
        .enterData(d3.range(minDate.getFullYear(), maxDate.getFullYear() + 1), "g")
        .attr("transform", function(yr){      
          return horizontal? translate(0, (yr - minDate.getFullYear()) * (cellSize * (7 + 1))):
                             translate((yr - minDate.getFullYear()) * (cellSize * (7 + 1)), 0);});
    
      svg.append("text")
      .attr("transform", horizontal? translate(-6, cellSize * 3.5) + rotate(-90) :
                                     translate(cellSize * 3.5, -6))
        .attr("text-anchor", "middle")
        .text(String);
    
      var groups = data.rows.toObject(r => r.c0.key);
      
      var rect = svg.selectAll("rect.day")
         .data(function(d) { return d3.utcDays(new Date(Date.UTC(d, 0, 1)), new Date(Date.UTC(d + 1, 0, 1))); })
         .enter().append("rect")
         .attr("stroke","#ccc")
         .attr("fill",function(d) {   
           var r = groups[cleanDate(d)];
           return r == undefined ? "#fff": color(r.c1.key);})
         .attr("width", cellSize)
         .attr("height", cellSize)
         .attr("x", function(d) { return (horizontal? week(d): day(d)) * cellSize; })
         .attr("y", function(d) { return (horizontal? (6-day(d)): week(d)) * cellSize; })
         .attr('data-click', function(d) { 
           var r = groups[cleanDate(d)];
           return r == undefined? undefined: getClickKeys(r, data.columns); 
         })
         .append("title")
        	.text(function(d) {  
              var r = groups[cleanDate(d)];
              return format(d) + (r == undefined ? "": ("("+r.c1.key+")"));
            });
      
      svg.selectAll("path.month")
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("stroke","#666")
        .attr("stroke-width", 1)
        .attr("fill","none")
        .attr("d", horizontal ? monthPathH: monthPathV);
      
      
      function monthPathH(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
        return "M" + (w0) * cellSize + "," + (7-d0) * cellSize
          	 + "H" + (w0 + 1) * cellSize + "V" + 7 * cellSize
             + "H" + (w1 + 1) * cellSize + "V" + (7 - d1 - 1) * cellSize
             + "H" + (w1) * cellSize + "V" + 0
             + "H" + (w0) * cellSize + "Z";
      
       }
      
      function monthPathV(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
        return "M" + d0 * cellSize + "," + (w0) * cellSize
          	 + "V" + (w0 + 1) * cellSize + "H" + 0
             + "V" + (w1+1) * cellSize + "H" + (d1+1) * cellSize
             + "V" + (w1) * cellSize + "H" + 7 * cellSize
             + "V" + (w0) * cellSize + "Z";
      
       }
    }
}
