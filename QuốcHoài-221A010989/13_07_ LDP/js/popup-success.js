/**
 * MISS MISTER - HÀO KHÍ DU HIỆP
 * File: js/popup-success.js
 * Handles the "ĐÃ TẶNG HOA THÀNH CÔNG" Success Notification Popup
 */

(function () {
    "use strict";

    // Show Success Notification Popup
    window.showSuccessPopup = function () {
        const overlay = document.getElementById("successModal");
        if (!overlay) return;

        // Reset state classes and show modal
        overlay.classList.remove("hide-active");
        overlay.classList.add("show");
    };

    // Close Success Notification Popup with fade out transition
    window.closeSuccessPopup = function () {
        const overlay = document.getElementById("successModal");
        if (!overlay || !overlay.classList.contains("show")) return;

        // Add class to trigger fade-out animation
        overlay.classList.add("hide-active");

        // Wait for CSS fade-out animation to complete (~250ms) before hiding
        setTimeout(function () {
            overlay.classList.remove("show");
            overlay.classList.remove("hide-active");
        }, 250);
    };

    // Handle clicks outside the modal content container (disabled closing)
    window.handleSuccessOverlayClick = function (event) {
        // Do nothing on background overlay click as requested: 
        // Only closable by the close button X or Escape key.
    };

    // Bind Esc key event listener for success modal
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            window.closeSuccessPopup();
        }
    });

})();
