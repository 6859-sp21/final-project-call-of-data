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
   quiet = 0;
   spoon = 0;
   willie = 0;
   
   //function to calculate score for each question
   function eachscore(x){
   if(x == "quiet") { quiet = quiet + 1}
   if(x == "spoon") { spoon = spoon + 1}
   if(x == "willie") { willie = willie + 1}
   }
   // for the above function, you could also change the 1 to a variable so you could give more points for certain questions
   
   //call function for each question
   eachscore(eval("age"));
   eachscore(eval("activity"));
   eachscore(eval("genre"));
      
   all = [quiet, spoon, willie];
   
 //get the max score  in the array
 maxscore = Math.max.apply(Math,all);
 
 // object holding scores and feedback	
 scores = [{index:0, feedback: "Quiet Company"},
           {index:1, feedback: "Spoon"},
           {index:2, feedback: "Willie Nelson"}];
 
 //figure out which index # holds the max score 
 for(i_prime=0; i_prime<all.length; i_prime++) {
 if(all[i_prime]==maxscore) {
 
    //this gets one answer, the last one it encounters with a match
 document.getElementById("answer").innerHTML = scores[i_prime].feedback;
 document.getElementById("answer2").innerHTML = scores[i_prime].feedback;

 
 //this version would allow for appending multiple answers; replace statement above
 //document.getElementById("answer").innerHTML += scores[i].feedback + "; ";
 }
 }
        
return false; // required to not refresh the page; just leave this here
    }// end the submit function
 
