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
			border: 2px solid white;
			padding: 10px;
			background: gray;
		}

		textarea { 
			border-radius: 10px;
		}
		
		.product-font {
			font-family: 'Product Sans';
			<!-- src: url('ProductSans-Regular.otf'); -->
		}
			
		/* body {
			font-family: 'Product Sans';
		} */

		.large-text {
			font-size: 2em;
		}

		.medium-text {
			font-size: 2em;
		}

		.non-resizeable {
			resize: none;
			width: 90%
		}

		.centered {
			text-align: center;
			display: block;
			margin: 0 auto; /* Center the element horizontally on the page */
		}

		body { color: white; background-color: black; }

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

		function autoResize(textArea) {
			textArea.style.height = 'auto'; // Reset the height to auto
			textArea.style.height = (textArea.scrollHeight) + 'px'; // Set the height to fit the content
		}
		
		</script>
	</head>
	<body>
		<br><br>
		<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" class="centered" />
		<br><br>
		<div class="bordered" style="border-radius: 10px;">
			<p id="code" style="font-size:1.25em; text-align: center"></p>
		</div>
		<br><br>
		<p id="R" class="product-font centered large-text">
			Hello! I am Stelle, an AI assistant built to help you learn to code! Ask me any code related questions and I will do my best to help!
		</p>
		<br><br>
		<br>
		<form id="userInput" method="POST">
			<textarea type="text" id="userText" class="non-resizeable centered product-font" placeholder="Talk to Stelle here!" oninput="autoResize(this)" style="font-size: 2em;"></textarea>
			<br>
			<button type="button" onclick="submitUserData()" id="submitUserText" class="centered" style="padding: 20px;">Submit</button>
		</form>	
	</body>
	</html>`;
}