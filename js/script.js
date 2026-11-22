const PACKAGE_DATA = {
    mondstadt: {
        name: "Mondstadt",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 12500,
        bannerImage: "../assets/images/mondstadt-trip-image.png",
        itinerary: ["Cider Lake", "Windrise", "Cathedral of Mondstadt"]
    },
    liyue: {
        name: "Liyue",
        duration: "4 Days / 3 Nights",
        pricePerPerson: 15000,
        bannerImage: "../assets/images/liyue-trip-image.png",
        itinerary: ["Liyue Harbor", "Jueyun Karst", "Guili Plains"]
    },
    inazuma: {
        name: "Inazuma",
        duration: "4 Days / 3 Nights",
        pricePerPerson: 18000,
        bannerImage: "../assets/images/inazuma-trip-image.png",
        itinerary: ["Inazuma City", "Grand Narukami Shrine", "Ritou"]
    },
    sumeru: {
        name: "Sumeru",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 12500,
        bannerImage: "../assets/images/sumeru-trip-image.png",
        itinerary: ["Sumeru City", "Gandharva Ville", "Devantaka Mountain"]
    },
    fontaine: {
        name: "Fontaine",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 12500,
        bannerImage: "../assets/images/fontaine-trip-image.png",
        itinerary: ["Court of Fontaine", "Poisson", "Beryl Region"]
    },
    natlan: {
        name: "Natlan",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 12500,
        bannerImage: "../assets/images/natlan-trip-image.png",
        itinerary: ["Stadium of the Sacred Flame", "Scions of the Canopy", "People of the Springs"]
    },
    snezhnaya: {
        name: "Snezhnaya",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 12500,
        bannerImage: "../assets/images/snezhnaya-trip-image.png",
        itinerary: ["Zapolyarny Palace", "Morepesok", "Snezhnaya Winter Promenade"]
    }
};

function formatPhp(amount) {
    return "Php " + Number(amount).toLocaleString("en-US");
}

function setFieldError(inputId, errorId, message) {
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!inputEl || !errorEl) return true;

    if (message) {
        inputEl.classList.add("invalid");
        errorEl.textContent = message;
        return false;
    }

    inputEl.classList.remove("invalid");
    errorEl.textContent = "";
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    // -------------------- 1. GENERAL INQUIRY FORM --------------------
    const generalInquiryForm = document.getElementById("generalInquiryForm");
    if (generalInquiryForm) {
        generalInquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const emailAddress = document.getElementById("emailAddress").value.trim();
            const phoneNumber = document.getElementById("phoneNumber").value.trim();

            const isNameValid = setFieldError(
                "fullName",
                "fullNameError",
                fullName ? "" : "Full name is required."
            );

            const isEmailValid = setFieldError(
                "emailAddress",
                "emailAddressError",
                !emailAddress
                    ? "Email address is required."
                    : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress) ? "Enter a valid email address." : "")
            );

            const isPhoneValid = setFieldError(
                "phoneNumber",
                "phoneNumberError",
                phoneNumber && !/^[+\d\s()-]{7,20}$/.test(phoneNumber)
                    ? "Enter a valid phone number."
                    : ""
            );

            if (isNameValid && isEmailValid && isPhoneValid) {
                alert("Your general inquiry has been submitted. Our travel team will get back to you soon.");
                generalInquiryForm.reset();
            }
        });
    }

    // -------------------- 2. PACKAGE INQUIRY FORM (W/O & W PACKAGE) --------------------
    const pkgForm = document.getElementById("packageInquiryForm");
    if (pkgForm) {
        const pkgSelect = document.getElementById("pkgSelect");
        const travelerCountDisplay = document.getElementById("travelerCountDisplay");
        const numTravelersInput = document.getElementById("numTravelers");
        const decrementBtn = document.getElementById("decrementTravelers");
        const incrementBtn = document.getElementById("incrementTravelers");
        const totalDisplay = document.getElementById("pkgTotalDisplay");
        const formHeading = document.getElementById("pkgFormHeading");

        const withoutPkgState = document.getElementById("withoutPackageState");
        const withPkgState = document.getElementById("withPackageState");
        const changePkgBtn = document.getElementById("changePackageBtn");

        const chosenPkgImage = document.getElementById("chosenPkgImage");
        const chosenPkgName = document.getElementById("chosenPkgName");
        const chosenPkgDuration = document.getElementById("chosenPkgDuration");
        const chosenPkgItinerary = document.getElementById("chosenPkgItinerary");
        const chosenPkgUnitPrice = document.getElementById("chosenPkgUnitPrice");

        let selectedKey = "";
        let travelers = 1;

        function syncPackageUI() {
            const pkg = PACKAGE_DATA[selectedKey] || null;
            travelerCountDisplay.textContent = travelers;
            numTravelersInput.value = travelers;

            if (!pkg) {
                formHeading.textContent = "Package Inquiry Form";
                totalDisplay.textContent = "Select a package";
                totalDisplay.classList.add("pkg-total-placeholder");
                withoutPkgState.classList.remove("pkg-hidden");
                withPkgState.classList.add("pkg-hidden");
                return;
            }

            formHeading.textContent = "Inquiry Form";
            const totalAmount = pkg.pricePerPerson * travelers;
            totalDisplay.textContent = formatPhp(totalAmount);
            totalDisplay.classList.remove("pkg-total-placeholder");

            chosenPkgImage.src = pkg.bannerImage;
            chosenPkgImage.alt = pkg.name;
            chosenPkgName.textContent = pkg.name;
            chosenPkgDuration.textContent = pkg.duration;
            chosenPkgUnitPrice.textContent = `${formatPhp(pkg.pricePerPerson)} per person`;
            chosenPkgItinerary.innerHTML = pkg.itinerary.map((stop) => `<li>${stop}</li>`).join("");

            withoutPkgState.classList.add("pkg-hidden");
            withPkgState.classList.remove("pkg-hidden");
        }

        document.querySelectorAll(".btn-choose-pkg, .pkg-option-card-graphic").forEach((el) => {
            el.addEventListener("click", () => {
                selectedKey = el.dataset.package || "";
                pkgSelect.value = selectedKey;
                syncPackageUI();
            });
        });

        pkgSelect.addEventListener("change", () => {
            selectedKey = pkgSelect.value;
            syncPackageUI();
        });

        if (changePkgBtn) {
            changePkgBtn.addEventListener("click", () => {
                selectedKey = "";
                pkgSelect.value = "";
                syncPackageUI();
            });
        }

        decrementBtn.addEventListener("click", () => {
            if (travelers > 1) {
                travelers -= 1;
                syncPackageUI();
            }
        });

        incrementBtn.addEventListener("click", () => {
            if (travelers < 20) {
                travelers += 1;
                syncPackageUI();
            }
        });

        const params = new URLSearchParams(window.location.search);
        const initialPkg = (params.get("package") || "").toLowerCase();
        if (PACKAGE_DATA[initialPkg]) {
            selectedKey = initialPkg;
            pkgSelect.value = initialPkg;
        }
        syncPackageUI();

        pkgForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("pkgFullName").value.trim();
            const email = document.getElementById("pkgEmail").value.trim();
            const phone = document.getElementById("pkgPhone").value.trim();
            const age = Number(document.getElementById("pkgAge").value);
            const startDate = document.getElementById("departureDate").value;
            const endDate = document.getElementById("returnDate").value;

            const vName = setFieldError("pkgFullName", "pkgFullNameError", fullName ? "" : "Full name is required.");
            const vEmail = setFieldError(
                "pkgEmail",
                "pkgEmailError",
                !email
                    ? "Email address is required."
                    : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address." : "")
            );
            const vPhone = setFieldError("pkgPhone", "pkgPhoneError", phone ? "" : "Phone number is required.");
            const vAge = setFieldError("pkgAge", "pkgAgeError", (!age || age < 1 || age > 120) ? "Enter a valid age." : "");
            const vPkg = setFieldError("pkgSelect", "pkgSelectError", selectedKey ? "" : "Please choose a travel package.");
            const vStart = setFieldError("departureDate", "departureDateError", startDate ? "" : "Departure date is required.");
            const vEnd = setFieldError(
                "returnDate",
                "returnDateError",
                !endDate
                    ? "Return date is required."
                    : ((startDate && endDate < startDate) ? "Return date must be on or after departure date." : "")
            );

            if (vName && vEmail && vPhone && vAge && vPkg && vStart && vEnd) {
                const pkg = PACKAGE_DATA[selectedKey];
                const total = formatPhp(pkg.pricePerPerson * travelers);
                alert(`Package inquiry submitted for ${pkg.name} (${travelers} traveler${travelers > 1 ? "s" : ""}, Estimated Total: ${total}).`);
                pkgForm.reset();
                selectedKey = "";
                travelers = 1;
                syncPackageUI();
            }
        });
    }
});