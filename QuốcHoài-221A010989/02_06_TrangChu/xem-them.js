const slides = document.querySelectorAll(".slide");
const thumbs = document.querySelectorAll(".thumb");

thumbs.forEach((thumb,index)=>{

    thumb.addEventListener("click",()=>{

        slides.forEach(slide=>{
            slide.classList.remove("active");
        });

        thumbs.forEach(item=>{
            item.classList.remove("active");
        });

        slides[index].classList.add("active");
        thumb.classList.add("active");
    });

});

let current = 0;

setInterval(()=>{

    slides[current].classList.remove("active");
    thumbs[current].classList.remove("active");

    current++;

    if(current >= slides.length){
        current = 0;
    }

    slides[current].classList.add("active");
    thumbs[current].classList.add("active");

},5000);