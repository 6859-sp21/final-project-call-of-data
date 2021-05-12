//  IMPLEMENT FIXED-CHOICE TEST STRUCTURE
// Code adapted from: https://codeactually.com/examples.html


document.getElementById("form1").onsubmit=function() {
    //displays the response DOM element
 document.getElementById("response").style.display = "block";
 document.getElementById("response2").style.display = "block";
 
 //resets the DOM element on submit
 document.getElementById("answer").innerHTML = "";
 document.getElementById("answer2").innerHTML = "";

   age = document.querySelector('#form1 input[name = "age"]:checked').value;
   activity = document.querySelector('#form1 input[name = "activity"]:checked').value;
   genre = document.querySelector('#form1 input[name = "genre"]:checked').value;
     
   // initialize score variables 
   science = 0;
   oil = 0;
   other = 0;
   
   //function to calculate score for each question
   function eachscore(x){
   if(x == "science") { science = science + 1}
   if(x == "oil") { oil = oil + 1}
   if(x == "other") { other = other + 1}
   }
   // for the above function, you could also change the 1 to a variable so you could give more points for certain questions
   
   //call function for each question
   eachscore(eval("age"));
   eachscore(eval("activity"));
   eachscore(eval("genre"));
      
   all = [science, oil, other];
   
 //get the max score  in the array
 maxscore = Math.max.apply(Math,all);
 
 // object holding scores and feedback	
 scores = [{index:0, feedback: "HONEST SCIENTIST"},
           {index:1, feedback: "OIL TYCOON"},
           {index:2, feedback: "OTHER"}];

 scorez = [{index:0, feedback: "SAVE THE PLANET"},
           {index:1, feedback: "DESTROY THE PLANET"},
           {index:2, feedback: "SAVE THE UNITED PLATES"}];
 
 //figure out which index # holds the max score 
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
 
