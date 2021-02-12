import * as vscode from 'vscode';

export async function getWorkspaceDocuments(includedPath: string, excludedFiles: string): Promise<vscode.TextDocument[]> {
    const uris: vscode.Uri[] = await vscode.workspace.findFiles(includedPath, excludedFiles);
    if (!uris.length) {
        vscode.window.showInformationMessage('No component file found');
        return [];
    }

    let promises: Thenable<vscode.TextDocument>[] = [];
    uris.forEach((uri: vscode.Uri) => {
        let promise = vscode.workspace.openTextDocument(uri);
        promises.push(promise);
    });

    let docs: vscode.TextDocument[] = await Promise.all(promises);

    return docs;
}

export function getCurrentFolderRelativePath(absolutePath: string): string {
    const activeEditorRelativePath = vscode.workspace.asRelativePath(absolutePath);

    const pathArray = activeEditorRelativePath.split("/"); // TODO: Test on windows
    pathArray.pop();
    return pathArray.join('/');
}

export function getCurrentComponentName(absolutePath: string): string {
    const activeEditorRelativePath = vscode.workspace.asRelativePath(absolutePath);

    const pathArray = activeEditorRelativePath.split("/");
    return pathArray[pathArray.length - 1].split('.')[0];
}