

// function  removeStopWord(wordList){
//     // assert(type(wordList) is list), "I need a list! I quit!"

//     // with open('./stopWord.txt') as f:
//     //     stopWord = f.read().split(',')
    
//     // stopWord.extend(list(string.ascii_lowercase))
//     // return [w for w in wordList if not w in stopWord]
// }

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function extractWords(file){
    var words = file.split(/\s+/)
    if(words.length < 25){
        window.alert("OMG! Less than 25 words! I QUIT!");
        throw new Error("Not enough words");
    }

    for ([index,word] of words.entries()){
        word = word.replace(",", "")
        word = word.replace(".", "")
        word = word.replace("!", "")
        word = word.replace("?", "")
        word = word.replace(";", "")
        word = word.trim()
        words[index] = word.toLowerCase()

    }
    console.log(words)
    return words;

}

function frequencies(wordList){
    var wordFrequencies = new Map();
    for (word of wordList){
        nOcorrencias = wordFrequencies.get(word);
        if(nOcorrencias == undefined)
        {
            wordFrequencies.set(word, 1);
        }
        else{
            wordFrequencies.set(word, nOcorrencias+1);
        }
    }
    //console.log(wordFrequencies);
    return wordFrequencies;


}

function sort(wordFrequencies)
{
    //     assert(type(wordFrequencies) is dict), "I need a dictionary! I quit!"
    //     assert(wordFrequencies != {}), "I need a non-empty dictionary! I quit!"
    
    //     return sorted(wordFrequencies.items(), key=operator.itemgetter(1), reverse=True)
    console.log(typeof(wordFrequencies))
    let array = Array.from(wordFrequencies).map(([word, ocurrences]) => ({word, ocurrences}))
    var sorted = array.sort(function(a,b) { return b.ocurrences - a.ocurrences})
    console.log(sorted)
    return sorted
}

function loadFileAsText(){

    var fileToLoad = document.getElementById("fileToLoad").files[0];
    
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //document.getElementById("inputTextToSave").innerHTML = textFromFileLoaded;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;
    }
  
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function parseFile()
{   
    //window.alert("testando")
    var text = document.getElementById("inputTextToSave").value
    console.log(typeof(text))
    if(typeof text != 'string')
    {
        window.alert("I need a string! I quit!");
        throw new Error("Not a String");
    }
    if(text.length < 1){
        window.alert("I need a non-empty string! I quit!");
        throw new Error("String Empty");
    }
    //console.log(text.length)
    //window.alert(text.length)
    output = frequencies(extractWords(text))
    var sortedWords = sort(output)
    var element = document.getElementById("inputTextToSave");
    var n = 0
    for (word of sortedWords){
        if(n < 25)
        {
            console.log(word.word)
            var text = document.createTextNode("Palavras: " + word.word + "  => Ocorrencias: " + word.ocurrences);
            var br = document.createElement("br");
            element.appendChild(text);
            element.appendChild(br);
            n++;
        }
        else{
            break;
        }

    }
    //document.getElementById("inputTextToSave").innerHTML = text;
}