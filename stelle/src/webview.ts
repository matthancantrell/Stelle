// HTML For Webview
export function getWebviewContent() {
	console.log("SYSTEM: Sending Webview...");
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>

		/* Define a CSS class to add a border */
		.bordered {
			border: 2px solid black; /* You can customize the border style, color, and width */
			padding: 10px; /* Add padding for spacing */
		}
		
		.product-font {
			font-family: 'Product Sans';
			<!-- src: url('ProductSans-Regular.otf'); -->
		}
			
		body {
			font-family: 'Product Sans';
		}

		.large-text {
			font-size: 2em;
		}

		.center-text { text-align: center; }

		</style>
		<script>

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
			}
		})

		function EmptyText() {
			var object = document.getElementById('userText');
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
		<div class="bordered">
			<p id="code"></p>
		</div>
		<p id="R">
			Hello! I am Stelle, an AI assistant built to help you learn to code! Ask me any code related questions and I will do my best to help!
		</p>
		<br>
		<form id="userInput" method="POST">
			<input type="text" id="userText" placeholder="Talk to Stelle here!">
			<button type="button" onclick="submitUserData()" id="submitUserText"> Submit </button>
		<form/>
	</body>
	</html>`;
}