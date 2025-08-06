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

      // Utility function to format date as DD/MM/YYYY
      function formatDate(dateString) {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // Populate Student Info
      document.getElementById('studentName').innerText = data.student.name;
      document.getElementById('profilePhoto').src = data.student.profilePhoto;
      document.getElementById('batch').innerText = `Batch: ${data.student.batch}`;

      // Live Test Data
      if (data.currentTest) {
        const formattedLiveTestDate = formatDate(data.currentTest.date);
        document.getElementById('currentTest').innerText = `${data.currentTest.testName} - ${data.currentTest.marks} Marks (${formattedLiveTestDate})`;
      } else {
        document.getElementById('currentTest').innerText = "No Current Test Data.";
      }

      // Previous Tests Table
      let tableBody = document.querySelector('#previousTestsTable tbody');
      tableBody.innerHTML = "";  // Clear existing rows

      data.previousTests.forEach(test => {
        const formattedDate = formatDate(test.date);
        let row = `<tr><td>${test.testName}</td><td>${test.marks}</td><td>${formattedDate}</td></tr>`;
        tableBody.innerHTML += row;
      });

      // Hide Loader and Show Profile Card
      document.getElementById('loaderOverlay').classList.add('fade-out');
      document.querySelector('.profile-card').style.display = 'block';
    })
    .catch(error => {
      console.error(error);
      alert("Failed to fetch data.");
    });
}
