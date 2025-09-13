const urlParams = new URLSearchParams(window.location.search);
const secretCode = urlParams.get('code');

if (!secretCode) {
  alert("Invalid QR Code URL!");
} else {
  fetch(`https://script.google.com/macros/s/AKfycbx55WA06bJ1L_pGv3UIH2-kEw5BooDyF-6TDoZt7hBTr5kUIwkfWuZcSFCCl17syDoFkQ/exec?code=${secretCode}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Convert Google Drive share link → direct image
      function getDirectDriveLink(driveUrl) {
        if (!driveUrl) return "";
        let fileIdMatch = driveUrl.match(/[-\w]{25,}/);
        if (fileIdMatch) {
          return `https://drive.google.com/uc?export=view&id=${fileIdMatch[0]}`;
        }
        return driveUrl;
      }

      // Student Info
      document.getElementById('studentName').innerText = data.student.name;
      document.getElementById('batch').innerText = `Batch: ${data.student.batch}`;
      document.getElementById('profilePhoto').src =
        getDirectDriveLink(data.student.profilePhoto) ||
        "https://via.placeholder.com/120?text=No+Photo";

      // Current Test
      if (data.currentTest) {
        document.getElementById('currentTest').innerText =
          `${data.currentTest.testName} - ${data.currentTest.marks} Marks (${data.currentTest.date})`;
      } else {
        document.getElementById('currentTest').innerText = "No Current Test Data.";
      }

      // Previous Tests
      const tableBody = document.querySelector('#previousTestsTable tbody');
      tableBody.innerHTML = "";
      data.previousTests.forEach(test => {
        let row = `<tr><td>${test.testName}</td><td>${test.marks}</td><td>${test.date}</td></tr>`;
        tableBody.innerHTML += row;
      });

      // Show Profile Card
      document.getElementById('loaderOverlay').classList.add('fade-out');
      document.querySelector('.profile-card').style.display = 'block';
    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch data.");
    });
}
