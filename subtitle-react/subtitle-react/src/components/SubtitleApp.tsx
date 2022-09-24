import React, {SyntheticEvent, useRef, useState} from "react";
import {getYoutubeID} from "../lib/GetYoutubeId";

export type CopyButtonLabel = "Copy" | "Copied...";
export type Languages = "en" | "tr" | "fr" | "de";
export const API_URI = "localhost:8086";

const TIMESTAMP_REGEX = /(\d{1,2}:)?(\d{1,2}:\d{1,2})/gi;
const SQUARE_BRACKET = /^\[[\w\s]+]$/gi;

export function convertSubtitle(text: string): string {
    const outPutArray: string[] = [];
    text.split("\n").forEach((line) => {
        if (TIMESTAMP_REGEX.test(line)) return;
        if (SQUARE_BRACKET.test(line)) return;
        outPutArray.push(line);
    });
    return outPutArray.join(" ");
}

function SubtitleApp() {
    const [result, setResult] = useState("");
    const [language, setLanguage] = useState<Languages>("en");
    const [copyButton, setCopyButton] = useState<CopyButtonLabel>("Copy");

    const textAreaElementRef = useRef<HTMLTextAreaElement>(null);
    const inputElementRef = useRef<HTMLInputElement>(null);

    function handleConvertClick(e?: SyntheticEvent) {
        const textAreaString = textAreaElementRef.current?.value;
        if (!!textAreaString) setResult(convertSubtitle(textAreaString));
    }

    function handleCopyClick(e?: SyntheticEvent) {
        const elem = document.createElement("textarea");
        elem.value = result;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand("copy");
        document.body.removeChild(elem);
        updateCopyButtonText();
    }

    function handleLanguageSelect(lang: Languages) {
        setLanguage(lang);
    }

    async function handleFetchSubtitle(e?: SyntheticEvent) {
        const inputText = inputElementRef.current?.value;
        if (inputText) {
            const youtubeID = getYoutubeID(inputText);
            if (youtubeID !== null) {
                try {
                    const response = await fetch(`http://${API_URI}/api/ytcc/?url=${youtubeID}&lang=${language}`);
                    const json = await response.json();
                    const subtitle: string = json?.subtitle.join(" ");
                    if (subtitle) return setResult(subtitle);
                    return alert("Subtitle Not Found!");
                } catch (err) {
                    return alert("Error: " + err);
                }
            }
            return alert("Invalid YouTube URL");
        }
    }

    function updateCopyButtonText() {
        setCopyButton("Copied...");
        setTimeout(() => setCopyButton("Copy"), 1500);
    }

    return (
        <>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="YouTube URL"
                    aria-label="YouTube URL"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleFetchSubtitle();
                        }
                    }}
                    ref={inputElementRef}/>
                <div className="input-group-append">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleFetchSubtitle}>
                        Go
                    </button>
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="pl-1 pr-2">Language: {language}</span>
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu" placeholder="lang">
                        <a className="dropdown-item" href="#en" onClick={() => {
                            handleLanguageSelect("en")
                        }}>EN </a>
                        <a className="dropdown-item" href="#tr" onClick={() => {
                            handleLanguageSelect("tr")
                        }}>TR</a>
                        <a className="dropdown-item" href="#fr" onClick={() => {
                            handleLanguageSelect("fr")
                        }}>FR</a>
                        <a className="dropdown-item" href="#de" onClick={() => {
                            handleLanguageSelect("de")
                        }}>DE</a>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <form>
                        <div className="form-group">
                            <label htmlFor="input-area">Input:</label>
                            <textarea
                                id="input-area"
                                className="form-control"
                                rows={20}
                                ref={textAreaElementRef}
                            ></textarea>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary mt-2 custom"
                                onClick={handleConvertClick}>
                                Convert
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-6">
                    <form>
                        <div className="form-group">
                            <label htmlFor="result-area">Output:</label>
                            <textarea
                                readOnly
                                id="result-area"
                                className="form-control"
                                rows={20}
                                defaultValue={result}>
                            </textarea>
                            <button
                                type="button"
                                className="btn btn-sm btn-success mt-2 custom"
                                onClick={handleCopyClick}>
                                {copyButton}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SubtitleApp;