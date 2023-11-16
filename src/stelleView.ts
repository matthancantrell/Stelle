import * as vscode from 'vscode';
import * as fs from 'fs';
import * as m from './message';
import * as ai from './OpenAI_API';
import * as textEditor from './textEditor';
import * as path from 'path';
import { getWebviewContent } from './webview';
import { resolvePtr } from 'dns';

export class stelleView implements vscode.WebviewViewProvider {

    public static readonly viewType = 'stelle.view';
    private view?: vscode.WebviewView;
    public message = new m.Message("", "");

    constructor(private readonly extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void {

        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,

            localResourceRoots: [
                this.extensionUri
            ]
        };

        this.view.webview.html = this.getWebviewContent(webviewView.webview);

        this.view.webview.onDidReceiveMessage(async message => {
            console.log("StelleView -> Webview Received Message: ", message.command);
            switch (message.command) {
                case 'chatSent': {
                    console.log("StelleView -> chatSent begin...");
                    this.setMessage("user", message.data);
                    var x = await ai.callOpenAI(message.data);
                    if(x?.content) {
                        var json = JSON.parse(x?.content);
                        console.log("StelleView -> Response From AI: ",json.response);
                        console.log("StelleView -> Code From AI: ",json.code);
                        console.log("StelleView -> Code Provided: ",json.codeProvided);

                        if(json.codeProvided) {
                            this.view?.webview.postMessage({ command: 'newMessageWithCode', data: json.response, code: json.code });
                        } else {
                            this.view?.webview.postMessage({ command: 'newMessage', data: json.response });
                        }
                    }
                    console.log("StelleView -> chatSent end...");
                    break;
                }
                case 'insertCodeIntoEditor': {
                    console.log("StelleView -> insertCodeIntoEditor begin...");
                    var editor = vscode.window.activeTextEditor;
                    if (editor) {
                        textEditor.insertCodeAtCurrentLocation(message.data, editor);
                    }
                    console.log("StelleView -> insertCodeIntoEditor end...");
                    break;
                }
            }},
        );
    }

    private getWebviewContent(webview: vscode.Webview): string {
        const htmlPath = vscode.Uri.joinPath(this.extensionUri, 'out/media/b.html'); // Get Uri Path To HTML
        var htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf-8'); // Get Data From HTML
        return htmlContent; // Returns HTML Data
    }
    
    test1() {
        if (this.view) {
            this.view.webview.postMessage({ command: 'test1' });
        }
    }

    test2() {
        if (this.view) {
            this.view.webview.postMessage({ command: 'test2' });
        }
    }

    OptimizeSend() {
        if (this.view) { // If The View Is Not Null
            this.view.webview.postMessage({ command: 'optimizeSend' }); // Post Message
        }
    }

    OptimizeReceive(response: string, code: string) {
        if (this.view) { // If The View Is Not Null
            this.view.webview.postMessage({ command: 'optimizeReceive', response: response, code: code  }); // Post Message
        }
    }

    AnalyzeSend() {}
    AnalyzeReceive() {}

    FillSend() {}
    FillReceive() {}

    CommentSend() {}
    CommentReceive() {}

    DebugSend() {}
    DebugReceive() {}

    getMessage(): m.Message { return this.message; }
    setMessage(role: string, content: string) { this.message = new m.Message(role, content); }
}