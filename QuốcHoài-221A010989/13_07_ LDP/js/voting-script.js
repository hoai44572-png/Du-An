/* ============================================================
   MISS MISTER - HÀO KHÍ DU HIỆP - TRANG VOTING
   File: js/voting-script.js
   Chỉ xử lý giao diện tĩnh - chưa có animation/hover/API
============================================================ */
(function () {
  "use strict";

  /* ============================================================
     BXH Tab switching - chuyển tab Mỹ Nhân / Mỹ Nam / Phù Giáp
  ============================================================ */
  var bxhTabs = document.querySelectorAll(".v-bxh__tab");
  bxhTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      bxhTabs.forEach(function (t) {
        t.classList.remove("v-bxh__tab--active");
      });
      tab.classList.add("v-bxh__tab--active");
    });
  });

  /* ============================================================
     Pagination display - giữ UI tĩnh, chưa xử lý phân trang thật
  ============================================================ */
  var pageFirst = document.getElementById("pageFirst");
  var pagePrev  = document.getElementById("pagePrev");
  var pageNext  = document.getElementById("pageNext");
  var pageLast  = document.getElementById("pageLast");
  var pageNum   = document.getElementById("pageNum");

  /* ============================================================
     Smooth scroll khi click Vote Ngay về danh sách thí sinh
  ============================================================ */
  var voteBtn = document.getElementById("btnVoteNgay");
  if (voteBtn) {
    voteBtn.addEventListener("click", function (e) {
      var target = document.getElementById("danh-sach");
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ============================================================
     Popup Hướng Dẫn - Tab Hướng Dẫn Click Listener & Escape Key
  ============================================================ */
  var tabHuongDan = document.getElementById("tabHuongDan");
  if (tabHuongDan) {
    tabHuongDan.addEventListener("click", function (e) {
      e.preventDefault();
      if (typeof window.openHuongDanPopup === "function") {
        window.openHuongDanPopup();
      } else {
        var modal = document.getElementById("huongDanModal");
        if (modal) {
          modal.style.display = "flex";
          void modal.offsetWidth;
          modal.classList.remove("hide-active");
          modal.classList.add("show");
        }
      }
    });
  }

  /* ============================================================
     Popup Hoa Free - Tab Hoa Free Click Listener
  ============================================================ */
  var tabHoaFree = document.getElementById("tabHoaFree");
  if (tabHoaFree) {
    tabHoaFree.addEventListener("click", function (e) {
      e.preventDefault();
      if (typeof window.openHoaFreePopup === "function") {
        window.openHoaFreePopup();
      } else {
        var modal = document.getElementById("hoaFreeModal");
        if (modal) {
          modal.style.display = "flex";
          void modal.offsetWidth;
          modal.classList.remove("hide-active");
          modal.classList.add("show");
        }
      }
    });
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (typeof window.closeHuongDanPopup === "function") {
        window.closeHuongDanPopup();
      }
      if (typeof window.closeHoaFreePopup === "function") {
        window.closeHoaFreePopup();
      } else {
        var modal = document.getElementById("hoaFreeModal");
        if (modal && modal.classList.contains("show")) {
          modal.classList.add("hide-active");
          modal.classList.remove("show");
          setTimeout(function () {
            modal.style.display = "none";
            modal.classList.remove("hide-active");
          }, 300);
        }
      }
    }
  });

})();
