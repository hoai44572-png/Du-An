// Slider logic hiện dùng cho HTML này là: .slide / .thumb
// (Đoạn slider “.slider / .slides / .dots” bên dưới đã được loại bỏ để tránh xung đột selector)




const slides = document.querySelectorAll(".slide");
const thumbs = document.querySelectorAll(".thumb");

thumbs.forEach((thumb,index)=>{

    thumb.addEventListener("click",()=>{

        slides.forEach(slide=>{
            slide.classList.remove("active");
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


// Hàm tự động tải file html bên ngoài và chèn vào thẻ div
        function loadComponent(elementId, filePath) {
            fetch(filePath)
                .then(response => {
                    if (!response.ok) throw new Error("Không thể tải file: " + filePath);
                    return response.text();
                })
                .then(data => {
                    document.getElementById(elementId).innerHTML = data;
                })
                .catch(error => console.error(error));
        }

        // Chạy hàm để gọi header và footer vào trang
        // dùng URL đúng theo vị trí file hiện tại
        loadComponent('header-component', '/Trang_Chu/02-06-2026/header.html');
        loadComponent('footer-component', '/Trang_Chu/02-06-2026//footer.html');
