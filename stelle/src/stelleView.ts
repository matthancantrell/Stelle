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
            console.log('SYSTEM: Message Received: ', message.command);
            switch (message.command) {
                case 'chatSent': {
                    this.setMessage("user", message.data);
                    var x = await ai.callOpenAI(message.data);
                    if(x?.content) {
                        var json = JSON.parse(x?.content);
                        console.log(json.response);
                        console.log(json.code);
                        console.log(json.codeProvided);

                        if(json.codeProvided) {
                            this.view?.webview.postMessage({ command: 'newMessageWithCode', data: json.response, code: json.code });
                        } else {
                            this.view?.webview.postMessage({ command: 'newMessage', data: json.response });
                        }
                    }
                    break;
                }
                case 'insertCodeIntoEditor': {
                    var editor = vscode.window.activeTextEditor;
                    if (editor) {
                        textEditor.insertCodeAtCurrentLocation(message.data, editor);
                    }
                    break;
                }
            }
                // Handle Messages From Webview
                vscode.window.showInformationMessage(`Received Message: ${message.command}`);
            },
        );
    }

    private getWebviewContent(webview: vscode.Webview): string {
        // Get Path To HTML
        const htmlPath = vscode.Uri.joinPath(this.extensionUri, 'out/media/b.html');
         // Gets Data From HTML File
        var htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf-8');

        return htmlContent; // Returns HTML File
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

    getMessage(): m.Message { return this.message; }
    setMessage(role: string, content: string) { this.message = new m.Message(role, content); }
}