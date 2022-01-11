new Vue({
  el: "#app",
  data: {
    timeStampRegEx: /(\d{1,2}:)?(\d{1,2}:\d{1,2})/gi,
    squreBracket: /^\[[\w\s]+]$/gi,
    inputText: "",
    result: "",
    btnCopyText: "Copy",
  },
  methods: {
    updateText() {
      //
      this.result = this.convertSubtitleText(this.inputText);
    },
    copyText() {
      // copy to clipboard
      const elem = document.createElement("textarea");
      elem.value = this.result;
      document.body.appendChild(elem);
      elem.select();
      document.execCommand("copy");
      document.body.removeChild(elem);
      this.updateCopyButtonText();
    },
    updateCopyButtonText() {
      // change button text
      this.btnCopyText = "Copied...";
      setTimeout(() => {
        this.btnCopyText = "Copy";
      }, 1500);
    },
    convertSubtitleText(text) {
      const outPutArray = [];
      text.split("\n").forEach((line) => {
        if (line.match(this.timeStampRegEx)) return;
        if (line.match(this.squreBracket)) return;
        outPutArray.push(line);
      });
      return outPutArray.join(" ");
    },
  },
});