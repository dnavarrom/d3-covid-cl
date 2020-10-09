document.addEventListener('DOMContentLoaded', function () {


    // Seteamos el nombre del archivo del dataset
    var url = 'covid_mundial.csv';

    // Leemos el archivo
    d3.csv(url, function (error, data) {

        var continentes = ["Asia", "Africa", "Europe", "North America", "South America"];

        //configurar margenes y tamaños
        // Configuramos el tamaño y margen de la visualización
        var margin = { top: 200, bottom: 200, left: 100, right: 100 }, axisPadding = 10, labelxPadding = 140;
        var Width = 1200, Height = 500;
        var svgWidth = Width + margin.left + margin.right,
            svgHeight = Height + margin.top + margin.bottom;


        //configurar objeto svg vacio
        var svg = d3.select("#container")
            .append('svg')
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("class", "bubble");

        // Configurar escalas de Ejes
        var xAxis = d3.scaleLinear()
            .domain([50, 80])
            .range([0, Width]);

        var yAxis = d3.scaleLinear()
            .domain([-1, 105])
            .range([Height, 0]);



        // Dibujamos los ejes
        var xGroup = svg.append('g')
            .attr('class', 'xGroup')
            .attr("transform", "translate(60," + [Height + 10] + ")");
        xGroup.call(d3.axisBottom(xAxis));


        var yGroup = svg.append('g')
            .attr('class', 'yGroup')
            .attr('transform', 'translate(' + [margin.left - 40] + ',10)');
        yGroup.call(d3.axisLeft(yAxis));



        // Escribimos label eje y
        var labely = svg.append('g')
            .attr('transform', 'translate(' + [margin.left - axisPadding - 65, margin.top + 100] + ')');

        labely.append('text')
            .text('handwashing_Facilities')
            .attr('transform', 'rotate(-90)')
            .attr({
                'text-anchor': 'start',
                x: -250,
                y: -70,
            })


        // Escribimos label eje x
        var labelx = svg.append('g')
            .attr('transform', 'translate(' + [margin.left - 150, 120 + Height] + ')');

        labelx.append('text')
            .text('life_expectancy')
            .attr('transform', 'translate(' + [Width / 2 + margin.left, - margin.top + labelxPadding] + ')')
            .attr({
                'text-anchor': 'start',
                x: -180,
                y: 20,
            })


        
    // Escribimos label titulo
    
            var labelTitulo = svg.append('g')
                .attr('transform', 'translate(' + [margin.left - 150, margin.top - 82] + ')');
            labelTitulo.append('text')
                .text('COVID : Casos por país y continente')
                .attr('transform', 'translate(' + [Width / 2, - margin.top / 2] + ')')
                .attr({
                    'text-anchor': 'middle',
                    'font-size': '1.5em',
                    fill: 'black',
                });
    



        //Escala para tamaño de burbuja
        var ejez = d3.scaleLinear()
            .domain([0, 100])
            .range([5, 20000]);


        //Escala para color de burbuja
        var colorContinente = d3.scaleOrdinal()
            .domain(continentes)
            .range(d3.schemeCategory20);


        //Se configura cada burbuja
        var node = svg.selectAll(".node")
            .data(data)
            .enter()
            .filter(function (d) {
                return !d.children
            })
            .append("g")
            .attr("class", "node")


        // Se agrega cada burbuja con el tamaño y color
        node.append("circle")
            .attr("class", "bubbles")
            .attr("cx", function (d) { return xAxis(d.life_expectancy); })
            .attr("cy", function (d) { return yAxis(d.handwashing_facilities); })
            .attr("r", function (d) { return ejez(d.total_deaths_devided_by_total_cases); })
            .style("fill", function (d) { return colorContinente(d.continent); })
            // Cuando pasa el mouse por encima, se ejecuta la función mouseover
            .on('mouseover', mouseover)
            // Cuando el mouse se mueve, se ejecuta la función mousemove
            .on('mousemove', mousemove)
            // Cuando el mouse se va de la visualización, se ejecuta la función mouseout
            .on('mouseout', mouseout);


        // Funciones de Tooltips
        var div = d3.select('#container').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        function mouseover() {
            // Se muestra el box de la información
            div.style('display', 'inline');
        }
        function mousemove() {
            // Se mueve el box de la información con la información dentro
            var d = d3.select(this).data()[0]
            div
                .html("Country : " + d.location + '<hr/>' +
                    "Continent: " + d.continent + '<hr/>' +
                    "Total Cases: " + d.total_cases + '<hr/>' +
                    "Total Deaths: " + d.total_deaths + '<hr/>' +
                    "Total Deaths devided by total cases:  " + d.total_deaths_devided_by_total_cases + '<hr/>' +
                    "Handwashing Facilities index: " + d.handwashing_facilities + '<hr/>' +
                    "Life Expectancy: " + d.life_expectancy + '<hr/>')
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 20) + 'px');
        }
        function mouseout() {
            // Se desaparece el box de la información

            div.style('display', 'none');
        }

    })

});