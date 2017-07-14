function draw(el, diameter, data) {

    d3.select(el).selectAll("*").remove();

    var format = d3.format(",d");
    var color = d3.scaleOrdinal(d3.schemeCategory20c);

    var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select(el).append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var root = d3.hierarchy(classes(data))
        .sum(function (d) { return d.value; })
        .sort(function (a, b) { return b.value - a.value; });

    bubble(root);
    var node = svg.selectAll(".node")
        .data(root.children)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function (d) { return d.data.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function (d) { return d.r; })
        .on('click', function(){
            console.log('click')
            d3.select(el)
            .selectAll('circle').transition().duration(250).style('fill','rgba(0,0,0,0)');
            d3.select(this).transition().duration(250).style('fill', 'rgba(9, 109, 189, 0.2)')
        })
       /* .style("fill", function (d) {
            return color(d.data.packageName);
        });*/

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.className.substring(0, d.r / 3); });

    node.append("text")
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.value + '%' });

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) { recurse(node.name, child); });
            else classes.push({ packageName: name, className: node.name, value: node.size });
        }

        recurse(null, root);
        return { children: classes };
    }
}