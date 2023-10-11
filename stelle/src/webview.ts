// HTML For Webview
export function getWebviewContent() {
	console.log("Sending Webview...");
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>
		<script>

		const vscode = acquireVsCodeApi();

		function EmptyText() {
			var object = document.getElementById('userText');
			object.value = '';
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
		</script>
	</head>
	<body>
		<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
		<form id="userInput" method="POST">
			<input type="text" id="userText" placeholder="Talk to Stelle here!">
			<button type="button" onclick="submitUserData()" id="submitUserText"> Submit </button>
		<form/>
	</body>
	</html>`;
}