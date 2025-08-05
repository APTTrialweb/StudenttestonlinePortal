const urlParams = new URLSearchParams(window.location.search);
const secretCode = urlParams.get('code');

if (!secretCode) {
  alert("Invalid QR Code URL!");
} else {
  fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?code=${secretCode}`)
    .then(response => response.json())
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
    })
    .catch(error => {
      console.error(error);
      alert("Failed to fetch data.");
    });
}
