// HTML For Webview
export function getWebviewContent() {
	console.log("SYSTEM: Sending Webview...");
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script>

		const vscode = acquireVsCodeApi();

		window.addEventListener('message', event => {
			const message = event.data;

			switch (message.command) {
				case 'updateStelleHTML':
					document.getElementById('R').innertext = 'Message Received';
					break;

				case 'update':
					UpdateStelle(message.data);
					break;
			}
		})

		function EmptyText() {
			var object = document.getElementById('userText');
			object.value = '';
		}

		function UpdateStelle(data) {
			var object = document.getElementById('R');
			if (object) { document.getElementById('R').innerText = data; }
		}

		function submitUserData() {
            var userInput = document.getElementById('userText').value;
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
		</script>
	</head>
	<body>
		<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
		<br>
		<p id="R">
			|| Stelle's Response Will Go Here! ||
		</p>
		<br>
		<form id="userInput" method="POST">
			<input type="text" id="userText" placeholder="Talk to Stelle here!">
			<button type="button" onclick="submitUserData()" id="submitUserText"> Submit </button>
		<form/>
	</body>
	</html>`;
}