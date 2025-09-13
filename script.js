const urlParams = new URLSearchParams(window.location.search);
const secretCode = urlParams.get('code');

if (!secretCode) {
  alert("Invalid QR Code URL!");
} else {
  fetch(`https://script.google.com/macros/s/AKfycbw1r1xAIowX_6S4RNWtKBvr89dc_duG9C4OqavxCja1uux-0M9oZ09XFWyk_zfuw226wQ/exec?code=${secretCode}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Function to format date as DD/MM/YYYY
      function formatDate(dateString) {
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // Function to convert Google Drive link to direct image link
      function getDirectDriveLink(driveUrl) {
        if (!driveUrl) return "";
        let fileIdMatch = driveUrl.match(/[-\w]{25,}/); // Extract file ID
        if (fileIdMatch) {
          return `https://drive.google.com/uc?export=view&id=${fileIdMatch[0]}`;
        }
        return driveUrl; // Already a direct link
      }

      // Fill Student Info
      document.getElementById('studentName').innerText = data.student.name;

      // Profile Photo (Drive link handled + fallback)
      const photoUrl = getDirectDriveLink(data.student.profilePhoto);
      document.getElementById('profilePhoto').src = photoUrl || "https://via.placeholder.com/120?text=No+Photo";

      document.getElementById('batch').innerText = `Batch: ${data.student.batch}`;

      // Handle Current Test (Latest Test)
      if (data.currentTest && data.currentTest.testName && data.currentTest.date) {
        const liveTestDate = formatDate(data.currentTest.date);
        document.getElementById('currentTest').innerText = `${data.currentTest.testName} - ${data.currentTest.marks} Marks (${liveTestDate})`;
      } else {
        document.getElementById('currentTest').innerText = "No Current Test Data.";
      }

      // Handle Previous Tests
      const tableBody = document.querySelector('#previousTestsTable tbody');
      tableBody.innerHTML = "";  // Clear table before filling

      data.previousTests.forEach(test => {
        const prevTestDate = formatDate(test.date);
        let row = `<tr><td>${test.testName}</td><td>${test.marks}</td><td>${prevTestDate}</td></tr>`;
        tableBody.innerHTML += row;
      });

      // Loader OFF & Show Profile Card
      document.getElementById('loaderOverlay').classList.add('fade-out');
      document.querySelector('.profile-card').style.display = 'block';
    })
    .catch(error => {
      console.error(error);
      alert("Failed to fetch data.");
    });
}
