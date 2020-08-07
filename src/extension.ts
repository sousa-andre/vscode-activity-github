import { window, workspace, ExtensionContext } from 'vscode';
import { basename } from 'path';
import GithubAPI from './githubAuth';

let interval: NodeJS.Timeout;
const githubAPI = new GithubAPI();

export async function activate(_: ExtensionContext) {
    const statusChanger = async () => {
        if (!workspace.name || !window.activeTextEditor) {
            return;
        }

        await githubAPI.changeUserStatus({
            message: `Working on: ${workspace.name}. Editing: ${basename(
                window.activeTextEditor.document.fileName
            )}`,
            emoji: '💻',
        });
    };

    await statusChanger();
    window.onDidChangeActiveTextEditor(statusChanger);
}

export async function deactivate() {
    clearInterval(interval);
    await githubAPI.changeUserStatus({ message: '', emoji: '' });
}
