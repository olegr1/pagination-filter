//Wrapping code in IIFE to avoid polluting the global scope
(()=> {

    const STDUENTS_PER_PAGE = 10; 
    const studentListOriginal = document.querySelectorAll(".student-list > .student-item");    

    let studentList;
    let pagination;
    let noMatchesMessage;

    //Get things ready
    const init = () => {      

        //Add the DOM elements needed for search and pagination
        createDynamicDomElements();        

        //Populate the list which the application uses        
        studentList = studentListOriginal;

        paginateStudentList();    
    }

    //Look for a match for a provided string in students' names and emails
    const filterStudentList = (filterString) => {

        let filteredStudentList = [];

        for(let i = 0; i < studentListOriginal.length; i++){
            let studentName = studentListOriginal[i].querySelector("h3").textContent;
            let studentEmail = studentListOriginal[i].querySelector(".email").textContent;

            if(
                studentName.toLowerCase().indexOf(filterString.toLowerCase()) > -1 ||
                studentEmail.toLowerCase().indexOf(filterString.toLowerCase()) > -1
            ){
                filteredStudentList.push(studentListOriginal[i]);
            }               
        }
        //Update the application's student list to only contain search results
        studentList = filteredStudentList;                  
    };

    //Figure out which part of the list to show based on the selected page
    const paginateStudentList = (currentPage) => {

        let currPage = currentPage || 0;        
        let listLength = studentList.length;

        //Calculate the total number of pages
        let pageCount = Math.ceil(studentList.length / STDUENTS_PER_PAGE);

        //Define the range of students to show based on the page number 
        let currPageItemIndexRange = {
            start: 0,
            end: 0
        }
        currPageItemIndexRange.start = currPage * STDUENTS_PER_PAGE;
        
        let lastItemIndex = currPage * STDUENTS_PER_PAGE + STDUENTS_PER_PAGE;

        if(lastItemIndex < listLength - 1){
            currPageItemIndexRange.end = lastItemIndex - 1;
        }else{
            currPageItemIndexRange.end = currPageItemIndexRange.start + STDUENTS_PER_PAGE - 1;
        }

        //Give the results to the rendering function
        updateView(pageCount, currPage, currPageItemIndexRange);
    }

    //Update the layout based on the data from paginateStudentList
    const updateView = (pageCount, currentPage, rangeToShow) => {

        //Make all students hidden by default
        for(let i = 0; i < studentListOriginal.length; i++) {
            studentListOriginal[i].style.display = "none";
        }
        
        //Show students on current page
        for(let t = 0; t < studentList.length; t++) {          
            
            if(t >= rangeToShow.start && t <= rangeToShow.end){
                studentList[t].style.display = "block";
            }
        }

        if(pageCount === 0) {
            noMatchesMessage.style.display = "block";
        }else{
            noMatchesMessage.style.display = "none";
        }

        //Generate pagination links
        let itemsHtml = "";

        for (let t = 0; t < pageCount; t++){
            let currentLinkClass = (t === currentPage) ? 'class="active"' : '';
            
            itemsHtml += '  <li>' +
                                '<a ' + currentLinkClass + ' href="#">' + (t + 1) + '</a>'
                            '<li>'; 
        }

        pagination.innerHTML = itemsHtml;        
    }

    //Generate pagination and search DOM elemenets and add event listeners to them
    const createDynamicDomElements = () => {

        let page = document.querySelector(".page");

        //----------Pagination DOM elements----------//        
        let paginationContainer = document.createElement("DIV");
        paginationContainer.setAttribute("class", "pagination");

        pagination = document.createElement("UL");
        paginationContainer.appendChild(pagination); 
        page.appendChild(paginationContainer);

        pagination.addEventListener("click", (event)=>{
            //Cancel the effect of herf="#" (it scrolls to the top of the page)
            event.preventDefault();

            //If the clicked element is an anchor, parse the text inside it to number,
            //then pass to the function to show the appropriate page
            if(event.target.tagName.toLowerCase() === "a"){
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
                            search
        pageHeader.appendChild(search);   
        let searchInput = search.querySelector("input");

        search.querySelector("button").addEventListener("click", (event)=>{
            filterStudentList(searchInput.value);     
            paginateStudentList(0);              
        });

        //----------No matches message----------//
        noMatchesMessage = document.createElement("DIV");
        noMatchesMessage.textContent = 'No matches found';        
        page.appendChild(noMatchesMessage);

    }   

    init();  

})();






