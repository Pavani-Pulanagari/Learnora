const API_URL = "http://127.0.0.1:8000";


// ============================================================
// ELEMENTS
// ============================================================

const topicInput = document.getElementById("topic");
const languageInput = document.getElementById("language");
const levelInput = document.getElementById("level");
const countryInput = document.getElementById("country");

const teachButton = document.getElementById("teachButton");

const loadingSection = document.getElementById("loading");
const resultSection = document.getElementById("result");

const resultTopic = document.getElementById("resultTopic");
const languageBadge = document.getElementById("languageBadge");

const explanation = document.getElementById("explanation");
const whyMatters = document.getElementById("whyMatters");

const realWorld = document.getElementById("realWorld");
const examples = document.getElementById("examples");
const mistakes = document.getElementById("mistakes");

const practice = document.getElementById("practice");

const uncertainty = document.getElementById("uncertainty");
const uncertaintyText = document.getElementById("uncertaintyText");

const sources = document.getElementById("sources");
const sourceCount = document.getElementById("sourceCount");

const groundingStatus =
    document.getElementById("groundingStatus");

const fileInput =
    document.getElementById("fileInput");

const uploadButton =
    document.getElementById("uploadButton");

const uploadStatus =
    document.getElementById("uploadStatus");

const sourceList =
    document.getElementById("sourceList");

const dropZone =
    document.getElementById("dropZone");


// ============================================================
// INITIAL LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSources();

    }
);


// ============================================================
// TEACH BUTTON
// ============================================================

teachButton.addEventListener(
    "click",
    learn
);


// ============================================================
// CTRL + ENTER
// ============================================================

topicInput.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            learn();

        }

    }
);


// ============================================================
// LEARN
// ============================================================

async function learn() {

    const topic =
        topicInput.value.trim();


    if (!topic) {

        topicInput.focus();

        return;

    }


    setLoading(true);


    try {

        const response =
            await fetch(
                `${API_URL}/learn`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        topic: topic,

                        language:
                            languageInput.value.trim()
                            || "auto",

                        level:
                            levelInput.value,

                        country:
                            countryInput.value.trim()

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Learnora could not generate a lesson."
            );

        }


        if (data.error) {

            throw new Error(
                data.error
            );

        }


        renderLesson(data);


        resultSection.classList.remove(
            "hidden"
        );


        setTimeout(
            () => {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            100
        );


    } catch (error) {

        showError(
            error.message
        );

    } finally {

        setLoading(false);

    }

}


// ============================================================
// LOADING
// ============================================================

function setLoading(isLoading) {

    if (isLoading) {

        loadingSection.classList.remove(
            "hidden"
        );

        teachButton.disabled = true;

        teachButton.querySelector(
            "span"
        ).textContent = "Teaching...";

    } else {

        loadingSection.classList.add(
            "hidden"
        );

        teachButton.disabled = false;

        teachButton.querySelector(
            "span"
        ).textContent = "Teach me";

    }

}


// ============================================================
// RENDER LESSON
// ============================================================

function renderLesson(data) {

    resultTopic.textContent =
        data.topic ||
        "Your lesson";


    // --------------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------------

    let detectedLanguage =
        data.detected_language;


    if (
        !detectedLanguage ||
        detectedLanguage === "None" ||
        detectedLanguage === "null" ||
        detectedLanguage === "undefined"
    ) {

        detectedLanguage =
            languageInput.value.trim();


        if (
            !detectedLanguage ||
            detectedLanguage.toLowerCase() === "auto"
        ) {

            detectedLanguage =
                "Auto-detected";

        }

    }


    languageBadge.textContent =
        formatLanguage(
            detectedLanguage
        );


    // --------------------------------------------------------
    // CONCEPT
    // --------------------------------------------------------

    explanation.textContent =
        data.explanation ||
        "No verified explanation is available.";


    // --------------------------------------------------------
    // WHY IT MATTERS
    // --------------------------------------------------------

    whyMatters.textContent =
        data.why_it_matters ||
        "No verified information is available.";


    // --------------------------------------------------------
    // REAL WORLD
    // --------------------------------------------------------

    renderList(
        realWorld,
        data.real_world_applications
    );


    // --------------------------------------------------------
    // EXAMPLES
    // --------------------------------------------------------

    renderList(
        examples,
        data.examples
    );


    // --------------------------------------------------------
    // COMMON MISTAKES
    // --------------------------------------------------------

    renderList(
        mistakes,
        data.common_mistakes
    );


    // --------------------------------------------------------
    // PRACTICE
    // --------------------------------------------------------

    practice.textContent =
        data.practice_question ||
        "Try explaining the concept in your own words.";


    // --------------------------------------------------------
    // UNCERTAINTY
    // --------------------------------------------------------

    if (
        data.uncertainty_note &&
        data.uncertainty_note.trim()
    ) {

        uncertaintyText.textContent =
            data.uncertainty_note;

        uncertainty.classList.remove(
            "hidden"
        );

    } else {

        uncertainty.classList.add(
            "hidden"
        );

    }


    // --------------------------------------------------------
    // SOURCES
    // --------------------------------------------------------

    renderSources(
        data
    );


    // --------------------------------------------------------
    // GROUNDING
    // --------------------------------------------------------

    renderGrounding(
        data
    );

}


// ============================================================
// FORMAT LANGUAGE
// ============================================================

function formatLanguage(language) {

    if (!language) {

        return "Auto-detected";

    }


    const value =
        String(language).trim();


    if (
        !value ||
        value.toLowerCase() === "auto"
    ) {

        return "Auto-detected";

    }


    if (
        value.toLowerCase() === "none" ||
        value.toLowerCase() === "null"
    ) {

        return "Auto-detected";

    }


    return value
        .charAt(0)
        .toUpperCase()
        +
        value.slice(1);

}


// ============================================================
// RENDER LIST
// ============================================================

function renderList(
    container,
    items
) {

    container.innerHTML = "";


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        const empty =
            document.createElement("p");

        empty.textContent =
            "No verified information available.";

        container.appendChild(
            empty
        );

        return;

    }


    const ul =
        document.createElement("ul");


    items.forEach(
        item => {

            const li =
                document.createElement("li");


            li.textContent =
                typeof item === "string"
                    ? item
                    : JSON.stringify(item);


            ul.appendChild(
                li
            );

        }
    );


    container.appendChild(
        ul
    );

}


// ============================================================
// RENDER SOURCES
// ============================================================

function renderSources(data) {

    sources.innerHTML = "";


    const evidence =
        Array.isArray(data.evidence)
            ? data.evidence
            : [];


    const sourceNames =
        Array.isArray(data.sources)
            ? data.sources
            : [];


    const uniqueSources =
        [
            ...new Set(
                sourceNames.filter(Boolean)
            )
        ];


    sourceCount.textContent =
        `${uniqueSources.length} ${
            uniqueSources.length === 1
                ? "source"
                : "sources"
        }`;


    if (
        evidence.length === 0 &&
        uniqueSources.length === 0
    ) {

        const empty =
            document.createElement("p");

        empty.textContent =
            "No verified sources were used.";

        empty.style.color =
            "#747382";

        empty.style.fontSize =
            "12px";

        sources.appendChild(
            empty
        );

        return;

    }


    // --------------------------------------------------------
    // Use evidence when available
    // --------------------------------------------------------

    if (evidence.length > 0) {

        evidence.forEach(
            item => {

                createEvidenceItem(
                    item
                );

            }
        );

        return;

    }


    // --------------------------------------------------------
    // Fallback to source names
    // --------------------------------------------------------

    uniqueSources.forEach(
        source => {

            const item =
                document.createElement("div");

            item.className =
                "evidence-item";


            item.innerHTML = `

                <div class="evidence-header">

                    <div class="evidence-source">

                        <div class="evidence-file-icon">
                            DOC
                        </div>

                        <div class="evidence-name">
                            ${escapeHTML(source)}
                        </div>

                    </div>

                </div>

            `;


            sources.appendChild(
                item
            );

        }
    );

}


// ============================================================
// CREATE EVIDENCE ITEM
// ============================================================

function createEvidenceItem(item) {

    const source =
        item.source ||
        "Knowledge source";


    const score =
        Number(item.score);


    let relevance =
        "";


    if (
        Number.isFinite(score)
    ) {

        const percentage =
            Math.round(
                Math.max(
                    0,
                    Math.min(
                        1,
                        score
                    )
                ) * 100
            );


        relevance =
            `${percentage}% relevance`;

    }


    const evidenceItem =
        document.createElement("div");


    evidenceItem.className =
        "evidence-item";


    evidenceItem.innerHTML = `

        <div class="evidence-header">

            <div class="evidence-source">

                <div class="evidence-file-icon">
                    DOC
                </div>

                <div class="evidence-name">
                    ${escapeHTML(source)}
                </div>

            </div>

            ${
                relevance
                    ? `
                        <div class="relevance">
                            ${relevance}
                        </div>
                      `
                    : ""
            }

        </div>


        <div class="evidence-content">

            <p>
                ${escapeHTML(
                    item.text ||
                    "No evidence text available."
                )}
            </p>

        </div>

    `;


    const header =
        evidenceItem.querySelector(
            ".evidence-header"
        );


    header.addEventListener(
        "click",
        () => {

            evidenceItem.classList.toggle(
                "open"
            );

        }
    );


    sources.appendChild(
        evidenceItem
    );

}


// ============================================================
// GROUNDING STATUS
// ============================================================

function renderGrounding(data) {

    const grounding =
        data.grounding;


    if (!grounding) {

        groundingStatus.innerHTML = `

            <span class="grounding-check">
                ✓
            </span>

            <div>

                <strong>
                    Evidence retrieved
                </strong>

                <p>
                    This lesson was generated using
                    information retrieved from your
                    knowledge base.
                </p>

            </div>

        `;

        return;

    }


    const verdict =
        grounding.verdict ||
        "SUPPORTED";


    if (
        verdict === "PARTIALLY_SUPPORTED"
    ) {

        groundingStatus.innerHTML = `

            <span class="grounding-check">
                !
            </span>

            <div>

                <strong>
                    Partially verified
                </strong>

                <p>
                    Some generated details could not
                    be fully verified against the
                    available evidence.
                </p>

            </div>

        `;

        return;

    }


    if (
        verdict === "UNSUPPORTED"
    ) {

        groundingStatus.innerHTML = `

            <span class="grounding-check">
                !
            </span>

            <div>

                <strong>
                    Verification limited
                </strong>

                <p>
                    The available evidence was not
                    sufficient to verify the lesson.
                </p>

            </div>

        `;

        return;

    }


    groundingStatus.innerHTML = `

        <span class="grounding-check">
            ✓
        </span>

        <div>

            <strong>
                Evidence retrieved
            </strong>

            <p>
                This lesson was generated using
                information retrieved from your
                knowledge base.
            </p>

        </div>

    `;

}


// ============================================================
// KNOWLEDGE BASE — LOAD SOURCES
// ============================================================

async function loadSources() {

    try {

        const response =
            await fetch(
                `${API_URL}/sources`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Could not load sources."
            );

        }


        renderIndexedSources(
            data.sources || []
        );


    } catch (error) {

        sourceList.innerHTML = `

            <div class="empty-sources">

                <div>
                    !
                </div>

                <p>
                    Could not load your sources.
                </p>

                <span>
                    Make sure the Learnora backend is running.
                </span>

            </div>

        `;

    }

}


// ============================================================
// UPLOAD BUTTON
// ============================================================

uploadButton.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);


// ============================================================
// FILE SELECTION
// ============================================================

fileInput.addEventListener(
    "change",
    async () => {

        const files =
            Array.from(
                fileInput.files
            );


        if (!files.length) {

            return;

        }


        await uploadFiles(
            files
        );


        fileInput.value = "";

    }
);


// ============================================================
// DRAG & DROP
// ============================================================

[
    "dragenter",
    "dragover"
].forEach(
    eventName => {

        dropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropZone.classList.add(
                    "dragging"
                );

            }
        );

    }
);


[
    "dragleave",
    "drop"
].forEach(
    eventName => {

        dropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropZone.classList.remove(
                    "dragging"
                );

            }
        );

    }
);


dropZone.addEventListener(
    "drop",
    async event => {

        const files =
            Array.from(
                event.dataTransfer.files
            );


        if (!files.length) {

            return;

        }


        await uploadFiles(
            files
        );

    }
);


// ============================================================
// UPLOAD FILES
// ============================================================

async function uploadFiles(files) {

    const allowed =
        [
            ".txt",
            ".md",
            ".pdf",
            ".docx"
        ];


    for (
        const file
        of files
    ) {

        const extension =
            "." +
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        if (
            !allowed.includes(
                extension
            )
        ) {

            showUploadStatus(
                `${file.name}: unsupported file type.`,
                true
            );

            continue;

        }


        if (
            file.size >
            10 * 1024 * 1024
        ) {

            showUploadStatus(
                `${file.name}: maximum size is 10 MB.`,
                true
            );

            continue;

        }


        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );


        showUploadStatus(
            `Indexing ${file.name}...`
        );


        try {

            const response =
                await fetch(
                    `${API_URL}/upload`,
                    {

                        method: "POST",

                        body: formData

                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "Upload failed."
                );

            }


            showUploadStatus(
                `✓ ${file.name} indexed successfully.`
            );


        } catch (error) {

            showUploadStatus(
                `✕ ${file.name}: ${error.message}`,
                true
            );

        }

    }


    await loadSources();

}


// ============================================================
// DELETE SOURCE
// ============================================================

async function deleteSource(source) {

    const confirmed =
        confirm(
            `Delete "${source}" from your Learnora knowledge base?`
        );


    if (!confirmed) {

        return;

    }


    showUploadStatus(
        `Deleting ${source}...`
    );


    try {

        const response =
            await fetch(
                `${API_URL}/sources/${encodeURIComponent(source)}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Could not delete source."
            );

        }


        showUploadStatus(
            `✓ ${source} deleted successfully.`
        );


        await loadSources();


    } catch (error) {

        showUploadStatus(
            `✕ ${error.message}`,
            true
        );

    }

}


// ============================================================
// RENDER INDEXED SOURCES
// ============================================================

function renderIndexedSources(
    sourceNames
) {

    sourceList.innerHTML = "";


    if (
        !Array.isArray(sourceNames) ||
        sourceNames.length === 0
    ) {

        sourceList.innerHTML = `

            <div class="empty-sources">

                <div>
                    ◇
                </div>

                <p>
                    No documents indexed yet.
                </p>

                <span>
                    Add a document above to get started.
                </span>

            </div>

        `;

        return;

    }


    sourceNames.forEach(
        source => {

            const row =
                document.createElement("div");


            row.className =
                "indexed-source";


            row.innerHTML = `

                <div class="source-file">

                    <div class="file-icon">
                        ${getFileIcon(source)}
                    </div>

                    <div class="file-name">
                        ${escapeHTML(source)}
                    </div>

                </div>


                <div class="source-actions">

                    <div class="indexed-badge">
                        Indexed
                    </div>

                    <button
                        class="delete-source"
                        type="button"
                        title="Delete source"
                    >
                        ×
                    </button>

                </div>

            `;


            const deleteButton =
                row.querySelector(
                    ".delete-source"
                );


            deleteButton.addEventListener(
                "click",
                () => deleteSource(source)
            );


            sourceList.appendChild(
                row
            );

        }
    );

}


// ============================================================
// FILE ICON
// ============================================================

function getFileIcon(
    filename
) {

    const extension =
        filename
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "pdf") {

        return "PDF";

    }


    if (extension === "docx") {

        return "DOC";

    }


    if (extension === "md") {

        return "MD";

    }


    return "TXT";

}


// ============================================================
// UPLOAD STATUS
// ============================================================

function showUploadStatus(
    message,
    isError = false
) {

    uploadStatus.textContent =
        message;


    uploadStatus.classList.remove(
        "hidden"
    );


    uploadStatus.style.color =
        isError
            ? "#ff7d89"
            : "#aaa8b8";

}


// ============================================================
// ERROR
// ============================================================

function showError(
    message
) {

    uncertaintyText.textContent =
        message;


    uncertainty.classList.remove(
        "hidden"
    );


    uncertainty.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ============================================================
// NAVIGATION
// ============================================================

function scrollToSection(
    sectionId
) {

    const section =
        document.getElementById(
            sectionId
        );


    if (!section) {

        return;

    }


    section.scrollIntoView({
        behavior: "smooth"
    });

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}