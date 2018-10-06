import * as React from 'react'
import * as D3 from 'd3'
import D3ChartScriptRendererBase from '../ChartRenderer';
import * as ChartClient from '../ChartClient';
import * as ChartUtils from '../Templates/ChartUtils';
import { getClickKeys, translate, scale, rotate, skewX, skewY, matrix, scaleFor, rule, ellipsis } from '../Templates/ChartUtils';


export default class BarsChartScriptRendererBase extends D3ChartScriptRendererBase {

    drawChart(data: ChartClient.ChartTable, chart: D3.Selection<SVGElement, {}, HTMLDivElement, unknown >) {
              
       var pStack = data.parameters["Stack"];
       var pivot = data.columns.c1.token == null ?  
           ChartUtils.toPivotTable(data, "c0", ["c2", "c3", "c4", "c5", "c6"]): 
           ChartUtils.groupedPivotTable(data, "c0", "c1", "c2");
      
      
      var xRule = rule({
        _1 : 5,
        title : 15,
        _2 : 10, 
        labels: data.parameters["Labels"] == "Margin" ? parseInt(data.parameters["LabelsMargin"]) : 0,
        _3: data.parameters["Labels"] == "Margin" ? 5 : 0,
        ticks: 4,
        content: '*',
        _4: 5,
      }, width);
      //xRule.debugX(chart)
      
      var yRule = rule({
        _1 : 5,
        legend : 15,
        _2 : 5,
        content: '*',
        ticks: 4,
        _3 : 5,
        labels: 10,
        _4 : 10,
        title: 15,
        _5 : 5,
      }, height);
      //yRule.debugY(chart);
    
      
      var y = d3.scaleBand()
          .domain(pivot.rows.map(function (d) { return d.rowValue.key; }))
          .range([0, yRule.size('content')]);
      
      var stack = d3.stack()
        .offset(ChartUtils.getStackOffset(pStack))
        .order(ChartUtils.getStackOrder(data.parameters["Order"]))
        .keys(pivot.columns.map(function(d) { return d.key; }))
        .value(function(r, k){ 
          var v = r.values[k]; 
          return v && v.value && v.value.key || 0; 
        });
      
      var stackedSeries = stack(pivot.rows);
      
      var max = d3.max(stackedSeries, function(s){ return d3.max(s, function(v){return v[1];}); });
      var min = d3.min(stackedSeries, function(s){ return d3.min(s, function(v){return v[0];}); });
      
      var x = d3.scaleLinear()
          .domain([min, max])
          .range([0, xRule.size('content')]);
    
      var xTicks = x.ticks(width/60);
      
      chart.append('svg:g').attr('class', 'x-lines').attr('transform', translate(xRule.start('content'), yRule.start('content')))
        .enterData(xTicks, 'line', 'y-lines')
        .attr('x1', function(t) { return x(t); })
        .attr('x2', function(t) { return x(t); })
        .attr('y1', yRule.size('content'))
      	.style('stroke', 'LightGray');
      
      chart.append('svg:g').attr('class', 'x-tick').attr('transform', translate(xRule.start('content'), yRule.start('ticks')))
        .enterData(xTicks, 'line', 'x-tick')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y2', yRule.size('ticks'))
        .style('stroke', 'Black');
      
      var formatter = pStack == "expand" ? d3.format(".0%") : 
        		      pStack == "zero" ? d3.format("") : 
                      function(n) { return d3.format("")(n) + "?"};
      
      chart.append('svg:g').attr('class', 'x-label').attr('transform', translate(xRule.start('content'), yRule.end('labels')))
        .enterData(xTicks, 'text', 'x-label')
        .attr('x', x)
        .attr('text-anchor', 'middle')
        .text(formatter);
      
      chart.append('svg:g').attr('class', 'x-title').attr('transform', translate(xRule.middle('content'), yRule.middle('title')))
        .append('svg:text').attr('class', 'x-title')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
      	.text(pivot.title);
      
      
      chart.append('svg:g').attr('class', 'y-tick').attr('transform', translate(xRule.start('ticks'), yRule.end('content')))
    	.enterData(pivot.rows, 'line', 'y-tick')
    	.attr('x2', xRule.size('ticks'))
    	.attr('y1', function (v) { return -y(v.rowValue); })
    	.attr('y2', function (v) { return -y(v.rowValue); })
      	.style('stroke', 'Black');
    
      chart.append('svg:g').attr('class', 'y-title').attr('transform', translate(xRule.middle('title'), yRule.middle('content')) + rotate(270))
        .append('svg:text').attr('class', 'y-title')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(data.columns.c0.title);
    
      var color = d3.scaleOrdinal(ChartUtils.getColorScheme(data.parameters["ColorScheme"], data.parameters["ColorSchemeSteps"])).domain(pivot.columns.map(function (s) { return s.key; }));
      
      //PAINT GRAPH
      chart.enterData(stackedSeries, 'g', 'shape-serie').attr('transform', translate(xRule.start('content'), yRule.start('content')))
        .each(function(s){
          
           d3.select(this).enterData(s, 'rect', 'shape')
            .filter(function(v) {return v.data.values[s.key] != undefined;})
            .attr('stroke', y.bandwidth() > 4 ? '#fff' : null)
            .attr('fill', function (v) { return s.color || color(s.key); })
            .attr('height', y.bandwidth())
            .attr('width', function (v) { return x(v[1]) - x(v[0]); })
            .attr('x', function (r) { return x(r[0])})
            .attr('y', function (v) { return y(v.data.rowValue)})
            .attr('data-click', function (v) { return getClickKeys(v.data.values[s.key].rowClick, data.columns); })
            .append('svg:title')
            .text(function(v) { return v.data.values[s.key].valueTitle; });
    
            if (y.bandwidth() > 15 && data.parameters["NumberOpacity"] > 0)
            {
              d3.select(this).enterData(s, 'text', 'number-label')
              .filter(function(v) { return (x(v[1]) - x(v[0])) > 20; })
              .attr('x', function (v) { return x(v[0]) * 0.5 + x(v[1]) * 0.5; })
              .attr('y', function (v) { return y(v.data.rowValue) + y.bandwidth() / 2; })
              .attr('fill', data.parameters["NumberColor"])
              .attr('dominant-baseline', 'central')
              .attr('opacity', data.parameters["NumberOpacity"])
              .attr('text-anchor', 'middle')
              .attr('font-weight', 'bold')
              .text(function (v) { return v.data.values[s.key].value; })
              .attr('data-click', function (v) { return getClickKeys(v.data.values[s.key].rowClick, data.columns); })
              .append('svg:title')
              .text(function(v) { return v.data.values[s.key].valueTitle; });
            }
        });
    
      
      if (y.bandwidth() > 15 && pivot.columns.length > 0) {
        
        if(data.parameters["Labels"] == "Margin")
        {
           chart.append('svg:g').attr('class', 'y-label').attr('transform', translate(xRule.end('labels'), yRule.start('content') + y.bandwidth() / 2))
            .enterData(pivot.rows, 'text', 'y-label')
            .attr('y', function (v) { return y(v.rowValue); })
            .attr('dominant-baseline', 'central')
            .attr('text-anchor', 'end')
            .text(function (v) { return v.rowValue.niceToString(); })
            .each(function (v) { ellipsis(this, xRule.size('labels'), labelMargin); });
        }
        else if(data.parameters["Labels"] == "Inside")
        {    
          function maxValue(rowIndex){
              return stackedSeries[stackedSeries.length - 1][rowIndex][1];
          }
          
          var size = xRule.size('content');
          var labelMargin = 5;
          chart.append('svg:g').attr('class', 'y-axis-tick-label').attr('transform', translate(xRule.start('content'), yRule.start('content') + y.bandwidth() / 2))
            .enterData(pivot.rows,'text', 'y-axis-tick-label sf-chart-strong')
            .attr('y', function (v) { return y(v.rowValue); })
            .attr('x', function(v, i) { return x(maxValue(i)) >= size/2 ? 0 : x(maxValue(i)); })
            .attr('dx', function (r,i) { return labelMargin; })
            .attr('text-anchor', function (v) { var posx = x(v.max); return posx >= size/2 ? 'end' : 'start'; })
            .attr('fill', function (r,i) { return x(maxValue(i)) >= size/2 ? '#fff' : '#000'; })
            .attr('dominant-baseline', 'central')
            .attr('font-weight', 'bold')
            .text(function (v) { return v.rowValue.niceToString(); })
            .each(function (r, i) { var posx = x(maxValue(i)); ellipsis(this, posx >= size/2 ? posx : size - posx, labelMargin); });
        }
      }
      
       var legendScale = d3.scaleBand()
            .domain(pivot.columns.map(function (s, i) { return i; }))
          	.range([0, xRule.size('content')]);
      
      if (legendScale.bandwidth() > 50) {
          var legendMargin = yRule.size('legend') + 4;
          chart.append('svg:g').attr('class', 'color-legend').attr('transform', translate(xRule.start('content'), yRule.start('legend')))
          .enterData(pivot.columns, 'rect', 'color-rect')
          .attr('x', function (e, i) { return legendScale(i); })
          .attr('width', yRule.size('legend'))
          .attr('height', yRule.size('legend'))
          .attr('fill', function (s) { return s.color || color(s.key); });
      
          chart.append('svg:g').attr('class', 'color-legend').attr('transform',  translate(xRule.start('content') + legendMargin, yRule.middle('legend') + 1))
          .enterData(pivot.columns, 'text', 'color-text')
          .attr('x', function (e, i) { return legendScale(i); })
          .attr('dominant-baseline', 'middle')
          .text(function (s) { return s.niceName; })
          .each(function (s) { ellipsis(this, legendScale.bandwidth() - legendMargin); });
      }
    
      chart.append('svg:g').attr('class', 'x-axis').attr('transform', translate(xRule.start('content'), yRule.end('content')))
         .append('svg:line')
         .attr('class', 'x-axis')
         .attr('x2', xRule.size('content'))
         .style('stroke', 'Black');
      
      chart.append('svg:g').attr('class', 'y-axis').attr('transform', translate(xRule.start('content'), yRule.start('content')))
        .append('svg:line')
        .attr('class', 'y-axis')
        .attr('y2', yRule.size('content'))
        .style('stroke', 'Black');
    }
}
