stopWordLoaded = false;
textLoaded = false;

function removeStopWords(wordMap){
    var text = $("#stopWordsTextArea").val();
    var stopWords =  extractStopWords(text, ',');
    for(word of stopWords){
        wordMap.delete(word);
    }   
    return wordMap
}

function extractStopWords(file, separator){
    var words = file.split(separator)
    
    for ([index,word] of words.entries()){
        word = word.replace(",", "")
        word = word.replace(".", "")
        word = word.replace("!", "")
        word = word.replace("?", "")
        word = word.replace("(", "")
        word = word.replace(")", "")
        word = word.replace("´", "")
        word = word.replace("`", "")
        word = word.replace(";", "")
        word = word.replace(":", "")
        word = word.replace('"', "")
        word = word.replace("'", "")
        word = word.trim()
        words[index] = word.toLowerCase()
    }
    return words;

}


// funcao que recebe um arquivo e extrai as palavras delete
// in: file = o arquivo de entrada contendo as palavras a serem contadas
// out: words = a lista de palavras contidas nesse arquivo
function extractWords(file, stopWord){
    var words = file.split(/\s+/)
    if(words.length < 25 && stopWord){
        window.alert("OMG! Less than 25 words! I QUIT!");
        throw new Error("Not enough words");
    }

    for ([index,word] of words.entries()){
        word = word.replace(",", "")
        word = word.replace(".", "")
        word = word.replace("!", "")
        word = word.replace("?", "")
        word = word.replace(":", "")
        word = word.replace("´", "")
        word = word.replace("`", "")
        word = word.replace("(", "")
        word = word.replace(")", "")
        word = word.replace(";", "")
        word = word.replace('"', "")
        word = word.replace("'", "")
        word = word.trim()
        words[index] = word.toLowerCase()

    }
    return words;

}

// funcao que recebe lista de palavras da entrada e conta a frequencia delas
// in: wordList  = lista de palavras da entrada
// out: wordFrequencies = mapa de frequencia de cada palavra
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
    return wordFrequencies;


}

// funcao que recebe o mapa de frequencias por palavra e ordena as frequencias
// in: wordFrequencies = mapa de frequencia de cada palavra
// out: sorted = array ordenado de frequencias de palavras
function sort(wordFrequencies)
{
    let array = Array.from(wordFrequencies).map(([word, ocurrences]) => ({word, ocurrences}))
    var sorted = array.sort(function(a,b) { return b.ocurrences - a.ocurrences})
    return sorted
}

// funcao que carrega o arquivo do documento como um arquivo de texto
function loadFileAsText(){

    var fileToLoad = document.getElementById("fileToLoad").files[0];
    
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        $("#fileTextArea").val(textFromFileLoaded);
        textLoaded = true;
    }
    
    fileReader.readAsText(fileToLoad, "UTF-8");
}

// funcao que carrega o arquivo com a lista de palavras ignoradas como um aruqivo de texto
function loadStopWordsAsText(){

    var fileToLoad = document.getElementById("stopWordsToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //document.getElementById("inputTextToSave").innerHTML = textFromFileLoaded;
        $("#stopWordsTextArea").val(textFromFileLoaded);
        stopWordLoaded = true
    }
  
    fileReader.readAsText(fileToLoad, "UTF-8");
}

// funcao que interpreta a entrada e gera a saida para o usuario
function parseFile()
{
    var text = $("#fileTextArea").val();
    if(typeof text != 'string')
    {
        window.alert("I need a string! I quit!");
        throw new Error("Not a String");
    }
    if(text.length < 1){
        window.alert("I need a non-empty string! I quit!");
        throw new Error("String Empty");
    }
    output = frequencies(extractWords(text))
    output = removeStopWords(output);
    var sortedWords = sort(output)
    var outputText = "";
    var n = 0;

    $("#outputTextArea").val("");
    for (word of sortedWords){
        if(n < 25)
        {
            outputText = outputText +  "Palavras: " + word.word + "  => Ocorrencias: " + word.ocurrences + "\n"         
            n++;
        }
        else{
            break;
        }

    }
    $("#outputTextArea").val(outputText);
}

//Events
$().ready(function(){
    //Upload text files
    $("#fileToLoad").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        if(fileName.indexOf(".txt")>0){
            $(this).siblings("#fileToLoadLabel").addClass("selected").html(fileName);
            $("#uploadTextFile").attr("disabled", false);
        }
        else{
            alert("File must be txt format");
        }      

    });

    $("#uploadTextFile").on("click", function() {
        loadFileAsText();
    });


    //Upload stopwords file
    $("#stopWordsToLoad").on("change", function() {
        var stopWordsName = $(this).val().split("\\").pop();
        if(stopWordsName.indexOf(".txt")>0){
            $(this).siblings("#stopWordsLabel").addClass("selected").html(stopWordsName);
            $("#uploadStopWordsFile").attr("disabled", false);
        }
        else{
            alert("File must be txt format");
        }      

    });

    $("#uploadStopWordsFile").on("click", function() {
        loadStopWordsAsText();
    });


    $("#parseFile").on("click",function(){
        text =  $("#fileTextArea").val().split(/\s+/);
        if(textLoaded && stopWordLoaded){                   
            if(text.length > 25){
                $("#output").show();
                parseFile(); 
            }       
            else{
                alert("OMG! Less than 25 words! I QUIT!")
            }     
        }
        else{
            alert("You must upload both the Text file and Stopwords.")
        }
      
    });

})
