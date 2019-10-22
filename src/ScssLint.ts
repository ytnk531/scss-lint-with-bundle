import * as cp from "child_process";
import {
  DiagnosticCollection,
  languages,
  workspace,
  TextDocument,
  WorkspaceConfiguration
} from "vscode";
import { ScssLintParser } from "./scssLintParser";

export class ScssLint {
  private collection: DiagnosticCollection;
  private parser: ScssLintParser;
  private cfg: WorkspaceConfiguration;

  constructor() {
    this.collection = languages.createDiagnosticCollection("scss");
    this.parser = new ScssLintParser();
    this.cfg = workspace.getConfiguration("scssLintB");
  }

  private command(path: string): string {
    let tokens = ["scss-lint ", "--stdin-file-path", path];

    const useBundler = this.cfg.get("useBundler");
    if (useBundler) {
      tokens.unshift("exec", "bundle");
    }
    return tokens.join(" ");
  }

  private rootPath(document: TextDocument): string {
    const workspaceFolder = workspace.getWorkspaceFolder(document.uri);
    return workspaceFolder ? workspaceFolder.uri.fsPath : "./";
  }

  public execute(document: TextDocument): void {
    if (document.languageId !== "scss") {
      return;
    }

    const rootPath = this.rootPath(document);
    const child = cp.exec(
      this.command(document.fileName),
      { cwd: rootPath },
      (error, stdout, stderr) => {
        if (!error) {
          this.collection.clear();
        }
        const diagnostics = this.parser.process(stdout);
        this.collection.set(document.uri, diagnostics);
      }
    );
    child.stdin.end(document.getText());
  }
}
