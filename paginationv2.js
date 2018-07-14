// Add div for paginate buttons
document.getElementsByClassName('student-list')[0]
  .innerHTML += `<div id="paginate-buttons"></div>`;
// Adds text for no results found
document.getElementsByClassName('student-list')[0]
  .innerHTML += `<h2 id="no-results">No Results Found</h2>`;
// Add html for student search bar
document.getElementsByClassName('page-header')[0]
  .innerHTML += `<div class="student-search">
                   <input placeholder="Search for students...">
                   <button>Search</button>
                 </div>`

// Select needed elements
const allStudents = Object.values(document.getElementsByClassName('student-item'));
const paginateButtons = document.getElementById('paginate-buttons');
const searchField = document.querySelector('input');
const searchButton = document.querySelector('button');
const noResults = document.getElementById('no-results');
// Initialize searchResults as an empty array for later use
let searchResults = [];
noResults.style.display = "none";

// Hides all students
const clearResults = () => {
  allStudents.forEach(student => student.style.display = "none");
}

// Hides all students then reveals only the students selected in results
const renderResults = (pageNum, results) => {
  clearResults();
  let min = 10 * (pageNum - 1);
  let pageResults = (results.length > 10)
                      ? results.slice(min, min + 10)
                      : results;
  pageResults.forEach(result => result.style.display = "block");
}

// Render html for paginate buttons
const renderPaginateButtons = (results) => {
  // Clear any extant buttons
  paginateButtons.innerHTML = '';
  // Max # of results pages = # of results / 10, rounded up
  const maxPage = Math.ceil(results.length / 10);
  // pageNums = [0,1,2, ...maxPage]
  const pageNums = [...Array(maxPage).keys()];
  // Add HTML for paginate buttons
  pageNums.forEach(page => paginateButtons.innerHTML +=
    `<button class="paginate-button"> ${page + 1} </button>`)
}

// Paginate results when paginate buttons are clicked
paginateButtons.addEventListener("click", e => {
  // Checks if target is valid paginate button
  if (e.target.className === 'paginate-button') {
    // Renders either search results only or all student records
    (searchResults.length)
      ? renderResults(e.target.innerText, searchResults)
      : renderResults(e.target.innerText, allStudents);
}});

// Filter results live as query is typed into search field
searchField.addEventListener('keyup', e => {
  const query = e.target.value;
  searchStudents(query);
});

// Filter results when search button is clicked
searchButton.addEventListener('click', e => {
  const query = searchField.value;
  searchStudents(query);
});

// Filter displayed results based on search query
searchStudents = query => {
  // Reset searchResults to empty array for new search
  searchResults = [];
  // Hide noResults if it was showing
  noResults.style.display = "none";
  // Lowercase query for ease of comparison
  query = query.toLowerCase();
  allStudents.forEach(student => {
    // Parse student name from student element and lowercase for ez comparison
    let studentName = student.querySelector('h3').innerText.toLowerCase();
    // If the search query appears anywhere in the student's name,
    // add that student to the search results
    if (studentName.includes(query)) {
      searchResults.push(student)
    }})
  // If there are search results, render the search results and paginate buttons
  if (searchResults.length) {
    renderResults(1, searchResults);
    renderPaginateButtons(searchResults);
  // If there are no results, clear results/buttons and show "No results found"
  } else {
    clearResults();
    renderPaginateButtons([]);
    noResults.style.display = "block";
  }
}

// Shows first page of all student records on page load
window.onload = () => {
  renderResults(1, allStudents);
  renderPaginateButtons(allStudents);
}
