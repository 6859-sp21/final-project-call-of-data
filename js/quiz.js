//  IMPLEMENT FIXED-CHOICE TEST STRUCTURE
// Code adapted from: https://codeactually.com/examples.html


document.getElementById("form1").onsubmit=function() {

   //displays the response DOM element
   document.getElementById("response").style.display = "block";
   document.getElementById("response2").style.display = "block";

   //resets the DOM element on submit
   document.getElementById("answer").innerHTML = "";
   document.getElementById("answer2").innerHTML = "";


    //Retrieves the value of the user selected choice for each question:
    param = document.querySelector('#form1 input[name = "Parameter"]:checked').value;
    time = document.querySelector('#form1 input[name = "Time"]:checked').value;
    group = document.querySelector('#form1 input[name = "Group"]:checked').value;
    manip1 = document.querySelector('#form1 input[name = "Manip1"]:checked').value;
    manip2 = document.querySelector('#form1 input[name="Manip2"]:checked').value;

     // initialize score variables
     science = 0;
     oil = 0;
     tech = 0;

     // function to calculate score for each question
     // We'll have to make one of these functions for each of the questions, to vary both weight and assign a character based on the selection
     function score1(x){
       if(x == "CO2") {
         science = science + 1;
         oil = oil + 1;
         tech  = tech +1
     }

       if(x == "Primary_Energy_Consumption") {
         science = science + 1;
         oil = oil + 1;
         tech  = tech +1
       }
     }

     function score2(x){
       if(x == "1965") {
         science = science + 1
       }
       if(x == "1990") {
         tech = tech + 1
         oil = oil + 1
       }
     }

     function score3(x){
       if(x == "1") {
         oil = oil + 1
       }
       if(x == "3") {
         science = science + 1
         tech = tech + 1
         oil = oil + 1
       }
       if{x == "4"} {
         tech = tech + 1
       }
       if{x = "5"} {
         science = science + 1
       }
     }

     function score4(x){
       if{x == "Growth"}{
         if{eval("time") == "1990"} {
           if{eval("param") == "CO2"} {
             oil = oil + 1
             tech = tech + 1
           }
           if{eval("param") == "Primary_Energy_Consumption"} {
             science = science + 1
             tech = tech + 1
           }
         if{eval("time") == "1965"} {
           science = science + 1
         }
       }
       if{x == "Absolute"} {
          tech = tech + 1
          oil = oil + 2
          science = science + 1
       }
     }

     function score5(x){
       if {x == "NoneD"} {
         science = science + 1
         if {eval("manip1") == "Growth"} {
         science = science + 2
          }
       }
       if {x == "Population"} {
         if{eval("manip1") == "Absolute"} {
           tech = tech + 2
         }
         oil = oil + 1
       }
      if {x == "GDP"} {
         if{eval("manip1") == "Absolute"} {
           oil = oil + 3
         }
        science = science + 2
      }
     }

     // for the above function, you could also change the 1 to a variable so you could give more points for certain questions

     //call function for each question
     // the value inside the function is the name of the question
     score1(eval("param"));
     score2(eval("time"));
     score3(eval("group"));
     score4(eval("manip1"));
     score5(eval("manip2"));

     all = [science, oil, tech];

   //get the max score  in the array
   maxscore = Math.max.apply(Math,all);

   // object holding scores and associated text for that character
   scores = [{index:0, feedback: "HONEST SCIENTIST"},
             {index:1, feedback: "OIL TYCOON"},
             {index:2, feedback: "TECH ENTHUSIAST"}];

   scorez = [{index:0, feedback: "SAVE THE PLANET"},
             {index:1, feedback: "SAVE THE FOSSIL FUEL INDUSTRY"},
             {index:2, feedback: "SAVE SILICON VALLEY"}];



   //figure out which index # (aka which character) holds the max score
   for(i_prime=0; i_prime<all.length; i_prime++) {
   if(all[i_prime]==maxscore) {

      //this gets one answer, the last one it encounters with a match
   document.getElementById("answer").innerHTML = scores[i_prime].feedback;
   document.getElementById("answer2").innerHTML = scorez[i_prime].feedback;


   //this version would allow for appending multiple answers; replace statement above
   //document.getElementById("answer").innerHTML += scores[i].feedback + "; ";
   }
   }

   //  FUNCTIONS TO PRE-CHECK THE DASHBOARD LABELS BASED ON USER INPUTS IN THE CHOICES SECTIONS
   function checkbox_param(x){
      if(x == "CO2") { document.getElementById("DashCO2").checked = true; }
      if(x == "Primary_Energy_Consumption") { document.getElementById("DashPrimary_Energy_Consumption").checked = true; }
      }

   function checkbox_time(x){
      if(x == "1965") { document.getElementById("Dash1965").checked = true; }
      if(x == "1990") { document.getElementById("Dash1990").checked = true; }
      }

   function checkbox_group(x){
      if(x == "1") { document.getElementById("DashG1").checked = true; }
      if(x == "2") { document.getElementById("DashG2").checked = true; }
      if(x == "3") { document.getElementById("DashG3").checked = true; }
      if(x == "4") { document.getElementById("DashG4").checked = true; }
      }

   function checkbox_manip1(x){
      if(x == "Absolute") { document.getElementById("DashM1Absolute").checked = true; }
      if(x == "Growth") { document.getElementById("DashM1Growth").checked = true; }
      }

   function checkbox_manip2(x){
      if(x == "Population") { document.getElementById("DashM2Population").checked = true; }
      if(x == "GDP") { document.getElementById("DashM2GDP").checked = true; }
      if(x == "Absolute") { document.getElementById("DashM2Absolute").checked = true; }
      }

      checkbox_param(eval("param"));
      checkbox_time(eval("time"));
      checkbox_group(eval("group"));
      checkbox_manip1(eval("manip1"));
      checkbox_manip2(eval("manip2"));



  return false; // required to not refresh the page; just leave this here

      }// end the submit function
