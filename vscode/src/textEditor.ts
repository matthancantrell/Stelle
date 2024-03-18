import * as vscode from 'vscode';

export function insertCodeAtCurrentLocation(codeToInsert: string, editor: vscode.TextEditor) {
    const currentPos = editor.selection.active;
    const currentLine = editor.document.lineAt(currentPos.line);

    // Represent new line position
    let linePos = currentPos.line;

    /* If the current line isn't empty or doesn't contain only whitespace, 
    shift line position to the next line to insert the code. */
    if (!currentLine.isEmptyOrWhitespace) {
        linePos += 1;
    }

    // Edit the document once, improving efficiency.
    editor.edit((editBuilder) => {
        const newPos = new vscode.Position(linePos, 0);
        editBuilder.insert(newPos, codeToInsert + '\n');
    });
}

export function insertCodeAtLine(codeToInsert: string, editor: vscode.TextEditor, lineNumber: number) {
    // No need to make any optimization here, the minimum and maximum function are already quick operations.
    lineNumber = Math.max(0, Math.min(lineNumber, editor.document.lineCount));

    // vscode.Position instantiation is efficient and fast.
    const newPos = new vscode.Position(lineNumber, 0);

    // The editor.edit() function call is asynchronous and efficient as it batches all the changes.
    editor.edit((editBuilder) => {
        editBuilder.insert(newPos, codeToInsert + '\n');
    });
}