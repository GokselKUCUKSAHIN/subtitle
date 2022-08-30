<script setup lang="ts">
import {ref} from "vue";
import {getYouTubeSubtitle} from "./index";

type CopyButton = "Copy" | "Copied...";
const timeStampRegEx = /(\d{1,2}:)?(\d{1,2}:\d{1,2})/gi;
const squreBracket = /^\[[\w\s]+]$/gi;

const btnCopyText = ref<CopyButton>("Copy");
const inputText = ref("");
const urlText = ref("");
const result = ref("");

function updateText(): void {
  result.value = convertSubtitleText(inputText.value);
}

function copyText(): void {
  // copy to clipboard
  const elem = document.createElement("textarea");
  elem.value = result.value;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
  updateCopyButtonText();
}

function updateCopyButtonText(delay: number = 1500): void {
  // change button text
  btnCopyText.value = "Copied...";
  setTimeout(() => {
    btnCopyText.value = "Copy";
  }, delay);
}

function convertSubtitleText(text: string): string {
  const outPutArray: string[] = [];
  text.split("\n").forEach((line) => {
    if (line.match(timeStampRegEx)) return;
    if (line.match(squreBracket)) return;
    outPutArray.push(line);
  });
  return outPutArray.join(" ");
}

async function goBrr() {
  window.alert(`Go! Brr says: ${urlText.value}`);
  const strRes: string = await getYouTubeSubtitle(urlText.value, "en", false) + "";
  result.value = strRes;
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-3">
      <span style="color: #ed265d">Subtitle</span> Convert
    </h2>
    <div class="input-group mb-3">
      <input v-model="urlText" type="text" class="form-control" placeholder="YouTube URL" aria-label="YouTube URL" aria-describedby="basic-addon2">
      <div class="input-group-append">
        <button
            class="btn btn-outline-secondary"
            type="button"
            @click="goBrr"
        >
          Go! Brrr.
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <label for="input-area">Input:</label>
            <textarea
                id="input-area"
                class="form-control"
                rows="20"
                v-model="inputText"
            ></textarea>
            <button
                type="button"
                class="btn btn-sm btn-primary mt-2 custom"
                @click="updateText"
            >
              Convert
            </button>
          </div>
        </form>
      </div>
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <label for="result-area">Output:</label>
            <textarea readonly id="result-area" class="form-control" rows="20">{{result}}</textarea>
            <button
                type="button"
                class="btn btn-sm btn-success mt-2 custom"
                @click="copyText"
            >
              {{ btnCopyText }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Footer -->
    <footer class="page-footer font-small cyan darken-3">
      <!-- Copyright -->
      <div class="footer-copyright text-center py-3">© 2022 Copyright:
        <a href="https://github.com/GokselKUCUKSAHIN/"> Göksel KÜÇÜKŞAHİN</a>
      </div>
      <!-- Copyright -->
    </footer>
    <!-- Footer -->
  </div>
</template>