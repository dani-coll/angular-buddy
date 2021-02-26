import * as vscode from 'vscode';


export async function addFunction(functionName: string, componentDocument: vscode.TextDocument, lineToEdit: number, functionParameters: string[]) {
    await vscode.commands.executeCommand<vscode.TextDocumentShowOptions>("vscode.open", componentDocument.uri);

    const positionStart = componentDocument.lineAt(lineToEdit).range.start;
    const positionEnd = componentDocument.lineAt(lineToEdit).range.end;
    const lineText = componentDocument.lineAt(lineToEdit).text;
    if (vscode.window.activeTextEditor) {
        vscode.window.activeTextEditor.selections = [new vscode.Selection(positionStart, positionEnd)];
        await vscode.window.activeTextEditor.edit((editor) => {
            if (vscode.window.activeTextEditor) {
                vscode.window.activeTextEditor.selections.forEach(selection => {
                    editor.replace(selection, `\n\t${functionName}(${functionParameters.join(', ')}) { \t\n\n\t}\n${lineText}`);
                });
            }

        });
    }

}