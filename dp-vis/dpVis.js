function next() {
    if (iterator == null) {
        iterator = iterate();
        iterator.next();
    }
    iterator.next();
}

function reset() {
    iterator = iterate();
    iterator.next();
}

function parse(string) {
    var result = [];
    string = string.split("\n");
    for (e of string) {
        result.push(e.split(" ").map(i => parseInt(i)));
    }
    return result
}

function* iterate() {
    resetMeals();
    resetChopsticks();
    let t = 0;
    let mealsEaten = new Array(numOfPhilo).fill(0);
    let state = new Array(numOfPhilo).fill(0);
    d3.select("#timer").text(`Current Time: ${t} / ${input.length}`);
    document.getElementById("logList").innerHTML = "";
    yield;
    while (t < input.length) {
        let toRelease = [];
        let toAcquire = [];
        let counter = input[t][numOfPhilo-1];
        let violation = false;
        let overEat = false;


        // To check whether two philospher eating next to each other
        for (let i of input[t]) {
            if (i) {
                console.log(i);
                counter++;
                if (counter >= 2) {
                    violation = true;
                    alert("Violation detected!")
                    break;
                }
            } else
                counter = 0;
        }



        for (let i = 0; i < numOfPhilo; i++) {
            if (state[i] == 2) {
                if (input[t][i]) overEat = true;
                continue;
            }
            if (input[t][i] == 1) {
                if (state[i] == 1) continue;
                else {
                    toAcquire.push(i);
                    state[i] = 1;
                }
            } else if (state[i] == 1) {
                eatMeal(i, mealsEaten[i]++);
                if (mealsEaten[i] == numOfMeals) {
                    state[i] = 2;
                    done(i);
                } else {
                    state[i] = 0;
                    toRelease.push(i);
                }
            } else {
                becomeHungry(i);
            }
        }

        toRelease.forEach((i, d) => {
            startThinking(i)
        });
        toAcquire.forEach((i, d) => {
            startEating(i)
        })
        console.log(input[t]);


        d3.select("#logList").append("li").lower()
          .attr("class", violation ? "list-group-item list-group-item-danger" : (overEat ? "list-group-item list-group-item-warning" : "list-group-item"))
          .node().innerHTML = `<strong>Time = ${t+1}:</strong> ${input[t++]}`;
        
        d3.select("#timer").text(`Current Time: ${t} / ${input.length}`);
        yield;
    }
}


function done(philoNum) {
    releaseChopsticks(philoNum);
    d3.select(`#think${philoNum}`)
        .style("visibility", `hidden`)
    d3.select(`#food${philoNum}`)
        .style("visibility", `hidden`)
    d3.select(`#hungry${philoNum}`)
        .style("visibility", `hidden`)
}


function becomeHungry(philoNum) {
    d3.select(`#think${philoNum}`)
        .style("visibility", `hidden`)
    d3.select(`#food${philoNum}`)
        .style("visibility", `hidden`)
    d3.select(`#hungry${philoNum}`)
        .style("visibility", `visible`)
}

function startThinking(philoNum) {
    releaseChopsticks(philoNum);
    d3.select(`#think${philoNum}`)
        .style("visibility", `visible`)
    d3.select(`#food${philoNum}`)
        .style("visibility", `hidden`)
    d3.select(`#hungry${philoNum}`)
        .style("visibility", `hidden`)
}

function startEating(philoNum) {
    acquireChopsticks(philoNum);
    d3.select(`#think${philoNum}`)
        .style("visibility", `hidden`)
    d3.select(`#food${philoNum}`)
        .style("visibility", `visible`)
    d3.select(`#hungry${philoNum}`)
        .style("visibility", `hidden`)
}

function acquireChopsticks(philoNum) {
    var right = philoNum;
    var left = (philoNum + numOfPhilo - 1) % numOfPhilo;
    var rotationAngle = 180 / numOfPhilo - 1;

    d3.select(`#cg${right}`).transition().duration(750).ease(d3.easeExp)
        .attr("transform", `rotate(${rotationAngle} ${tableCX} ${tableCY})`)

    d3.select(`#cg${left}`).transition().duration(750).ease(d3.easeExp)
        .attr("transform", `rotate(${-rotationAngle} ${tableCX} ${tableCY})`)

}

function releaseChopsticks(philoNum) {
    var right = philoNum;
    var left = (philoNum + numOfPhilo - 1) % numOfPhilo;

    d3.select(`#cg${right}`).transition().duration(750).ease(d3.easeExp)
        .attr("transform", `rotate(${0} ${tableCX} ${tableCY})`)

    d3.select(`#cg${left}`).transition().duration(750).ease(d3.easeExp)
        .attr("transform", `rotate(${0} ${tableCX} ${tableCY})`)
}

function eatMeal(philoNum, mealNum) {
    d3.select(`#p${philoNum}m${mealNum}.meal`)
        .attr("fill", "green")
}

function resetMeals() {
    d3.selectAll(`.meal`)
        .attr("fill", "transparent")
}

function resetChopsticks() {
    for (let i = 0; i < numOfPhilo; i++) {
        startThinking(i);
    }
}

function* philoGen(N) {
    let i = 0;
    while (i < N) {
        yield {
            value: philosophersList[i],
            color: colorList[i++]
        }
    }
}


var input = prompt("What is your output trace?");
var numOfMeals = parseInt(prompt("How many meals?"));
input = parse(input);
var numOfPhilo = input[0].length;

const mealsPerRow = 5;

const philosophersList = ['Thomas Aquinas', 'Aristotle', 'Confucius', 'René Descartes', 'Ralph Waldo Emerson',
    'Michel Foucault', 'David Hume', 'Immanuel Kant', 'Søren Kierkegaard', 'Lao-Tzu', 'John Locke',
    'Niccolo Machiavelli', 'Karl Marx', 'John Stuart Mill', 'Friedrich Nietzsche', 'Plato',
    'Jean-Jacques Rousseau', 'Jean-Paul Sartre', 'Socrates', 'Ludwig Wittgenstein'
]

const colorList = ['mediumaquamarine', 'lightslategray', 'lightgray', 'peru',
    'darkorange', 'darkmagenta', 'lightsteelblue', 'salmon', 'limegreen', 'thistle',
    'mediumturquoise', 'khaki', 'darkseagreen', 'lawngreen', 'mediumorchid', 'lightpink',
    'mediumspringgreen', 'green', 'linen', 'honeydew', 'silver', 'hotpink', 'ivory',
    'orangered', 'magenta', 'indianred', 'sandybrown', 'seashell', 'olive', 'peachpuff',
    'lightskyblue', 'greenyellow', 'forestgreen', 'mediumpurple', 'lightsalmon', 'slategray',
    'seagreen', 'pink', 'purple', 'ghostwhite', 'lightblue', 'lightgreen', 'lightcoral',
    'maroo 0n', 'navajowhite', 'red(Safe', 'springgreen', 'royalblue', 'slateblue',
    'powderblue', 'deeppink', 'moccasin', 'darkslategrey', 'gold', 'mintcream', 'darkred',
    'darkslategray', 'mediumslateblue', 'tomato', 'snow', 'lightyellow', 'mistyrose', 'goldenrod',
    'steelblue', 'lightseagreen', 'paleturquoise', 'lavenderblush', 'darkgrey', 'lightgrey',
    'fuchsia', 'orchid', 'palegoldenrod', 'lightslategrey', 'lightgoldenrodyellow', 'floralwhite',
    'slategrey', 'darkviolet', 'dodgerblue', 'indigo', 'sienna', 'tan', 'lemonchiffon', 'lightcyan',
    'lavender', 'darkorchid', '16=fuchsia', 'lime(Safe', 'palevioletred', 'darkturquoise', 'teal',
    'darkslateblue', 'palegreen', 'darkolivegreen', 'dimgrey', 'deepskyblue', 'grey', 'firebrick',
    'darksalmon', 'oldlace', 'gainsboro', 'skyblue', 'olivedrab', 'darkkhaki', 'navy', 'midnightblue',
    'dimgray', 'darkgreen', 'orange', 'rosybrown', 'mediumseagreen', 'mediumblue', 'plum', 'papayawhip', 'mediumvioletred'
];


var philosophers = Array.from(philoGen(numOfPhilo));
var chopsticks = [...Array(numOfPhilo).keys()];
var chairRadius = 16;
var tableBoundary = 128;
var iterator;

var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    widthMax = 4 * tableBoundary,
    heightMax = 4 * tableBoundary,
    width = widthMax - margin.left - margin.right,
    height = heightMax - margin.top - margin.bottom;

var mealRadius = 4;

var tableRadius = tableBoundary - chairRadius;
var tableCX = widthMax / 2;
var tableCY = heightMax / 2;


(async () => {
    var svg = d3.select(".svgContainer").append("svg")
        .attr("width", widthMax)
        .attr("height", heightMax)
        .append("g");


    var oneChairEnter = svg.selectAll("circle").data(philosophers).enter();

    // Appending the philosophers
    oneChairEnter.append("circle")
        .attr("class", "philosopher")
        .attr("id", (d, i) => `philo${i}`)
        .attr("cy", function (d, i) {
            return (tableCY + (tableBoundary + chairRadius) * (Math.cos(i * 2 * (Math.PI /
                numOfPhilo))))
        })
        .attr("cx", function (d, i) {
            return (tableCX + (tableBoundary + chairRadius) * (Math.sin(i * 2 * (Math.PI /
                numOfPhilo))));
        })
        .attr("r", chairRadius)
        .attr("fill", function (d) {
            return (d.color);
        })
        .attr("fill-opacity", 0.65)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .on("mouseover", function () {
            d3.select(this).style("stroke", "deeppink").attr("stroke-width", "3").attr("fill-opacity", 1);
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "black").attr("stroke-width", "1").attr("fill-opacity", 0.65);
        })
        .append("title")
        .text((d, i) => {
            return `Philosopher #${i}: ${d.value}`
        });


    // Appending the philosopher index
    oneChairEnter.append("text")
        .attr("dx", function (d, i) {
            return (-20 + tableCX + chairRadius + (tableBoundary + chairRadius) * (Math.sin(i * 2 * (Math.PI / numOfPhilo))));
        })
        .attr("dy", function (d, i) {
            return (5 + tableCY + (tableBoundary + chairRadius) * (Math.cos(i * 2 * (Math.PI / numOfPhilo))))
        })
        .text(function (d, i) {
            return (i);
        });

    // Appending the table circle
    svg.append("circle")
        .attr("cy", tableCY)
        .attr("cx", tableCX)
        .attr("r", tableRadius)
        .attr("fill", "linen")
        .attr("stroke", "black")
        .attr("stroke-width", "2");

    // Appending the frame
    svg.append("rect")
        .attr("fill", "none")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "black")
        .attr("stroke-width", "1");
    // Appending the hotpot
    let a = await d3.svg("hotpot.svg").then(function (data) {
        svg.append(function () {
                return data.documentElement.getElementById("hotpot")
            })
            .attr("transform", "rotate(180) translate(-305 -250) scale(0.01)")
    });

    // Appending the chopstick
    let b = await d3.svg("chopstick.svg").then(function (data) {
        var chopstick = data.documentElement.getElementsByClassName("chopstick")[0];
        var groups = svg.selectAll("g.chopstickGroup").data(chopsticks).enter()
            .append("g")
            .attr("class", "chopstickGroup")
            .attr("id", (d, i) => `cg${i}`);

        groups.append(function () {
                return chopstick.cloneNode(true)
            })
            .attr("transform", (d, i) => `translate(${tableCX + (tableBoundary + 7) * (Math.sin((i+0.5) * 2 * (Math.PI /
                                        numOfPhilo)))}, ${tableCY + (tableBoundary + 7) * (Math.cos((i+0.5) * 2 * (Math.PI /
                                        numOfPhilo)))}) rotate(${-3 - (180/numOfPhilo) - i*360/numOfPhilo}) scale(0.3)`)
            .attr("id", (d, i) => `chop${i}`)
            .on("mouseover", function () {
                d3.select(this).style("stroke-width", 10);
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke-width", 1);
            })
            .append("title")
            .text((d, i) => {
                return `chopstick #${i}`
            });
    });

    // Appending the thinkcloud
    let c = await d3.svg("think.svg").then(function (data) {
        var thinkcloud = data.documentElement.getElementsByClassName("think")[0];
        for (i = 0; i < numOfPhilo; i++) {
            svg.append(function () {
                    return thinkcloud.cloneNode(true);
                })
                .attr("id", `think${i}`)
                .attr("transform", `translate(${tableCX + (tableBoundary + chairRadius) * (Math.sin(i * 2 * (Math.PI /
                        numOfPhilo)))} ${-40 + tableCY + (tableBoundary + chairRadius) * (Math.cos(i * 2 * (Math.PI /
                        numOfPhilo)))}) rotate(0) scale(0.03)`)
                .style("visibility", "visible")
        }
    })

    // Appending the foodcloud
    let d = await d3.svg("hungry.svg").then(function (data) {
        var foodcloud = data.documentElement.getElementsByClassName("hungry")[0];
        for (i = 0; i < numOfPhilo; i++) {
            svg.append(function () {
                    return foodcloud.cloneNode(true);
                })
                .attr("id", `hungry${i}`)
                .attr("transform", `translate(${tableCX + (tableBoundary + chairRadius) * (Math.sin(i * 2 * (Math.PI /
                        numOfPhilo)))} ${-45 + tableCY + (tableBoundary + chairRadius) * (Math.cos(i * 2 * (Math.PI /
                        numOfPhilo)))}) rotate(0) scale(0.035)`)
                .style("visibility", "hidden")
        }
    })

    // Appending the food
    let e = await d3.svg("food.svg").then(function (data) {
        var food = data.documentElement.getElementsByClassName("food")[0];
        for (i = 0; i < numOfPhilo; i++) {
            svg.append(function () {
                    return food.cloneNode(true);
                })
                .attr("id", `food${i}`)
                .attr("transform", `translate(${10+tableCX + (tableBoundary-40) * (Math.sin(i * 2 * (Math.PI /
                        numOfPhilo)))} ${tableCY + (tableBoundary-30) * (Math.cos(i * 2 * (Math.PI /
                        numOfPhilo)))})  scale(-0.0025)`)
                .style("visibility", "hidden")
        }
    })

    // Appending the meals to eat
    var meals = oneChairEnter.append("g")
        .attr("class", "meals")
        .attr("id", (d, i) => `meals${i}`);

    // Appending timer 
    var timeNow = svg.append("text")
        .attr("id", "timer")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height)
        .text(`Current Time: 0 / ${input.length}`)


    for (let j = 0; j < numOfMeals; j++) {
        let totalAngle = Math.PI * (15 / 360);
        let unitAngle = totalAngle / (mealsPerRow);
        meals.append("circle")
            .attr("class", "meal")
            .attr("id", function (d, i) {
                return `p${i}m${j}`
            })
            .attr("r", mealRadius)
            .attr("cx", function (d, i) {
                let rad = 60 + (mealRadius + 2) * 2 * Math.floor(j / mealsPerRow);
                return (tableCX + (tableBoundary + chairRadius + rad) * (Math.sin(2 * ((j % mealsPerRow) * unitAngle - (totalAngle / 2) + i * (Math.PI /
                    numOfPhilo)))));
            })
            .attr("cy", function (d, i) {
                let rad = 60 + (mealRadius + 2) * 2 * Math.floor(j / mealsPerRow);
                return (tableCY + (tableBoundary + chairRadius + rad) * (Math.cos(2 * ((j % mealsPerRow) * unitAngle - (totalAngle / 2) + i * (Math.PI /
                    numOfPhilo)))))
            })
            .attr("stroke", d => d.color)
            .attr("stroke-width", "2")
            .attr("fill", "transparent")
            .attr("fill-opacity", 0.8)
    }



})();


var nextButton = d3.select(".buttons").append("button")
    .attr("type", "button")
    .attr("onclick", "next()")
    .text("Next")

var resetButton = d3.select(".buttons").append("button")
    .attr("type", "button")
    .attr("onclick", "iterator = iterate();iterator.next();")
    .text("Reset")