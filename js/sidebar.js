// SIDE BAR FUNCTIONALITY ADAPTED FROM: https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar1").style.width = "250px";
    document.getElementById("mySidebar2").style.width = "250px";

    // document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar1").style.width = "0";
    document.getElementById("mySidebar2").style.width = "0";

    // document.getElementById("main").style.marginLeft = "0";
  }


