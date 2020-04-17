var loggingInterval = 5;
window.onload = function() {
    /*loggerHeader();*/
    if (!navigator.onLine) {
        document.getElementById("warning").style.display = "block";
        document.getElementById("myCanvas").style.display = "none";
        document.getElementById("tableInfo").style.display = "none";
    } else if(navigator.onLine){
        updateLoggerSelection();
        getLoggerRecordsCount();
        document.getElementById("eraseLoggerData").onclick = function() {
            eraseLoggerData();
        };
        document.getElementById("loggerInterval").onclick = function() {
            setLoggerInterval();
        };
    }
};
function getLoggerRecordsCount() {
    /*var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("loading").style.display = "none";
            getDATA(this.responseText);
        } else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("loading").style.display = "block";
        }
    };
    xhr.open("GET", "logger_record_count", true);
    xhr.send();*/
    getDATA(500);
}
function loggerHeader() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("loading").style.display = "none";
            var str = this.responseText.split(",");
            document.getElementById('tempScaleReq').value = str[0];
            document.getElementById('logger_level').innerHTML = (Math.round(str[1] * 100) / 100) + "%";
            document.getElementById('logger_remain').innerHTML = str[2];
            document.getElementById('loggerVal').value = str[3];
            document.getElementById("fw_ver").innerHTML = str[4];
            document.getElementById("build_date").innerHTML = str[5];
            document.getElementById("fw_date").innerHTML = str[6];
            document.getElementById("localtime").innerHTML = str[7];
            loggingInterval = str[3];
            updateLoggerSelection();
        } else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("loading").style.display = "block";
        }
    };
    xhr.open("GET", "logger_data_header", true);
    xhr.send();
};
setInterval(loggerHeader, 1000 * 60);
setInterval(getLoggerRecordsCount, 1000 * 60 * loggingInterval);
function updateLoggerSelection() {
    var selIndex;
    var val = parseInt(document.getElementById("loggerVal").value);
    switch (val) {
        case 1:
            selIndex = 0;
            break;
        case 5:
            selIndex = 1;
            break;
        case 10:
            selIndex = 2;
            break;
        case 15:
            selIndex = 3;
            break;
        case 20:
            selIndex = 4;
            break;
        case 25:
            selIndex = 5;
            break;
        case 30:
            selIndex = 6;
            break;
        case 35:
            selIndex = 7;
            break;
        case 40:
            selIndex = 8;
            break;
        case 45:
            selIndex = 9;
            break;
        case 50:
            selIndex = 10;
            break;
        case 55:
            selIndex = 11;
            break;
        case 60:
            selIndex = 12;
            break;
        default:
            selIndex = 2;
            break;
    }
    document.getElementById("interval").options[selIndex].selected = true;
}
function updatePlot() {
    drawPlot(document.getElementById("myplot"));
}
function getDATA(count) {
    dStamp = [];
    dTemp = [];
    dHum = [];
    dCu = [];
    dAg = [];
    dPress = [];
    noOfRecord;
    for (i = 0; i < count; i++) {
       /*var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("result").innerHTML = "Reading "+ count;
                document.getElementById("loading").style.display = "none";
                var response = this.responseText;
                if(response != "BADDATA"){
                    var response = response.split(",");*/
                    var test = "20-09-2019 11:11:59, 23,1.2, 40,200,200";
                    var response = test.split(",");
                    dStamp.push([response[0]]);
                    dTemp.push([noOfRecord, response[1] / 10]);
                    dPress.push([noOfRecord, response[2] / 10000]);
                    dHum.push([noOfRecord, response[3]]);
                    dCu.push([noOfRecord, response[4]]);
                    dAg.push([noOfRecord, response[5]]);
                    noOfRecord++;
               /* }
               
            } else if (this.readyState == 4 && this.status != 200) {
                document.getElementById("loading").style.display = "block";
                document.getElementById("result").innerHTML = "Error In Reading Data.";
            }
        };
        xhr.open("GET", "logger_data", false);
        xhr.send();*/
    }
    document.getElementById("result").innerHTML = "Read " + noOfRecord + " records";
    updatePlot();
}
function setLoggerInterval() {
    var logger = document.getElementById("interval").value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("loading").style.display = "none";
            loggerHeader();
        } else if (this.readyState == 4 && this.status != 200) {
            document.getElementById("loading").style.display = "block";
        }
    };
    var data = "$$data=" + logger + '\u0000';
    console.log(data);
    xhr.open("POST", "setLoggerInterval", true);
    xhr.send(data);
}
function drawPlot(container) {
    var qVal, qValParts, graph, i, presAx = 1,
        tempScale;
    try {
        var temperature = document.getElementById('tempScaleReq').value;
        if (temperature == '0' || temperature == 0) {
            tempScale = ' (&deg;C)';
        }
        if (temperature == '1' || temperature == 1) {
            tempScale = ' (&deg;F)';
        }
        graph = Flotr.draw(container, [{
            data: dTemp,
            label: 'Temp' + tempScale,
            color: '#d60000',
            yaxis: 1
        }, {
            data: dHum,
            label: 'Humidity',
            color: '#0000FF',
            yaxis: 1
        }, {
            data: dCu,
            label: 'Copper (Cumulative)',
            color: '#ddad05',
            yaxis: 2
        }, {
            data: dAg,
            label: 'Silver (Cumulative)',
            color: '#AAAAAA',
            yaxis: 2
        }, {
            data: dPress,
            label: 'Pressure',
            color: '#008000',
            yaxis: presAx
        }], {
            xaxis: {
                noTicks: 5,
                showLabels: true,
                fontSize: 4,
                tickFormatter: function(x) {
                    var y = parseInt(x);
                    var temp = dStamp[y][0].replace(" ", "<br>");
                    console.log(temp);
                    return temp;
                }
            },
            yaxis: {
                noTicks: 5,
                min: 0,
                max: maxTemp
            },
            y2axis: {
                ticks: [
                    0, 1000, 2000, 3000, 4000
                ],
                min: 0,
                max: 4400
            },
            legend: {
                position: 'nw',
                noColumns: 5
            },
            spreadsheet: {
                show: true,
                tabGraphLabel: 'Graph',
                tabDataLabel: 'Table',
                tickFormatter: function(x) {
                    return dStamp[x];
                }
            },
            mouse: {
                track: true,
                margin: 5,
                relative: true,
                position: 'n',
                lineColor: '#0A7414',
                fillColor: null,
                fillOpacity: 0.8,
                radius: 4,
                sensibility: 3,
                trackDecimals: 1,
                trackFormatter: function(obj) {
                    return obj.series.label + ': ' + obj.y + ',  ' + dStamp[obj.index];
                }
            },
            crosshair: {
                mode: null,
                color: '#0A7414'
            },
            shadowSize: 3
        });
    } catch (err) {
        updatePlot();
    }
}
