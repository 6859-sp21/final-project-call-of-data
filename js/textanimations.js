// TYPEWRITER FUNCTIONALITY ADAPTED FROM: https://codepen.io/daviddcarr/pen/XVyQMM

// Speed (in milliseconds) of typing.
var speedForward = 60, //Typing Speed
    speedWait = 1500, // Wait between typing and backspacing
    speedBetweenLines = 200, //Wait between first and second lines
    speedBackspace = 20; //Backspace Speed



// PART 1 - JOE BUTTON INTRO TEXT:
// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;


// Pipe indicates the start of the second line "|".
var textArray = [
  "I, Joe Button, the president of the United Plates,|need you to help me tackle our Earth’s deadliest enemy:",
  "|Climate Change."
];

// animate element when it is in view
  function animate_text1() {
      // On click, run typewriter function
      typeWriter("output", textArray);

}

// TYPEWRITER FUNCTION 1:
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


//  PART 2 - MISSION DESCRIPTION TEXT:
// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var j = 0,
    b = 0,
    Backspacing = false,
    Paragraph = false;

var textArray2 = [
  "I have a meeting with our planet's rulers in 1 week, and I need to convince them to Save The Planet!|Your mission is to create a visual that tells the true story of climate change.",
  "There's only one catch...|The data is top secret, so you won't be able to look at it!"
];

// animate element when it is in view
function animate_text2() {
  // On click, run typewriter function
  typeWriter2("output2", textArray2);
}



// PART 2 - TYPEWRITER FUNCTIONS



// FUNCTION 2: (Otherwise: indexes overlap and it's a mess)
function typeWriter2(id, ar) {
  var element = $("#" + id),
      aString = ar[b],
      eHeader = element.children("h1"),
      eParagraph = element.children("p"); //Subheader element

  if (!Backspacing) {
    if (j < aString.length) {
      if (aString.charAt(j) == "|") {
        Paragraph = true;
        eHeader.removeClass("cursor");
        eParagraph.addClass("cursor");
        j++;
        setTimeout(function(){ typeWriter2(id, ar); }, speedBetweenLines);

      } else {
        if (!Paragraph) {
          eHeader.text(eHeader.text() + aString.charAt(j));
        } else {
          eParagraph.text(eParagraph.text() + aString.charAt(j));
        }
        j++;
        setTimeout(function(){ typeWriter2(id, ar); }, speedForward);
      }

    } else if (j == aString.length) {
      Backspacing = true;
      setTimeout(function(){ typeWriter2(id, ar); }, speedWait);
    }

  } else {
    if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
      if (eParagraph.text().length > 0) {
        eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
      } else if (eHeader.text().length > 0) {
        eParagraph.removeClass("cursor");
        eHeader.addClass("cursor");
        eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
      }
      setTimeout(function(){ typeWriter2(id, ar); }, speedBackspace);

    } else {
      Backspacing = false;
      j = 0;
      Paragraph = false;
      b = (b + 1) % ar.length;
      setTimeout(function(){ typeWriter2(id, ar); }, 10);
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


var element3 = document.getElementById('fade-in-text2');
var elementHeight3 = element3.clientHeight;

document.addEventListener('scroll', reveal_text2);


function reveal_text2() {
  if (inView(element3, elementHeight3)) {
    element3.classList.add('reveal_animate2');
  }
}







// PLAYER BUTTONS
// Sources: https://codepen.io/davidcochran/pen/WbWXoa
// https://stackoverflow.com/questions/6957443/how-to-display-div-after-click-the-button-in-javascript

function picture1(){
    var pic = "data/science_cat.png"
    document.getElementById('player1_image1').src = pic.replace('30x30', '100x100');
    document.getElementById('player1_image1').style.display='block';

    document.getElementById('player1_image2').src = pic.replace('30x30', '100x100');
    document.getElementById('player1_image2').style.display='block';

    document.getElementById('player1_image3').src = pic.replace('30x30', '100x100');
    document.getElementById('player1_image3').style.display='block';

    document.getElementById('player1_image4').src = pic.replace('30x30', '100x100');
    document.getElementById('player1_image4').style.display='block';

    document.getElementById('player1_image5').src = pic.replace('30x30', '100x100');
    document.getElementById('player1_image5').style.display='block';
}

function picture2(){
    var pic = "data/spaceperson.png"
    document.getElementById('player2_image1').src = pic.replace('30x30', '100x100');
    document.getElementById('player2_image1').style.display='block';

    document.getElementById('player2_image2').src = pic.replace('30x30', '100x100');
    document.getElementById('player2_image2').style.display='block';

    document.getElementById('player2_image3').src = pic.replace('30x30', '100x100');
    document.getElementById('player2_image3').style.display='block';

    document.getElementById('player2_image4').src = pic.replace('30x30', '100x100');
    document.getElementById('player2_image4').style.display='block';

    document.getElementById('player2_image5').src = pic.replace('30x30', '100x100');
    document.getElementById('player2_image5').style.display='block';
}

function picture3(){
    var pic = "data/blue_guy.png"
    document.getElementById('player3_image1').src = pic.replace('30x30', '100x100');
    document.getElementById('player3_image1').style.display='block';

    document.getElementById('player3_image2').src = pic.replace('30x30', '100x100');
    document.getElementById('player3_image2').style.display='block';

    document.getElementById('player3_image3').src = pic.replace('30x30', '100x100');
    document.getElementById('player3_image3').style.display='block';

    document.getElementById('player3_image4').src = pic.replace('30x30', '100x100');
    document.getElementById('player3_image4').style.display='block';

    document.getElementById('player3_image5').src = pic.replace('30x30', '100x100');
    document.getElementById('player3_image5').style.display='block';
}
