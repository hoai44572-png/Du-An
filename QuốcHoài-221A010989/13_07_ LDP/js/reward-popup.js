/**
 * MISS MISTER - HÀO KHÍ DU HIỆP
 * File: js/reward-popup.js
 * Nạp động toàn bộ nội dung từ reward-popup.html và hiển thị dưới dạng Popup Modal
 */

(function () {
    "use strict";

    // Danh sách mốc thưởng mẫu
    var MILESTONES = ["50 Hoa", "150 Hoa", "500 Hoa", "1000 Hoa"];
    var DEMO_CODES = [
        "ABACA0145656",
        "BETA0267812",
        "GAMMA0389012",
        "DELTA0412345"
    ];

    var loadPromise = null;

    /**
     * Nạp toàn bộ nội dung từ file reward-popup.html và nhúng trực tiếp vào body (chỉ tải 1 lần)
     */
    function loadPopupFromHtml() {
        var existingOverlay = document.getElementById("rewardPopupOverlay") || document.getElementById("rewardModal");
        if (existingOverlay) {
            return Promise.resolve(existingOverlay);
        }

        if (loadPromise) {
            return loadPromise;
        }

        loadPromise = fetch("reward-popup.html")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Không thể tải reward-popup.html (Status: " + response.status + ")");
                }
                return response.text();
            })
            .then(function (htmlText) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(htmlText, "text/html");
                var fetchedOverlay = doc.getElementById("rewardPopupOverlay") || doc.querySelector(".reward-popup__overlay");

                if (!fetchedOverlay) {
                    throw new Error("Không tìm thấy #rewardPopupOverlay trong reward-popup.html");
                }

                // Nhúng trực tiếp phần tử popup từ reward-popup.html vào body
                document.body.appendChild(fetchedOverlay);
                return fetchedOverlay;
            })
            .catch(function (err) {
                console.warn("[reward-popup] Lỗi nạp reward-popup.html qua fetch:", err);
                loadPromise = null;
                // Trả về phần tử hiện có nếu có trong trang
                return document.getElementById("rewardPopupOverlay") || document.getElementById("rewardModal");
            });

        return loadPromise;
    }

    /**
     * Mở Popup Nhận Thưởng
     * @param {string} milestone - Tên mốc (VD: "50 Hoa")
     * @param {string} code - Mã quà tặng (VD: "ABACA0145656")
     */
    window.openRewardPopup = function (milestone, code) {
        var overlay = document.getElementById("rewardPopupOverlay") || document.getElementById("rewardModal");

        function showOverlay(el) {
            if (!el) return;
            var milestoneEl = el.querySelector("#rewardPopupMilestone") || el.querySelector("#rewardModalMilestone");
            var codeEl = el.querySelector("#rewardPopupCode") || el.querySelector("#rewardModalCode");

            if (milestoneEl) milestoneEl.textContent = milestone || "XX";
            if (codeEl) codeEl.textContent = code || "ABACA0145656";

            el.style.display = "flex";
            el.classList.remove("is-closing", "hide-active");
            el.classList.add("is-open", "show");
        }

        if (overlay) {
            showOverlay(overlay);
        } else {
            loadPopupFromHtml().then(function (fetchedOverlay) {
                showOverlay(fetchedOverlay);
            });
        }
    };

    /**
     * Gọi nhanh theo chỉ số mốc thưởng (0..3)
     */
    window.claimReward = function (index) {
        var idx = typeof index === "number" ? index : 0;
        window.openRewardPopup(MILESTONES[idx] || "XX", DEMO_CODES[idx] || "ABACA0145656");
    };

    /**
     * Đóng Popup Nhận Thưởng (Chỉ đóng khi bấm nút ✕ hoặc phím Esc)
     */
    window.closeRewardPopup = function () {
        var overlay = document.getElementById("rewardPopupOverlay") || document.getElementById("rewardModal");
        if (!overlay) return;

        overlay.classList.add("is-closing", "hide-active");
        setTimeout(function () {
            overlay.classList.remove("is-open", "show", "is-closing", "hide-active");
            overlay.style.display = "";
        }, 250);
    };

    /**
     * Sao chép mã vào Clipboard
     */
    window.copyRewardCode = function () {
        var overlay = document.getElementById("rewardPopupOverlay") || document.getElementById("rewardModal");
        if (!overlay) return;

        var codeEl = overlay.querySelector("#rewardPopupCode") || overlay.querySelector("#rewardModalCode");
        var toastEl = overlay.querySelector("#rewardPopupToast") || overlay.querySelector("#rewardCopyToast");

        if (!codeEl) return;
        var codeText = codeEl.textContent.trim();

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(codeText)
                .then(function () {
                    showToast(toastEl);
                })
                .catch(function () {
                    fallbackCopyText(codeText, toastEl);
                });
        } else {
            fallbackCopyText(codeText, toastEl);
        }
    };

    function fallbackCopyText(text, toastEl) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
            showToast(toastEl);
        } catch (err) {
            console.error("[reward-popup] Lỗi sao chép:", err);
        }

        document.body.removeChild(textArea);
    }

    function showToast(toastEl) {
        if (!toastEl) return;
        toastEl.classList.add("is-visible", "visible");
        setTimeout(function () {
            toastEl.classList.remove("is-visible", "visible");
        }, 2000);
    }

    // Lắng nghe phím ESC để đóng popup
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            window.closeRewardPopup();
        }
    });

    // Tải ngầm popup từ reward-popup.html ngay khi trang sẵn sàng
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadPopupFromHtml);
    } else {
        loadPopupFromHtml();
    }

})();
