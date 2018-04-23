/*-----------------Loader JS--------------*/
var myVar;

function loaderFunction() {
    myVar = setTimeout(showPage, 1000);
}

function fadePage() {
  document.getElementById("loader").classList.add("animate-bottom");
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("pageContainer").style.display = "block";
}


