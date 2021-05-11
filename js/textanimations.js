
// TEXT ANIMATIONS



// TYPEWRITER FUNCTIONALITY ADAPTED FROM: https://codepen.io/daviddcarr/pen/XVyQMM

// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;


// JOE BUTTON INTRO TEXT: 
// Pipe indicates the start of the second line "|".  
var textArray = [
  "I, Joe Button, the president of the United Plates,|Need you to help me tackle our Earth’s deadliest enemy:", 
  "|Climate Change."
];

// animate element when it is in view
  function animate_text1() {
      // On click, run typewriter function
      typeWriter("output", textArray);
  
}



// MISSION DESCRIPTION TEXT: 
var textArray2 = [
  "I have a meeting with our planet's biggest polluters in 1 week,|and I need to convince them to Save The Planet!", 
  "Your mission is to create an unbiased visual|that tells the true story about climate change."
];

// animate element when it is in view
function animate_text2() {
  // On click, run typewriter function
  typeWriter("output2", textArray2);
}



// TYPEWRITER FUNCTION
// Speed (in milliseconds) of typing.
var speedForward = 50, //Typing Speed
    speedWait = 1500, // Wait between typing and backspacing
    speedBetweenLines = 100, //Wait between first and second lines
    speedBackspace = 15; //Backspace Speed


function typeWriter(id, ar) {
  var element = $("#" + id),
      aString = ar[a],
      eHeader = element.children("h1"), //Header element
      eParagraph = element.children("p"); //Subheader element
  
  // Determine if animation should be typing or backspacing
  if (!isBackspacing) {
    
    // If full string hasn't yet been typed out, continue typing
    if (i < aString.length) {
      
      // If character about to be typed is a pipe, switch to second line and continue.
      if (aString.charAt(i) == "|") {
        isParagraph = true;
        eHeader.removeClass("cursor");
        eParagraph.addClass("cursor");
        i++;
        setTimeout(function(){ typeWriter(id, ar); }, speedBetweenLines);
        
      // If character isn't a pipe, continue typing.
      } else {
        // Type header or subheader depending on whether pipe has been detected
        if (!isParagraph) {
          eHeader.text(eHeader.text() + aString.charAt(i));
        } else {
          eParagraph.text(eParagraph.text() + aString.charAt(i));
        }
        i++;
        setTimeout(function(){ typeWriter(id, ar); }, speedForward);
      }
      
    // If full string has been typed, switch to backspace mode.
    } else if (i == aString.length) {
      
      isBackspacing = true;
      setTimeout(function(){ typeWriter(id, ar); }, speedWait);
      
    }
    
  // If backspacing is enabled
  } else {
    
    // If either the header or the paragraph still has text, continue backspacing
    if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
      
      // If paragraph still has text, continue erasing, otherwise switch to the header.
      if (eParagraph.text().length > 0) {
        eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
      } else if (eHeader.text().length > 0) {
        eParagraph.removeClass("cursor");
        eHeader.addClass("cursor");
        eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
      }
      setTimeout(function(){ typeWriter(id, ar); }, speedBackspace);
    
    // If neither head or paragraph still has text, switch to next quote in array and start typing.
    } else { 
      
      isBackspacing = false;
      i = 0;
      isParagraph = false;
      a = (a + 1) % ar.length; //Moves to next position in array, always looping back to 0
      setTimeout(function(){ typeWriter(id, ar); }, 10);
      
    }
  }
}




// ADD AN EVENT LISTENER TO ONLY ANIMATE TEXT WHEN IN VIEW:
// CODE ADAPTED FROM: https://codepen.io/jr-cologne/pen/zdYdmx

// check if element is in view
function inView(element, elementHeight) {
  // get window height
  var windowHeight = window.innerHeight;
  // get number of pixels that the document is scrolled
  var scrollY = window.scrollY || window.pageYOffset;
  
  // get current scroll position (distance from the top of the page to the bottom of the current viewport)
  var scrollPosition = scrollY + windowHeight;
  // get element position (distance from the top of the page to the bottom of the element)
  var elementPosition = element.getBoundingClientRect().top + scrollY + elementHeight;
  
  // is scroll position greater than element position? (is element in view?)
  if (scrollPosition > elementPosition) {
    return true;
  }
  
  return false;
}

// FOR THE REVEAL
var element2 = document.getElementById('fade-in-text');
var elementHeight2 = element2.clientHeight;

document.addEventListener('scroll', reveal_text);

function reveal_text() {
  if (inView(element2, elementHeight2)) {
      element2.classList.add('reveal_animate');
  }
}







// PLAYER BUTTONS
// Sources: https://codepen.io/davidcochran/pen/WbWXoa
// https://stackoverflow.com/questions/6957443/how-to-display-div-after-click-the-button-in-javascript

function picture1(){ 
    var pic = "data/science_cat.png"
    document.getElementById('player1_image').src = pic.replace('30x30', '100x100');
    document.getElementById('player1_image').style.display='block';
}

function picture2(){ 
    var pic = "data/spaceperson.png"
    document.getElementById('player2_image').src = pic.replace('30x30', '100x100');
    document.getElementById('player2_image').style.display='block';
}



// FINAL DASHBOARD BUTTONS
function picture3(){ 
  var pic = "data/honest_scientist.jpg"
  document.getElementById('honest_scientist').src = pic;
  document.getElementById('honest_scientist').style.display='block';
}

function picture4(){ 
  var pic = "data/oil_tycoon.jpg"
  document.getElementById('oil_tycoon').src = pic;
  document.getElementById('oil_tycoon').style.display='block';
}


