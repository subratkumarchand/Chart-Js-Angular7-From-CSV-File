import { Component,OnInit } from '@angular/core';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  LineChart=[];
  year = [];
  ngOnInit(){ }

    lineChat() {
        // for lebels all year removing dupliate
        let uniqueYear = this.year.filter((elem, index, self) => {
            return index === self.indexOf(elem);
        })
        // year Ascending 
        uniqueYear.sort();
        // line chart data array object list collect from handleFileInput()
        const data = this.LineChart;
        // Line chart:
        this.LineChart = new Chart('lineChart', {
            type: 'line',
            data: {
                labels: uniqueYear,
                datasets: data,
            },
            options: {
                title: {
                    text: "Line Chart",
                    display: true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
    }

    handleFileInput(files) {
        let file = files[0];
        const regex = new RegExp("(.*?)\.(csv)$");
        // file validation 
        if (regex.test(file.name)) {
            let reader = new FileReader();
            let self = this;
            reader.onload = function (e) {
                if (reader.result) {
                    let data = [];
                    let yyyy = [];
                    const color = ['blue', 'purple', 'red', 'green', 'pink', 'yellow'];
                    let contents = reader.result;
                    // all data converting to array using line break from string 
                    let lines = (<string>contents).split("\n");
                    // remove last empty item in array 
                    lines.pop();
                    // series loop 
                    for (let i = 0; i < lines.length; i++) {
                        // line chart data object
                        let output = {
                            label: "",
                            data: [],
                            fill: false,
                            lineTension: 0.2,
                            borderColor: "",
                            backgroundColor: "",
                            borderWidth: 2
                        }
                        let yearScore = lines[i].split(",");
                        const name = yearScore[0];
                        output.label = name;
                        output.borderColor = color[i];
                        output.backgroundColor = color[i];
                        yearScore.shift();
                        // year and score collection loop in series loop 
                        for (let j = 0; j < yearScore.length; j++) {
                            let items = yearScore[j];
                            let item = (<string>items).split("|");
                            let score = item[1];
                            let year = item[0];
                            // avoid duplicate year 
                            let duplicateYear = output.data.filter(el => el.x == year);
                            if (duplicateYear.length == 0) {
                                // pushing  x & y object into data array  
                                output.data.push({ x: year, y: parseInt(score) })
                                // taking all year in one array
                                yyyy.push(year)
                            }
                        }
                        // Ascending: first year less than the previous
                        output.data = output.data.sort(function (obj1, obj2) {
                            return obj1.x - obj2.x;
                        });
                        data.push(output);
                    }
                    // assign to class property 
                    self.year = yyyy;
                    self.LineChart = data;
                }
            }
            reader.readAsText(file);
        } else {
            alert("File not supported!")
        }
    }
 


}
