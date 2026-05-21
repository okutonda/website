const slides=[

"img/slider/oku.png",

"img/slider/oku2.png"

];

let index=0;

const image=
document.getElementById(
"slideImage"
);

setInterval(()=>{

index++;

if(
index>=slides.length
){

index=0;

}

image.src=
slides[index];

},5000);



window.addEventListener(
"scroll",
()=>{

const header=
document.querySelector(
".header"
);

if(
window.scrollY>50
){

header.style.background=
"#020b16ee";

}else{

header.style.background=
"#04101d";

}

});