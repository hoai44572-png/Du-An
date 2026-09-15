(function () {
  "use strict";

  /* ============================================================
     Scale toàn bộ .ldp-stage (canvas 1920px) theo chiều rộng
     màn hình thực tế, để ảnh nền / logo luôn giữ đúng tỉ lệ,
     đúng vị trí như thiết kế Figma (1920px).
  ============================================================ */
  

  /* ============================================================
     Preview ảnh khi chọn file (upload chính + thumbnail + CCCD)
  ============================================================ */
  function bindImagePreview(inputId, targetSelector) {
    var input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var url = URL.createObjectURL(file);
      var target = input.closest(targetSelector) || document.querySelector(targetSelector);
      if (target) {
        target.style.backgroundImage = "url('" + url + "')";
        target.style.backgroundSize = "cover";
        target.style.backgroundPosition = "center";
      }
    });
  }

  bindImagePreview("fileMain", ".upload-main");
  bindImagePreview("fileThumb1", ".upload-thumb");
  bindImagePreview("fileThumb2", ".upload-thumb");
  bindImagePreview("fileThumb3", ".upload-thumb");
  bindImagePreview("fileCccdFront", ".ldp-upload-field");
  bindImagePreview("fileCccdBack", ".ldp-upload-field");

  /* ============================================================
     Submit form đăng ký -> hiển thị popup "Đã đăng ký thành công"
  ============================================================ */
  var registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // TODO: gọi API đăng ký thực tế tại đây trước khi show popup thành công
      var modalEl = document.getElementById("modalSuccess");
      var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    });
  }
})();