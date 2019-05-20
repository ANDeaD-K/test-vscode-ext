// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as vm from 'vm';

let ranges: Array<vscode.DecorationOptions> = [];
let lines: Array<any> = [];

let fileContent: vm.Script;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test-vscode-ext" is now active!');

	let activeEditor: vscode.TextEditor | undefined;
	// let ranges: Array<vscode.DecorationOptions> = [];

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');

		// vscode.window.onDidChangeActiveTextEditor((e: any) => {
		// 	console.log(e);
		// });

		if (vscode.window.activeTextEditor) {
			activeEditor = vscode.window.activeTextEditor;
		}

		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor;
		});

		vscode.workspace.onDidChangeTextDocument(event => {
			// console.log(event);

			if (activeEditor) {
				// console.log(activeEditor.document.getText());

				let text = activeEditor.document.getText();
				ranges = [];
				lines = [];

				// if it's plain text, we have to do mutliline regex to catch the start of the line with ^
				// let regexFlags = ( activeEditor this.isPlainText) ? "igm" : "ig";
				let regEx = new RegExp(/\/\/\?/igm);//('\/\/\?', 'igm');

				let match: any;
				while (match = regEx.exec(text)) {
					let startPos = activeEditor.document.positionAt(match.index);
					let endPos = activeEditor.document.positionAt(match.index + match[0].length);
					// let range = { range: new vscode.Range(startPos, endPos) };

					// ranges.push(range);



					// Find which custom delimiter was used in order to add it to the collection
					// let matchTag = this.tags.find(item => item.tag.toLowerCase() === match[3].toLowerCase());

					// if (matchTag) {
					// 	matchTag.ranges.push(range);
					// }

					

					// console.log(range);
					let activeLine: number = activeEditor.selection.active.line;

					// let range = { range: new vscode.Range(activeLine, 0, activeLine, activeEditor.document.lineCount - 1) };
					let range = { range: new vscode.Range(startPos, endPos) };
					ranges.push(range);

					lines.push(activeEditor.document.getText(new vscode.Range(range.range.start.line, 0, range.range.start.line, range.range.start.character)));

					// lines.push(activeEditor.document.getText());

					// vm
					// fileContent = activeEditor.document.getText();

					// console.log(range);
				}

				triggerUpdateDecorations(activeEditor);
			}
		});
	});

	context.subscriptions.push(disposable);
}

var timeout: NodeJS.Timer;

function triggerUpdateDecorations(activeEditor: vscode.TextEditor) {
	if (timeout) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(() => {
		// let options: vscode.DecorationRenderOptions = { color: '#f00', backgroundColor: '#0f0' };
		// activeEditor.setDecorations(vscode.window.createTextEditorDecorationType(options), ranges);

		// ranges.forEach(range => {
			// console.log(eval(activeEditor.document.getText(new vscode.Range(range.range.start.line, 0, range.range.start.line, range.range.start.character))));
			// console.log(activeEditor.document.getText(new vscode.Range(range.range.start.line, 0, range.range.start.line, range.range.start.character)));

			// console.log(lines);
		// });

		// let x = eval(activeEditor.document.getText());

		// lines.forEach(line => console.log(eval(line)));

		// vm.runInNewContext(fileContent);

		fileContent = new vm.Script(activeEditor.document.getText());

		lines.forEach(line => {
			console.log(fileContent.runInContext(line));
		});
		
		
	}, 200);
}

// this method is called when your extension is deactivated
export function deactivate() {}
