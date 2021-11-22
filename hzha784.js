const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
    "January", "February", "March", "April", "May"];


function start() {
    const url = "https://api.thevirustracker.com/free-api?countryTimeline=NZ";
    fetch(url).then(r => r.json()).then(d => {
        //last date
        //alert(d);
        const arr = Object.entries(d.timelineitems[0]);
        
        const total_cases = arr[arr.length - 2][1].total_cases
        const total_deaths = arr[arr.length - 2][1].total_deaths
        const total_recoveries = arr[arr.length - 2][1].total_recoveries
        

        // pie.style.strokeDasharray = result;
        let info = {
            "total_cases": total_cases,
            "total_deaths": total_deaths,
            "total_recoveries": total_recoveries,
            "active_cases": total_cases - total_deaths - total_recoveries
        }
        //get last five entries:
        let scrolling =""

        for(let i = arr.length-2;i>arr.length-9;i--){
            scrolling += "<p>"+arr[i][0] +"</p> - "+strip("new_daily_cases")+" : "+arr[i][1].new_daily_cases+" "
            +strip("new_daily_deaths")+" : "+arr[i][1].new_daily_deaths+" "
            +strip("total_cases")+" : "+arr[i][1].total_cases+" "
            +strip("total_deaths")+" : "+arr[i][1]. total_deaths+" "
            +strip("total_recoveries")+" : "+arr[i][1].total_recoveries+" "
            +" "

        }
        document.getElementById("mq").innerHTML=scrolling



        document.getElementById("pie").style.strokeDasharray = ratio(info["active_cases"], total_cases) + " " + 628
        //setup

        document.getElementById("desc").innerHTML = "<p>Active Cases : " + info["active_cases"] + "</p>";
        document.getElementById("title").innerHTML = "Active Cases : " + info["active_cases"]

        //get months x-axis
        let xLabel = document.getElementsByClassName("x-labels")[0].firstChild.nextSibling
        let firstM = arr[arr.length - 2][0].split("/")[0] - 5

        for (let i = 0; i < 5; i++) {
       

            xLabel.innerHTML = months[firstM++]
            xLabel = xLabel.nextSibling.nextSibling

        }
        //get y-axis
        // no valid info for Total Recoverery show text in middle
        const date = (firstM - 4) + "/01/20"
        
        const firstEntry = d.timelineitems[0][date]
        const F_total_cases = firstEntry.total_cases
        const F_total_deaths = firstEntry.total_deaths
        const F_total_recoveries = firstEntry.total_recoveries

        let infoFirst = {
            "total_cases": F_total_cases,
            "total_deaths": F_total_deaths,
            "total_recoveries": F_total_recoveries,
            "active_cases": F_total_cases - F_total_deaths - F_total_recoveries
        }
  
       



        setActive(info, infoFirst, date, arr);



        /*
                new_daily_cases: 0
                new_daily_deaths: 0
                total_cases: 1
                total_deaths: 0
                total_recoveries: 0
        
                TBC:
                exclude last entry
        */

    })

}

function setActive(info, first, date, arr) {

    let btns = document.getElementById("buttons").getElementsByClassName("b");

    let deathPercent=info.total_deaths-first.total_deaths
    let RecoveredPercent=info.total_recoveries-first.total_recoveries
    let totalPercent=info.total_cases-first.total_cases
    
    let start = 0;
    let deathLine=[]
    let activeLine=[]
    let totalLine =[]
    let recoveredLine=[]
    
    for(let i = 0 ;i<arr.length;i++){
        if(arr[i][0]==date){
            start = i
            break;
        }
    }
    let x = 0;
    let  y = 0;
    let total = arr.length-1
    let casesPercent=(total-start)
    for(let i = start ;i<arr.length-1;i++){
        x= (1-(Math.abs(i-total))/casesPercent)*615+90

        y= (info.total_deaths-arr[i][1].total_deaths)/deathPercent*366+5
        deathLine.push(x,y)
        y= (info.total_cases-arr[i][1].total_cases)/totalPercent*366+5
        totalLine.push(x,y)
       
        y=(info.total_cases-(arr[i][1].total_cases - arr[i][1].total_deaths - arr[i][1].total_recoveries))/info.total_cases*366+5
        activeLine.push(x,y)
        y=(info.total_recoveries-arr[i][1].total_recoveries)/RecoveredPercent*366+5
        recoveredLine.push(x,y)
   
    
    }
  
 
   

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener("click", function () {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
            //////// pie chart
            let section = document.getElementsByClassName("active")[0].id;//return string

            let pie = document.getElementById("pie")
            let top = info[section]//return value for given string
          
            //TBD add different colour
            // set description under the pie chart
            pie.style.strokeDasharray = ratio(top, info.total_cases) + " " + 628
            let sectionFormatted = section.split("_").join(" ")
            document.getElementById("desc").innerHTML = "<p>" + sectionFormatted + " : " + top + "</p>"
            document.getElementById("title").innerHTML = sectionFormatted + " : " + top;
            ///// //////// pie chart ends
            ///// //////// pie chart ends


            //get y-axis
            // no valid info for Total Recoverery show text in middle
            
            if (section != "total_recoveries"&& section !="active_cases") {
                let bottom = first[section]
              
                let cases = Math.ceil((top - bottom) / 4);
                
                let yLabel = document.getElementsByClassName("y-labels")[0].firstChild.nextSibling
                let firstC = top

                for (let i = 0; i < 4; i++) {
                   
                  
                    yLabel.innerHTML = firstC
                    firstC-=cases
                    yLabel = yLabel.nextSibling.nextSibling

                }
                //Line chart content
    



                if(section=="total_deaths"){


                document.getElementById("line").innerHTML='<polyline fill="none" stroke="black" stroke-width="2" points='
                +deathLine.toString()+'>';


                }else if (section == "total_cases"){

                document.getElementById("line").innerHTML='<polyline fill="none" stroke="rgb(255, 205, 1)" stroke-width="2" points='
                +totalLine.toString()+'>';


                }



            } else if(section =="active_cases"){

              
                let cases = Math.ceil(info.total_cases/3);
                
                let yLabel = document.getElementsByClassName("y-labels")[0].firstChild.nextSibling
                let firstC = info.total_cases

                for (let i = 0; i < 4; i++) {
                    if(firstC<0){
                        firstC = 0;
                        
                    }
                  
                    yLabel.innerHTML = firstC

                    firstC-=cases
                    yLabel = yLabel.nextSibling.nextSibling

                }
                document.getElementById("line").innerHTML='<polyline fill="none" stroke="red" stroke-width="2" points='
                +activeLine.toString()+'>';


            }
            else {
                let bottom = first[section]
              
                let cases = Math.ceil((top - bottom) / 3);
                
                let yLabel = document.getElementsByClassName("y-labels")[0].firstChild.nextSibling
                let firstC = top

                for (let i = 0; i < 4; i++) {
                   
                    if(firstC<0){
                        firstC = 0;
                        
                    }
                   
              
                    yLabel.innerHTML = firstC
                    firstC-=cases
               
                    yLabel = yLabel.nextSibling.nextSibling

                }

                document.getElementById("line").innerHTML='<polyline fill="none" stroke="green" stroke-width="2" points='
                +recoveredLine.toString()+'>';
                
            }

        });

    }
    document.getElementById("active_cases").click();

}

function ratio(top, bottom) {
    // calculate % for pie chart
    return Math.ceil(top / bottom * 628)

}


function blink() {
    let div = document.getElementById("banner");
    if (div.style.backgroundColor == "rgb(255, 204, 0)") {
        div.style.backgroundColor = "white";
    } else {
        div.style.backgroundColor = "rgb(255, 204, 0)";
    }


}
function strip(str){
    return str.split("_").join(" ")

}
window.onload = start;
window.setInterval(blink, 700)
