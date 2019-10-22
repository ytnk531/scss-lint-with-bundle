import * as vscode from "vscode";
import { ScssLint } from "./ScssLint";
import { debounce } from 'lodash';

const DEBOUNCE_TIME_MS = 100;

export function activate(context: vscode.ExtensionContext): void {
  const scssLint = new ScssLint();
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(debounce(execute, DEBOUNCE_TIME_MS)
  ));
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(execute)
  );

  function execute(e: vscode.TextEditor | vscode.TextDocumentChangeEvent | undefined) {
    if (!e) { return; }
    scssLint.execute(e.document);
  }
}

export function deactivate() {}
