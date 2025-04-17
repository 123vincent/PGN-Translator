const { Plugin, Notice, MarkdownView, PluginSettingTab, Setting } = require("obsidian");

const DEFAULT_SETTINGS = {
  remplacerNgp: true,
  roqueStyle: "0-0"
};

module.exports = class TranslatePGNPlugin extends Plugin {
  lastCursorWasInPGNBlock = false;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'convert-pgn-ngp',
      name: 'Convertir les blocs PGN ↔ NGP',
      callback: () => this.convertCurrentFile()
    });

    this.addCommand({
      id: 'insert-empty-pgn-block',
      name: 'Insérer un bloc PGN vide',
      editorCallback: (editor) => {
        const block = "```pgn\npgn: \n```";
        const cursor = editor.getCursor();
        editor.replaceRange(block, cursor);
        editor.setCursor({ line: cursor.line + 1, ch: 6 });
      }
    });

    this.addSettingTab(new TranslatePGNSettingTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on('editor-change', (editor) => {
        if (!editor) return;

        const cursor = editor.getCursor();
        const lines = editor.getValue().split("\n");
        const currentLineIndex = cursor.line;

        const blockBounds = this.findCurrentPGNBlock(lines, currentLineIndex);
        const isInPGN = blockBounds !== null;

        if (this.lastCursorWasInPGNBlock && !isInPGN) {
          const content = editor.getValue();
          const converted = this.convertContent(content);
          if (converted !== content) {
            editor.setValue(converted);
            new Notice("Conversion PGN ↔ NGP");
          }
        }

        this.lastCursorWasInPGNBlock = isInPGN;
      })
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  findCurrentPGNBlock(lines, currentLineIndex) {
    let start = -1, end = -1;
    for (let i = currentLineIndex; i >= 0; i--) {
      if (lines[i].trim() === "```pgn") {
        start = i;
        break;
      }
    }
    if (start === -1) return null;
    for (let j = start + 1; j < lines.length; j++) {
      if (lines[j].trim() === "```") {
        end = j;
        break;
      }
    }
    if (end === -1 || currentLineIndex > end) return null;
    return { start, end };
  }

  convertPGNtoNGP(pgn) {
    const map = { N: 'C', B: 'F', R: 'T', Q: 'D', K: 'R' };
    let result = pgn
      .replace(/([NBRQK])(?=[a-h1-8x])/g, (piece) => map[piece] || piece)
      .replace(/=([NBRQK])/g, (_, piece) => `=${map[piece] || piece}`);
    if (this.settings.roqueStyle === "0-0") {
      result = result
        .replace(/\bO-O-O\b/g, '0-0-0')
        .replace(/\bO-O\b/g, '0-0');
    }
    return result;
  }

  convertNGPtoPGN(ngp) {
    const map = { C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' };
    let result = ngp
      .replace(/([CFTRD])(?=[a-h1-8x])/g, (piece) => map[piece] || piece)
      .replace(/=([CFTRD])/g, (_, piece) => `=${map[piece] || piece}`);
    if (this.settings.roqueStyle === "0-0") {
      result = result
        .replace(/\b0-0-0\b/g, 'O-O-O')
        .replace(/\b0-0\b/g, 'O-O');
    }
    return result;
  }

  async convertCurrentFile() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    const content = await this.app.vault.read(file);
    const converted = this.convertContent(content);
    await this.app.vault.modify(file, converted);
    new Notice("Conversion PGN ↔ NGP terminée !");
  }

  convertContent(content) {
    return content.replace(/```pgn\n([\s\S]*?)```/g, (match, code) => {
      const lines = code.trim().split('\n');
      let pgn = null;
      let ngp = null;
      for (const line of lines) {
        if (line.startsWith('pgn:')) {
          pgn = line.replace('pgn:', '').trim();
        } else if (line.startsWith('ngp:')) {
          ngp = line.replace('ngp:', '').trim();
        }
      }
      if (pgn) {
        ngp = this.convertPGNtoNGP(pgn);
      } else if (ngp) {
        pgn = this.convertNGPtoPGN(ngp);
      } else {
        return match;
      }
      return "```pgn\npgn: " + pgn + "\nngp: " + ngp + "\n```";
    });
  }
};

class TranslatePGNSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Options de Translate PGN" });

    new Setting(containerEl)
      .setName("Remplacer le champ ngp")
      .setDesc("Réécrit le champ ngp: au lieu d’en ajouter un nouveau.")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.remplacerNgp)
          .onChange(async (value) => {
            this.plugin.settings.remplacerNgp = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Style de roque")
      .setDesc("Choix de style : O-O ou 0-0")
      .addDropdown(drop =>
        drop
          .addOptions({ "O-O": "O-O", "0-0": "0-0" })
          .setValue(this.plugin.settings.roqueStyle)
          .onChange(async (value) => {
            this.plugin.settings.roqueStyle = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
