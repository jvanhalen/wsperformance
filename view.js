$(function () {

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The download speed gauge
    $('#container-download').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 1000,
            title: {
                text: 'Download speed'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'download',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">MB/s</span></div>'
            },
            tooltip: {
                valueSuffix: ' MB/s'
            }
        }]

    }));

    // The upload speed gauge
    $('#container-upload').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 1000,
            title: {
                text: 'Upload speed'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'upload',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">MB/s</span></div>'
            },
            tooltip: {
                valueSuffix: ' MB/s'
            }
        }]

    }));

    // The latency gauge
    $('#container-latency').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 1000,
            title: {
                text: 'latency'
            }
        },

        series: [{
            name: 'latency',
            data: [10],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">* milliseconds</span></div>'
            },
            tooltip: {
                valueSuffix: ' latency in ms'
            }
        }]

    }));

    // Bring life to the dials
    setInterval(function () {
        // Latency

        var chart = $('#container-latency').highcharts(),
            point,
            newVal,
            inc;

        if (chart) {
            point = chart.series[0].points[0];
            point.update(Math.round(websocket.lat));
        }

        // Download speed
        chart = $('#container-download').highcharts();
        if (chart) {
            point = chart.series[0].points[0];
            point.update(Math.round(websocket.downstream));
        }

        // Upload speed
        chart = $('#container-upload').highcharts();
        if (chart) {
            point = chart.series[0].points[0];
            point.update(Math.round(websocket.upstream));
        }
    }, 500);
});