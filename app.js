




const filterRelase = document.querySelector('.filter-release');

filterRelase.addEventListener('click',(e) => {
     e.target.classList.toggle('active');
})



const sortElement = document.querySelectorAll('.sort-element');

sortElement.forEach((element) => {
    element.addEventListener('click', (e) => {
        event.target.classList.add('active');

        sortElement.forEach((sortElement) => {
            if(sortElement != event.target) {
                sortElement.classList.remove('active');
            }
        })

    })
})

const filterElement = document.querySelectorAll('.filter-element');

filterElement.forEach((element) => {
    element.addEventListener('click', (e) => {
        event.target.classList.add('active');

        filterElement.forEach((filterElement) => {
            if(filterElement != event.target) {
                filterElement.classList.remove('active');
            }
        })

    })
})

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}


const button = document.querySelector('#searchButton');
const input = document.querySelector('#searchInput');
const list = document.querySelector('.result-list');



button.addEventListener('click' , (e) => {
    const filterText = document.querySelector('.filter-element.active').getAttribute('data-value');
    search(input.value,filterText);
})


let data = []



const search= (input,filterText) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTkzNzE2YTBhNTIyYjZkMmNmMGJiNDdiMGViYzFmYSIsIm5iZiI6MTY5MzI3MjA1Ni42NjgsInN1YiI6IjY0ZWQ0N2Y4NGNiZTEyMDExYjkwYzgxZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jifM-htiK2HtH7R0CWTD8Xuofku7pdvcV1rVuqiNR7U.jifM-htiK2HtH7R0CWTD8Xuofku7pdvcV1rVuqiNR7U'
        }
    };

    const apiKey = "f993716a0a522b6d2cf0bb47b0ebc1fa"

    let query;
    switch (filterText) {
        case "all":
            query = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${input}`
            break;
        case "tv":
            query = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${input}`
            break;
        case "movie":
            query = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${input}`    
            break;
    }



    

    fetch(query, options)
    .then(res => res.json())
    .then((res) => {
        list.innerHTML = "";
        data = res;
        console.log(data);
        
     const sort = document.querySelector('.sort-element.active').getAttribute('data-value');
      
     if(data.results.length == 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.classList.add('no-results'); // İsterseniz bir sınıf ekleyebilirsiniz

        // İçeriği HTML ile doldurun
        noResultsItem.innerHTML = `
            <h3 style="margin: 10px; color: #fff;">THERE IS NO RESULTS</h3>
        `;

        // Listeyi temizle ve yeni öğeyi ekle
        list.innerHTML = "";
        noResultsItem.querySelector('h3').style.margin = "10px";
        list.appendChild(noResultsItem);
         throw new Error('THERE IS NO RESULTS');
     }

     

     data.results =  data.results.filter((element) => element.poster_path ? element : null);

    const startYear = document.querySelector('.start-date').value;
    const endYear = document.querySelector('.end-date').value;

    if(startYear > endYear) {
        alert("Start year cannot be bigger than end year");
        throw new Error("Start year cannot be bigger than end year");
    }

     if(startYear != "" && endYear != "") {
        
        data.results = data.results.filter(movie => {
            const startDate = `${startYear}-01-01`;
            const endDate = `${endYear}-12-31`;
            const releaseDate = new Date(movie.release_date ? movie.release_date : movie.first_air_date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return releaseDate >= start && releaseDate <= end;
        });


     }else if (startYear != "" && endYear == "") {
        data.results = data.results.filter(movie => {
            const startDate = `${startYear}-01-01`;
            const releaseDate = new Date(movie.release_date ? movie.release_date : movie.first_air_date);
            const start = new Date(startDate);
            const end = new Date.now;
            return releaseDate >= start && releaseDate <= end;
        });
     }else if (startYear == "" && endYear != "") {
        data.results = data.results.filter(movie => {
            const endDate = `${endYear}-12-31`;
            const releaseDate = new Date(movie.release_date ? movie.release_date : movie.first_air_date);
            const end = new Date(endDate);
            return releaseDate <= end; 
        });
     }

      if(sort != "release_date") {
        data.results.sort((a,b) => b[`${sort}`] - a[`${sort}`]);
      }else {  
        data.results.sort((a, b) => new Date(b.release_date ? b.release_date : b.first_air_date.split('').reverse().join('')) - new Date(a.release_date ? a.release_date : a.first_air_date.split('').reverse().join('')));
      }

       data.results.forEach(element => {
       
        if (element != null) {

            const date = formatDate(new Date(element.release_date ? element.release_date :  element.first_air_date));

            const text = `
            <li class="result-element p-3">
                    <div class="row" style="gap: 15px;">
                        <div class="col-md-2">
                            <div class="movie-img">
                                <img src="https://image.tmdb.org/t/p/original/${element.poster_path}" alt="">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column movie-att h-100 align-items-start justify-content-center" style="gap: 5px;">
                                <h4>${element.title ? element.title : element.name}</h4>
                                <p><span>Ratings : </span> <span> ${element.vote_average}</span></p>
                                <p><span>Vote Count : </span> <span> ${element.vote_count} </span></p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="detail ms-auto me-5 d-flex align-items-center h-100">
                                <button class="primary-button" type="button" data-bs-toggle="collapse" href="#multiCollapseExample${element.id}" role="button" aria-expanded="false" aria-controls="multiCollapseExample1" style="height: 50px; padding: 15px;">
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="collapse multi-collapse detail-div" id="multiCollapseExample${element.id}">
                                        <div>
                                           <div>
                                                <span class="detail-span">Overview :</span>
                                                <p>
                                                    ${element.overview}
                                                </p> 
                                           </div>
                                           <div>
                                                <span class="detail-span">Language :</span>
                                                <span>
                                                    ${element.original_language}
                                                </span> 
                                           </div>
                                           <div>
                                                <span class="detail-span">
                                                    Popularity : 
                                                </span>
                                                <span>
                                                    ${element.popularity}
                                                </span>
                                           </div>
                                           <div>
                                            <span class="detail-span">
                                                Release Date : 
                                            </span>
                                            <span>${date}</span>
                                           </div>
                                        </div>
                    </div>
                </li>
         `;

         //let node = document.createTextNode(text);
         list.innerHTML += text;
        }

        
         
       });
        

    })
    .catch(err => console.error(err));

}