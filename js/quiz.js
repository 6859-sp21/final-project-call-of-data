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
  param = document.querySelector('#form1 input[name = "param"]:checked').val;
  time = document.querySelector('#form1 input[name = "time"]:checked').val;
  group = document.querySelector('#form1 input[name = "group"]:checked').val;
  manip1 = document.querySelector('#form1 input[name = "manip1"]:checked').val;
  manip2 = document.querySelector('#form1 input[name="manip2"]:checked').val;

   // initialize score variables
   science = 0;
   oil = 0;
   tech = 0;

   // function to calculate score for each question
   // We'll have to make one of these functions for each of the questions, to vary both weight and assign a character based on the selection
   function eachscore(x){
   if(x == "science") { science = science + 1}
   if(x == "oil") { oil = oil + 1}
   if(x == "tech") { tech = tech + 1}
   }
   // for the above function, you could also change the 1 to a variable so you could give more points for certain questions

   //call function for each question
   // the value inside the function is the name of the question
   eachscore(eval("param"));
   eachscore(eval("time"));
   eachscore(eval("group"));
   eachscore(eval("manip1"));
   eachscore(eval("manip2"));

   all = [science, oil, tech];

 //get the max score  in the array
 maxscore = Math.max.apply(Math,all);

 // object holding scores and associated text for that character
 scores = [{index:0, feedback: "HONEST SCIENTIST"},
           {index:1, feedback: "OIL TYCOON"},
           {index:2, feedback: "TECH"}];

 scorez = [{index:0, feedback: "SAVE THE PLANET"},
           {index:1, feedback: "SAVE THE FOSSIL FUEL INDUSTRY"},
           {index:2, feedback: "SAVE TECH & THE UNITED PLATES"}];



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

return false; // required to not refresh the page; just leave this here
    }// end the submit function
