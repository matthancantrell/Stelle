const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    const message = event.data;

    switch (message.command) {
        case 'updateStelleHTML':
            document.getElementById('R').innertext = 'Message Received';
            break;

        case 'update':
            UpdateStelle(message.data.response);
            var boolStr = message.data.codeProvided;
            if (boolStr) {
                UpdateCode(message.data.code);
            } else {
                CheckIfCodeIsEmpty();
            }
            vscode.postMessage({
                command: 'beep',
                data: boolStr
            });
            break;

        case 'test': {
            document.getElementById('R').innertext = 'Message Received';
            break;
        }
    }
})

function EmptyText() {
    var object = window.getElementById('userText');
    object.value = '';
}

function CheckIfCodeIsEmpty() {
    var object = document.getElementById('code');
    if(object.innerText.trim() === '') {
        return true;
    } else {
        return false;
    }
}

function UpdateStelle(data) {
    var object = document.getElementById('R');
    if (object) { document.getElementById('R').innerText = data; }
}

function UpdateCode(data) {
    var object = document.getElementById('code');
    if (object) { document.getElementById('code').innerText = data; }
}

function submitUserData() {
    var userInput = window.getElementById('userText').value;
    // Send the user input data back to the extension
    vscode.postMessage({
        command: 'submitUserData',
        data: userInput
    });
    EmptyText();
}

function updateStelle(newData) {
    document.getElementById('response').innertext = newData;
}

function autoResize(textArea) {
    textArea.style.height = 'auto'; // Reset the height to auto
    textArea.style.height = (textArea.scrollHeight) + 'px'; // Set the height to fit the content
}
