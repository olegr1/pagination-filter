//Wrapping code in IIFE to avoid polluting the global scope
(() => {
    const STDUENTS_PER_PAGE = 10;
    const studentListOriginal = document.querySelectorAll(".student-list > .student-item");

    let studentList;
    let pagination;
    let noMatchesMessage;

    //Add the DOM elements needed for search and pagination
    createDynamicDomElements();

    //Populate the dynamic list which the application uses
    studentList = studentListOriginal;

    //Start the code
    paginateStudentList(0);
    
    //Figure out which part of the list to show based on the selected page
    function paginateStudentList(currentPage) {

        //Calculate the total number of pages
        let pageCount = Math.ceil(studentList.length / STDUENTS_PER_PAGE);

        //Define the range of students to show based on the page number
        let studentIndexRange = {
            start: currentPage * STDUENTS_PER_PAGE,
            end: currentPage * STDUENTS_PER_PAGE + STDUENTS_PER_PAGE - 1
        }

        //Render the results
        updateView(pageCount, currentPage, studentIndexRange);
    }

    //Update the HTML page
    function updateView(pageCount, currentPage, rangeToShow) {

        //Hide all students by default
        for (let i = 0; i < studentListOriginal.length; i++) {
            studentListOriginal[i].style.display = "none";
        }

        //Show students on current page
        for (let t = 0; t < studentList.length; t++) {
            if (t >= rangeToShow.start && t <= rangeToShow.end) {
                studentList[t].style.display = "block";
            }
        }

        //Show the No matches message if there are 0 result pages
        if (pageCount === 0) {
            noMatchesMessage.style.display = "block";
        } else {
            noMatchesMessage.style.display = "none";
        }

        //(Re-)generate pagination links
        let itemsHtml = "";

        if (pageCount > 1) { 
            for (let j = 0; j < pageCount; j++) {
                let currentLinkClass = (j === currentPage) ? 'class="active"' : '';

                itemsHtml += '  <li>' +
                                    '<a ' + currentLinkClass + ' href="#">' + (j + 1) + '</a>'
                                '<li>';
            }            
        }

        pagination.innerHTML = itemsHtml;
    }


    //Look for a match for a provided string in students' names and emails
    function filterStudentList(filterString) {

        let filteredStudentList = [];

        for (let i = 0; i < studentListOriginal.length; i++) {
            let studentName = studentListOriginal[i].querySelector("h3").textContent;
            let studentEmail = studentListOriginal[i].querySelector(".email").textContent;

            if (
                studentName.toLowerCase().indexOf(filterString.toLowerCase()) > -1 ||
                studentEmail.toLowerCase().indexOf(filterString.toLowerCase()) > -1
            ) {
                filteredStudentList.push(studentListOriginal[i]);
            }
        }
        //Update the application's student list to only contain search results
        studentList = filteredStudentList;
    };

    //Create Pagination and Search DOM elemenets and add event listeners to them
    function createDynamicDomElements() {

        let page = document.querySelector(".page");

        //----------Pagination DOM elements----------//
        let paginationContainer = document.createElement("DIV");
        paginationContainer.setAttribute("class", "pagination");
        pagination = document.createElement("UL");
        paginationContainer.appendChild(pagination);
        page.appendChild(paginationContainer);

        pagination.addEventListener("click", (event) => {
            //Cancel the effect of herf="#"
            event.preventDefault();

            //If the clicked element is an anchor, parse the text inside it to number and call the pagination function
            if (event.target.tagName.toLowerCase() === "a") {
                let pageNumber = parseInt(event.target.textContent) - 1;
                paginateStudentList(pageNumber);
            }
        });

        //----------Search DOM elements----------//
        let pageHeader = document.querySelector(".page-header");
        let search = document.createElement("DIV");
        search.setAttribute("class", "student-search");
        search.innerHTML = '<input placeholder="Search for students...">' +
                           ' <button>Search</button>';
        
        pageHeader.appendChild(search);
        let searchInput = search.querySelector("input");

        search.querySelector("button").addEventListener("click", (event) => {
            //First update the studentList value and run pagination and rendering on the result
            filterStudentList(searchInput.value);
            paginateStudentList(0);
        });

        //----------No matches message----------//
        noMatchesMessage = document.createElement("DIV");
        noMatchesMessage.textContent = 'No matches found';
        page.appendChild(noMatchesMessage);
    }
})();
