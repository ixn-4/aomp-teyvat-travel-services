function renderNewInquiries() {
    const tbody = document.getElementById("inquiriesBody");
    const inquiries = JSON.parse(localStorage.getItem("inquiries")) || [];
    const TOTAL_TABLE_ROWS = 8;

    tbody.querySelectorAll(".dynamic-inquiry").forEach(row => row.remove());
    tbody.querySelectorAll(".empty-filler-row").forEach(row => row.remove());
    
    inquiries.forEach(item => {
        const tr = document.createElement("tr");
        tr.className = "inquiry-row dynamic-inquiry";
        tr.dataset.status = item.status || "pending";
        tr.dataset.name = item.name;
        tr.dataset.email = item.email;

        const phoneHTML = item.phoneNumber
            ? `<span class="contact-phone">${item.phoneNumber}</span>` 
            : "";

        tr.innerHTML = `
            <td class="client-name">${item.name}</td>
                <td>
                    <div class="contact-stack">
                    <span class="contact-email">${item.email}</span>
                    ${phoneHTML}
                    </div>
                </td>
            <td>
                <div class="inquiry-preview">${item.message}</div>
            </td>
            <td class="action-cell">
                <a href="inquiry-review.html?id=${item.id}" class="btn-review">Review</a>
            </td>
      `;

        tbody.appendChild(tr);
    });

    const currentDataRows = tbody.querySelectorAll(".inquiry-row").length;
    const neededFillers = Math.max(0, TOTAL_TABLE_ROWS - currentDataRows);

    for (let i = 0; i < neededFillers; i++) {
        const fillerTr = document.createElement("tr");
        fillerTr.className = "empty-filler-row";
        fillerTr.innerHTML = `<td colspan="4"></td>`;
        tbody.appendChild(fillerTr);
    }
}

    document.addEventListener("DOMContentLoaded", renderNewInquiries);

    window.addEventListener("storage", (e) => {
        if (e.key === "inquiries") renderNewInquiries();
});
