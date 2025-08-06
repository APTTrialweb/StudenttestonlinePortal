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

      document.getElementById('studentName').innerText = data.student.name;
      document.getElementById('profilePhoto').src = data.student.profilePhoto;
      document.getElementById('batch').innerText = `Batch: ${data.student.batch}`;

      if (data.currentTest) {
        document.getElementById('currentTest').innerText = `${data.currentTest.testName} - ${data.currentTest.marks} Marks`;
      } else {
        document.getElementById('currentTest').innerText = "No Current Test Data.";
      }

      let tableBody = document.querySelector('#previousTestsTable tbody');
      data.previousTests.forEach(test => {
        let row = `<tr><td>${test.testName}</td><td>${test.marks}</td><td>${test.date}</td></tr>`;
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

// Dropdown Toggle Logic
document.addEventListener("DOMContentLoaded", function() {
  const toggle = document.getElementById('prevTestsToggle');
  const content = document.getElementById('prevTestsContent');

  toggle.addEventListener('click', () => {
    content.style.display = (content.style.display === 'none' || content.style.display === '') ? 'block' : 'none';
    toggle.classList.toggle('open');
  });
});

// Download Performance Report Button Logic
document.getElementById('downloadReportBtn').addEventListener('click', function() {
  const reportURL = `https://script.google.com/macros/s/AKfycbzbKMhUT1r2R_xSuFSYSjrH8inOy4TW9wY6AP4RzMcL7vBz7biftVNiEgiNdDfHiy8XEw/exec?code=${secretCode}`;

  fetch(reportURL)
    .then(response => response.text())
    .then(fileId => {
      if (fileId.length > 10) {  // Assume it's a valid File ID
        const directDownloadURL = `https://drive.google.com/uc?export=download&id=${fileId}`;
        window.location.href = directDownloadURL;  // This will trigger file download
      } else {
        alert('Failed to Generate Report: ' + fileId);
      }
    })
    .catch(error => {
      console.error(error);
      alert("Error Generating Report.");
    });
});
