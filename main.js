 
function init(){ 
    
    try {
        window.recognition = new webkitSpeechRecognition();
    } catch (error) {
        alert("your browser doesn't support SpeechRecognition!");        
    }
  

    recognition.continuous = true;
    recognition.maxAlternatives = 40;
    
    recognition.lang = "en-US";

    let html = "";
    COMMANDS.forEach( c => html += "<li>" + c.example + "</li>" );
    document.getElementById("known-commands").innerHTML = html;
}

setTimeout( init, 200 );


const stopwords = {
    'en-US': ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'],
    'ro-RO': ["acea","aceasta","această","aceea","acei","aceia","acel","acela","acele","acelea","acest","acesta","aceste","acestea","aceşti","aceştia","acolo","acord","acum","ai","aia","aibă","aici","al","ăla","ale","alea","ălea","altceva","altcineva","am","ar","are","aş","aşadar","asemenea","asta","ăsta","astăzi","astea","ăstea","ăştia","asupra","aţi","au","avea","avem","aveţi","azi","bine","bucur","bună","ca","că","căci","când","care","cărei","căror","cărui","cât","câte","câţi","către","câtva","caut","ce","cel","ceva","chiar","cinci","cînd","cine","cineva","cît","cîte","cîţi","cîtva","contra","cu","cum","cumva","curând","curînd","da","dă","dacă","dar","dată","datorită","dau","de","deci","deja","deoarece","departe","deşi","din","dinaintea","dintr-\tdintre","doi","doilea","două","drept","după","ea","ei","el","ele","eram","este","eşti","eu","face","fără","fata","fi","fie","fiecare","fii","fim","fiţi","fiu","frumos","graţie","halbă","iar","ieri","îi","îl","îmi","împotriva","în","înainte","înaintea","încât","încît","încotro","între","întrucât","întrucît","îţi","la","lângă","le","li","lîngă","lor","lui","mă","mai","mâine","mea","mei","mele","mereu","meu","mi","mie","mîine","mine","mult","multă","mulţi","mulţumesc","ne","nevoie","nicăieri","nici","nimeni","nimeri","nimic","nişte","noastră","noastre","noi","noroc","noştri","nostru","nouă","nu","opt","ori","oricând","oricare","oricât","orice","oricînd","oricine","oricît","oricum","oriunde","până","patra","patru","patrulea","pe","pentru","peste\tpic","pînă","poate","pot","prea","prima","primul","prin","puţin","puţina","puţină","rog","sa","să","săi","sale","şapte","şase","sau","său","se","şi","sînt","sîntem","sînteţi","spate","spre","ştiu","sub","sunt","suntem","sunteţi","sută","ta","tăi","tale","tău","te","ţi","ţie","timp","tine","toată","toate","tot","toţi","totuşi","trei","treia","treilea","tu","un","una","unde","undeva","unei","uneia","unele","uneori","unii","unor","unora","unu","unui","unuia","unul","vă","vi","voastră","voastre","voi","voştri","vostru","vouă","vreme","vreo","vreun","zece","zero","zi","zice"],
}


function start(){

    document.getElementById("mic-png").style.display = 'inline';
    document.getElementById("bStart").style.display = 'none';
    document.getElementById("bStop").style.display = 'inline';

    recognition.onresult = function(event) { 
        
        console.log(event.results[0]);
        let bestGuess = calculateProba(event.results[0]);
        console.log(bestGuess);

        displayResult(bestGuess);
        findParameters(bestGuess);

        stop();
    }
    recognition.start();
}
 

function calculateProba( results ){  
    let max = { probability:0 }; 

    for(let i of Object.keys(results)){
        let prediction = results[i];
        let proba = analyse(prediction.transcript);
        if(proba.probability > max.probability){
            max = proba;
        } 
    }  
    return max;
}

function analyse( text ){
     
    let words = text.split(" ");
    let results = [];

    COMMANDS.forEach(command => {

        let probability = 0; 

        for(let kw of command.keyWords[recognition.lang]){
            if( words.indexOf(kw) != -1 ){ 
                probability += 10;
            } 
        }
        
        results.push({
            words: words,
            command: command,
            probability: probability
        })
    });

    results.sort((a,b)=>{return b.probability - a.probability}); 
    return results[0];
}

function displayResult(result){ 
    try{
        document.getElementById("text").value = result.command.example;
    } catch (err) {
        console.error(err);
    }
}

function findParameters(guess){
      
    let remainingWords = guess.words
        .filter(w => stopwords[recognition.lang].indexOf(w) == -1)
        .filter(w => guess.command.keyWords[recognition.lang].indexOf(w) == -1);
 
    let params = [];

    for( let param of guess.command.parameters ){
         
        for(let i=0; i<remainingWords.length; i++){
            let word = remainingWords[i];

            if( (param == Type.NUMBER && ! isNaN(word)) || param == Type.TEXT ){
                params.push(word);  
                remainingWords.splice( i,1 ); 
            }
        } 
    }
   
    document.getElementById("params").value = params.join(", ");
}

function changeLanguage(lang, code){

    document.getElementById("selected-language").innerText = lang;
    recognition.lang = code;

}

function stop(){
    recognition.stop();
    document.getElementById("bStart").style.display = "inline";
    document.getElementById("bStop").style.display = "none";
    document.getElementById("mic-png").style.display = 'none';
}