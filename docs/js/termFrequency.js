stopWordLoaded = false;
textLoaded = false;

function removeStopWords(wordMap){
    var text = $("#stopWordsTextArea").val();
    var stopWords =  extractWords(text, false);
    for(word of stopWords){
        wordMap.delete(word);
    }   
    return wordMap
}


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
        word = word.replace(";", "")
        word = word.trim()
        words[index] = word.toLowerCase()

    }
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
    return wordFrequencies;


}

function sort(wordFrequencies)
{
    let array = Array.from(wordFrequencies).map(([word, ocurrences]) => ({word, ocurrences}))
    var sorted = array.sort(function(a,b) { return b.ocurrences - a.ocurrences})
    return sorted
}

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
    output = frequencies(extractWords(text, true))
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
