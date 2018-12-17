const Panel = require("../Panel");

class ListPanel extends Panel {
  constructor(direction) {
    super();
    this.direction = direction;
    this.panels = [];
  }

  addPanel(panel) {
    this.panels.push(panel);
    this.trigger("paneladd", panel);
  }

  getElement() {
    const panelsHTML = [];
    for (let i in panels) {
      const panel = panels[i];
      panelsHTML.push(panel.getElement());
    }
    return {
      class: `panel-list panel-list-${this.direction}`,
      sub: panelsHTML
    };
  }
}

module.exports = ListPanel;
