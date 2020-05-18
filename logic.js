window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();
//Init speech sytenthesis
const message = new SpeechSynthesisUtterance();


//Runs translation
function onSpeak(e) {
    let language1 = document.querySelector('#player-1-voices').value
    const firstlanguage = language1.slice(-5, -3).toLowerCase()
    let language2 = document.querySelector('#player-2-voices').value
    const secondlanguage = language2.slice(-5, -3).toLowerCase()
    const spokenmessage = e.results[0][0].transcript;
    translate(spokenmessage, firstlanguage, secondlanguage);
    return spokenmessage
}

//Set text
function setTextMessage(input) {
    message.text = input
}
//Speak text
function speakText() {
    speechSynthesis.speak(message)
}

//Pulls translation API and feeds to on speak to record
function translate(message, firstlanguage, secondlanguage) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
        "method": "POST",
        "headers": {
            "x-rapidapi-host": "google-translate1.p.rapidapi.com",
            "x-rapidapi-key": "9d23a098c0mshffb86547dfcfa5ap17bf84jsn411163bf9f70",
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "source": firstlanguage,
            "q": message,
            "target": secondlanguage
        }
    }
    //Pulls api and translates
    $.ajax(settings).done(function (response) {
        const outcome = response.data.translations[0].translatedText
        $('#msg').html(`<div>${outcome}</div>`)
        $('#msg-transcript').append(`
        <li class="translation">${outcome}</li>
        <li class="original">${message}</li>`)
        console.log(outcome)
        setTextMessage(outcome);
        speakText()
    })
};
// }

//Function to start recording
function startRecording() {
    recognition.start()

}
//On button click, then recording starts
$('.btn-start').on('mousedown', startRecording)
//Once recording is complete ("result"), then translation occurs
recognition.addEventListener('result', onSpeak);


let player_1_voices = [];

//Grabs voices from API & stores into options for user to select from
function getVoices() {
    player_1_voices = speechSynthesis.getVoices()
    player_1_voices.forEach(voice => {
        const option1 = document.createElement('option')
        option1.setAttribute("id", voice.lang);
        option1.value = voice.lang;
        option1.innerHTML = `${voice.name} ${voice.lang}`
        $('.voices').append(option1)
    })
    document.querySelector('#player-1-voices').value = document.querySelector('#player-1-voices')[3].value;
    document.querySelector('#player-2-voices').value = document.querySelector('#player-1-voices')[6].value;
}

//Event listener for when voice options are changed & default getVoices is called for when doc is loaded
speechSynthesis.addEventListener('voiceschanged', getVoices)

function swap() {
    let language1 = document.querySelector('#player-1-voices').value
    let language2 = document.querySelector('#player-2-voices').value
    var language1_trim = language1.slice(-2).toLowerCase()
    var language2_trim = language2.slice(-2).toLowerCase()
    document.querySelector('#player-1-voices').value = language2;
    document.querySelector('#player-2-voices').value = language1;
    setTimeout(() => {
        document.body.style.background = `var(--${language1_trim})` ? document.body.style.background = `var(--${language2_trim})` :
            document.body.style.background = `var(--${language1_trim})`
    }, 2000)
}
recognition.addEventListener('end', swap)
$('.icon-swap').on('click', swap)


//Dynamic change backgrounds on user select before firing of functions
$('#player-1-voices').on('change', () => {
    document.body.style.background = `var(--${document.querySelector('#player-1-voices').value.slice(-2).toLowerCase()})`
})

$(document).on('change', () => {
    document.querySelector('#player-1-voices').value === document.querySelector('#player-2-voices').value ? document.querySelector('#caution1').classList.remove('visibility') : document.querySelector('#caution2').classList.add('visibility')

    document.querySelector('#player-2-voices').value === document.querySelector('#player-1-voices').value ? document.querySelector('#caution2').classList.remove('visibility') : document.querySelector('#caution1').classList.add('visibility')
})

$('.icon-transcript').on('click', () => {
    $('.bg-modal').removeClass('hidden')
})


$('#close').on('click', () => {
    $('.bg-modal').addClass('hidden')
})