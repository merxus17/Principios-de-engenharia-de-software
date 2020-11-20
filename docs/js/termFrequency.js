stopWordLoaded = false;
textLoaded = false;

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
        console.log(textFromFileLoaded)
        //$("#fileTextArea").val(textFromFileLoaded);
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
        console.log(textFromFileLoaded)
        //$("#stopWordsTextArea").val(textFromFileLoaded);
        stopWordLoaded = true
    }
  
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function parseFile()
{   
    //window.alert("testando")
    var text = $("#fileTextArea").val();
    //console.log(typeof(text))
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
    var outputText = "";
    var n = 0;

    $("#outputTextArea").val("");
    for (word of sortedWords){
        if(n < 25)
        {
            //console.log(word.word)
            outputText = outputText +  "Palavras: " + word.word + "  => Ocorrencias: " + word.ocurrences + "\n"         
            n++;
        }
        else{
            break;
        }

    }
    $("#outputTextArea").val(outputText);
    //document.getElementById("inputTextToSave").innerHTML = text;
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
        if(textLoaded && stopWordLoaded){                   
            $("#output").show();
            parseFile();  
        }
        else{
            alert("You must upload both the Text file and Stopwords.")
        }
      
    });

})
