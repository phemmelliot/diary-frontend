window.onscroll = function () { myFunction(); };

const header = document.getElementById('myHeader');
const sticky = header.offsetTop;
const headerHeight = header.offsetHeight;
const scrollHeader = header.scrollHeight;
console.log(headerHeight);
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
    loadDiv.style.position = 'fixed';
    gradientBg.style.position = 'fixed';
    errorHead.classList.add('stickyError');
    errorHead.style.top = `${scrollHeader}px`;
  } else {
    header.classList.remove('sticky');
    errorHead.classList.remove('stickyError');
  }
}

function checkMedia(x) {
    if (x.matches) { // If media query matches
        errorHead.style.top = `${headerHeight}px`;
    } else {
        errorHead.style.top = `${scrollHeader}px`;
    }
}

let x = window.matchMedia("(max-width: 700px)");
checkMedia(x);
x.addListener(checkMedia);
