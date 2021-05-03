
// TEXT ANIMATIONS


// Following this tutorial to animate text as it comes into view:
// https://codepen.io/jr-cologne/pen/zdYdmx

// FOR THE TYPE WRITER

// get the element to animate
var element1 = document.getElementById('typewriter');
var elementHeight1 = element1.clientHeight;

// listen for scroll event and call animate function
document.addEventListener('scroll', animate_text);

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

// animate element when it is in view
function animate_text() {
  // is element in view?
  if (inView(element1, elementHeight1)) {
      // element is in view, add class to element
      element1.classList.add('animate');
  }
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


