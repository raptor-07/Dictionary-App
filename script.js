function fetchData(searchWord){
fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
.then((data)=>{
    resetPage();
    return(data.json());
})
.then((data)=>{
    extractData(data[0]);
})
.catch((e)=>{
    console.log(`There has been some error`);
})
;
}

function extractData(valueData){
    console.log(valueData);

    injectData(valueData.word, valueData.phonetic, valueData.phonetics, valueData.meanings, valueData.sourceUrls);
}

function injectData(word, phonetic,  phonetics, meanings, sourceUrl){
    //console.log(word, phonetic, phonetics, meanings, sourceUrl);

    if(phonetic == undefined){
        phonetic = phonetics[1].text;
    }
    let titleSection = document.querySelector('.title');

    
    let meaningsSection = document.querySelector('.meanings');

    
    let sourceSection = document.querySelector('.source');


    //build title html
    
    audioUrl1 = '';
    if(phonetics[0] != undefined){
        audioUrl1 = phonetics[0].audio.replace(/"/g,'');
    }
    audioUrl2 = '';
    if(phonetics[1] != undefined){
        audioUrl2 = phonetics[1].audio.replace(/"/g,'');
    }
    if(audioUrl1 == undefined){
        audioUrl1 = ''
    }
    if(audioUrl2 == undefined){
        audioUrl2 = ''
    }
    let titleHtml = 
    `<h2 class="title_word">${word}</h2>
    <p class="purpleText--phonetic">${phonetic}</p>
    <img src="/assests/images/icon-play.svg" alt="" class="audioClicker">
    <audio class="audioButton">
    <source src="${audioUrl1}" type="audio/mpeg">
    <source src="${audioUrl2}" type="audio/mpeg">
    </audio>`

    //build meanings html
    let meaningsHtml = '';
    meanings.forEach(element => {
        let synonym = element.synonyms[0];
        if(synonym == undefined){
            synonym = '-';
        }
        meaningsHtml += 
        `<section class="${element.partOfSpeech}">
        <p class="boldHead">${element.partOfSpeech}</p>
        <p class="greyText">
            <ul>
                <li>
                    <p>${element.definitions[0].definition}</p>
                </li>
            </ul>
        </p>
        <p class="greyText inlineClass">
        ${'Synonyms'}

            <a class="synonymLink purpleText--bold"
              href="#" style="cursor: pointer;">
            ${synonym}
            </a>
            
        </p>
    </section>`;
    });

    //build source html
    sourceUrl = sourceUrl[0];
    sourceUrl = sourceUrl.replace(/"/g,'');
    let sourceHtml =
    `<p class="greyText">${'sources: '}<a href="" class="sourceLInk"></a>${sourceUrl}</p>`
    ;

    //inject html through DOM
    titleSection.insertAdjacentHTML('beforeend', titleHtml);
    meaningsSection.insertAdjacentHTML('beforeend', meaningsHtml);
    sourceSection.insertAdjacentHTML('beforeend', sourceHtml);
    attachEventListers();
}

function attachEventListers(){
    
    //event listener for audio 
    document.querySelector('.audioClicker').addEventListener('click', function (){
        document.querySelector('.audioButton').play();
    });
    
    //event listener for synonym
    const synoArray = document.getElementsByClassName('synonymLink');

    Array.from(synoArray).forEach(function (element){
        if(element.textContent !== '-'){
            element.addEventListener('click', function (){
                fetchData(element.textContent);
            })
        }
    });
}

const searchOnClick = document.querySelector('.searchInput');

function resetPage(){
    
    document.querySelector('.title').innerHTML = '';
    document.querySelector('.meanings').innerHTML = '';
    document.querySelector('.source').innerHTML = '';

    document.querySelector('.default').classList.add('off');

}
searchOnClick.addEventListener('click', function (e){
        const searchWord = document.querySelector('.searchBar').value;

        if(searchWord == '' || null || undefined){
            console.error('input field is empty');
        }
        else{
            fetchData(searchWord);
        } 
});


