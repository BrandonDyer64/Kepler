const Panel = require("../Panel");

class TabbedPanel extends Panel {
  constructor(direction) {
    super();
    this.direction = direction;
    this.panels = [];
    this.panelMap = new Map();
    this.currentPanel = { name: null, panel: null };
  }

  addTab(tabName, panel) {
    this.panels.push({ name: tabName, panel });
    this.trigger("paneladd", panel);
    this.panelMap.set(tabName, panel);
  }

  switchTab(tabName) {
    this.currentPanel.panel.trigger("switchaway");
    this.currentPanel = { name: tabName, panel: this.panelMap.get(tabName) };
    this.currentPanel.panel.trigger("switchfocus");
  }

  getElement() {
    const panelsHTML = [];
    const panelsTab = [];
    for (let i in panels) {
      const panel = panels[i];
      panelsHTML.push(panel.panel.getElement());
      panelsTab.push({
        class: "tab",
        sub: [
          {
            tag: "a",
            text: panel.name,
            onclick: ({ document }) => {
              switchTab(panel.name, document);
            }
          }
        ]
      });
    }
    return {
      class: "panel-tabbed",
      sub: [{ class: "tabs", sub: [] }, { class: "content", sub: panelsHTML }]
    };
  }
}

module.exports = TabbedPanel;
