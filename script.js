// ============================================================
// VERCEL BACKEND URL
// ============================================================

const API_BASE =
    "https://secure-chat-backend-eight.vercel.app/api";

const VERIFY_DATE_API =
    `${API_BASE}/verify-date`;

const LOGIN_API =
    `${API_BASE}/login`;

const MESSAGES_API =
    `${API_BASE}/messages`;

const LOGOUT_API =
    `${API_BASE}/logout`;


// ============================================================
// AUTHENTICATION STATE
// ============================================================

let dateToken = "";
let sessionToken = "";
let csrfToken = "";
let chatAuthenticated = false;


// ============================================================
// CHAT STATE
// ============================================================

let chatInitialized = false;
let messagePolling = null;
let lastMessageSignature = "";


// ============================================================
// IMAGE CONFIGURATION
//
// A source photo can be up to 10 MB.
// The browser compresses it before sending it.
//
// This allows normal iPhone photos of 2–3 MB,
// while keeping the final request smaller.
// ============================================================

const MAX_IMAGE_SIZE =
    10 * 1024 * 1024;

const MAX_UPLOAD_BYTES =
    2 * 1024 * 1024;

const MAX_IMAGE_WIDTH =
    2400;

const MAX_IMAGE_HEIGHT =
    2400;


const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
	"image/heic",
	"image/heif"
];


// ============================================================
// LOAD WESTERNWEAR FASHION CONTENT
// Product names and prices are based on the linked Nykaa Fashion
// Westernwear category page and may change as the catalogue updates.
// ============================================================

function loadSapContent() {

    const categoryUrl = "https://www.nykaafashion.com/women/westernwear/c/3?transaction_id=ce2503392b089a9802a45ea834b2cd49&intcmp=nykaa:other:nf-women-dweb:default:categories-leadins-sale:SLIDING_WIDGET_V2:2:westernwear:-1:ce2503392b089a9802a45ea834b2cd49";

    const products = [
        { brand: "Nykd by Nykaa", name: "Ultimate Cotton Flare Leggings", price: "₹1,107", detail: "Cotton comfort with a flared silhouette", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
        { brand: "Styli", name: "Pintuck Drawstring Wide-Leg Joggers", price: "₹750", detail: "Relaxed joggers for everyday wear", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
        { brand: "Mabish By Sonal Jain", name: "Blue Cotton Sleeveless Co-Ord Set", price: "₹1,428", detail: "An easy coordinated look", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80" },
        { brand: "H&M", name: "Blue Wide High-Waist Jeans", price: "₹1,999", detail: "A versatile denim essential", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" },
        { brand: "Tripursundari Fashion", name: "Navy Blue Denim Mini Skirt", price: "₹867", detail: "Denim with a front-and-centre look", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" },
        { brand: "PURYS", name: "Ombre Kimono Printed Shrug", price: "₹798", detail: "A lightweight layering piece", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80" },
        { brand: "Buynewtrend", name: "Yellow Striped Wrap-Style Cotton Shirt", price: "₹705", detail: "A bright casual shirt", image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=600&q=80" },
        { brand: "PIMU", name: "Blue V-Neck Midi Dress", price: "₹810", detail: "An easy one-piece outfit", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80" },
        { brand: "Odette", name: "Black Solid Polyester Top", price: "₹323", detail: "A simple wardrobe basic", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=600&q=80" },
        { brand: "Outzidr", name: "Pink Cinched-Waist Maxi Dress", price: "₹996", detail: "A defined waist with a flowing length", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80" },
        { brand: "Cider", name: "Boat-Neck Ruched Long-Sleeve Tee", price: "₹931", detail: "A modern fitted everyday style", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80" },
        { brand: "Off Duty India", name: "Grunge Edge High-Waisted Denim", price: "₹1,738", detail: "Statement denim styling", image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80" },
        { brand: "Twenty Dresses by Nykaa Fashion", name: "Denim Midi Dress with Pockets", price: "₹1,330", detail: "Denim dress with practical pockets", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
        { brand: "MYSHKA", name: "Rust Cotton Embroidered Top", price: "₹810", detail: "A warm tone with embroidered detail", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80" },
        { brand: "Miss Chase", name: "Blue Flared Wide-Leg High-Rise Jeans", price: "₹1,260", detail: "Flared denim with a high-rise fit", image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=600&q=80" },
        { brand: "ZUMMER", name: "Off-White Embroidered A-Line Dress", price: "₹1,949", detail: "An embroidered A-line silhouette", image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=600&q=80" }
    ];

    const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));

    const productCards = products.map(product => `
        <article class="fashion-product-card">
            <div class="fashion-product-art"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80'"></div>
            <p class="fashion-brand">${escapeHtml(product.brand)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="fashion-detail">${escapeHtml(product.detail)}</p>
            <p class="fashion-price">${escapeHtml(product.price)} <span>listed price*</span></p>
            <a class="fashion-shop-link" href="${categoryUrl}" target="_blank" rel="noopener noreferrer">Explore on Nykaa Fashion ↗</a>
        </article>
    `).join("");

    const fashionContent = `
        <section class="fashion-intro">
            <p>Discover Westernwear across everyday basics, statement tops, dresses, denim, skirts, trousers, co-ord sets and lightweight layers.</p>
            <div class="fashion-category-chips">
                <span>Tops & Shirts</span><span>Dresses</span><span>Jeans & Denim</span>
                <span>Co-ord Sets</span><span>Skirts & Trousers</span><span>Layers</span>
            </div>
        </section>
        <div class="fashion-section-heading">
            <div><p class="section-kicker">BRANDS & PICKS</p><h3>Westernwear to explore</h3></div>
            <a href="${categoryUrl}" target="_blank" rel="noopener noreferrer">View category ↗</a>
        </div>
        <div class="fashion-product-grid">${productCards}</div>
        <p class="fashion-disclaimer">*Prices shown are examples captured from the linked category page and can change. Product cards link to the Westernwear category; they are not direct product-detail links.</p>
    `;

    const sapText = document.getElementById("sapText");
    if (sapText) {
        sapText.innerHTML = fashionContent;
        sapText.classList.remove("loading");
    }
}


// ============================================================
// SHOW PASSWORD SCREEN
// ============================================================

function showChatPasswordGate() {

    const askmeContainer =
        document.getElementById("askmeContainer");

    const passwordGate =
        document.getElementById("chatPasswordGate");

    const authenticatedChat =
        document.getElementById("authenticatedChat");

    const sapContainer =
        document.getElementById("sapContainer");


    if (askmeContainer) {
        askmeContainer.classList.add("visible");
        askmeContainer.classList.remove("chat-authenticated");
    }

    if (passwordGate) {
        passwordGate.classList.add("visible");
    }

    if (authenticatedChat) {
        authenticatedChat.classList.remove("visible");
    }

    if (sapContainer) {
        sapContainer.style.display = "none";
    }


    const passwordError =
        document.getElementById("passwordError");

    if (passwordError) {
        passwordError.textContent = "";
    }


    const password =
        document.getElementById("chatPassword");

    if (password) {

        password.value = "";

        setTimeout(() => {
            password.focus();
        }, 100);
    }
}


// ============================================================
// VERIFY DATE
// ============================================================

async function verifyDate() {

    const dateInputElement =
        document.getElementById("dateInput");

    const dateError =
        document.getElementById("dateError");

    const button =
        document.getElementById("verifyDateButton");


    if (
        !dateInputElement ||
        !dateError ||
        !button
    ) {

        console.error(
            "Date verification elements were not found."
        );

        return;
    }


    const dateInput =
        dateInputElement.value.trim();

    dateError.textContent = "";


    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            dateInput
        )
    ) {

        dateError.textContent =
            "Please valid product";

        return;
    }


    try {

        button.disabled = true;
        button.textContent = "Checking...";


        const response =
            await fetch(
                VERIFY_DATE_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            date: dateInput
                        })
                }
            );


        const responseText =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(responseText);

        } catch (jsonError) {

            console.error(
                "Date response is not valid JSON:",
                responseText
            );

            throw new Error(
                "Server returned an invalid response."
            );
        }


        console.log(
            " verification:",
            response.status,
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Invalid product."
            );
        }


        dateToken =
            result.dateToken || "";


        if (!dateToken) {

            console.warn(
                "Server did not return dateToken."
            );
        }


        showChatPasswordGate();


    } catch (error) {

        console.error(
            "verification error:",
            error
        );


        dateError.textContent =
            error.message ||
            "Unable to verify the product. Please try again.";


    } finally {

        button.disabled = false;
        button.textContent = "Continue";
    }
}


// ============================================================
// PASSWORD LOGIN
// ============================================================

async function loginToChat(event) {

    event.preventDefault();


    const passwordInput =
        document.getElementById("chatPassword");

    const errorElement =
        document.getElementById("passwordError");

    const unlockButton =
        document.getElementById("unlockButton");


    if (
        !passwordInput ||
        !errorElement ||
        !unlockButton
    ) {

        console.error(
            "Password login elements were not found."
        );

        return;
    }


    const password =
        passwordInput.value;


    if (!password) {

        errorElement.textContent =
            "Please enter your password.";

        return;
    }


    if (!dateToken) {

        errorElement.textContent =
            "Date verification has expired. Please verify the date again.";

        return;
    }


    errorElement.textContent = "";

    unlockButton.disabled = true;
    unlockButton.textContent = "Checking...";


    try {

        const response =
            await fetch(
                LOGIN_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            password: password,
                            dateToken: dateToken
                        })
                }
            );


        const responseText =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(responseText);

        } catch (jsonError) {

            console.error(
                "Login response is not valid JSON:",
                responseText
            );

            throw new Error(
                "Server returned an invalid response."
            );
        }


        console.log(
            "Login:",
            response.status,
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Invalid password."
            );
        }


        sessionToken =
            result.sessionToken || "";


        csrfToken =
            result.csrfToken || "";


        if (!sessionToken) {

            throw new Error(
                "Server did not return a session token."
            );
        }


        dateToken = "";

        chatAuthenticated = true;


        const passwordGate =
            document.getElementById(
                "chatPasswordGate"
            );

        const authenticatedChat =
            document.getElementById(
                "authenticatedChat"
            );


        const chatContainer = document.getElementById("askmeContainer");

        // Switch the entire overlay to chat mode. Inline display rules make
        // this reliable even if an older stylesheet is cached by the browser.
        if (chatContainer) {
            chatContainer.classList.add("visible", "chat-authenticated");
            chatContainer.style.cssText += ";position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;max-height:100dvh;margin:0;border:0;border-radius:0;z-index:99999;overflow:hidden;display:flex;flex-direction:column;background:#fff";
        }

        if (passwordGate) {
            passwordGate.classList.remove("visible");
            passwordGate.style.setProperty("display", "none", "important");
        }

        if (authenticatedChat) {
            authenticatedChat.classList.add("visible");
            authenticatedChat.style.setProperty("display", "flex", "important");
            authenticatedChat.style.setProperty("flex-direction", "column", "important");
            authenticatedChat.style.setProperty("height", "calc(100dvh - 58px)", "important");
            authenticatedChat.style.setProperty("min-height", "0", "important");
        }

        if (!chatInitialized) {

            initializeChat();

            chatInitialized = true;
        }


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        errorElement.textContent =
            error.message ||
            "Incorrect password. Please try again.";


        passwordInput.value = "";
        passwordInput.focus();


    } finally {

        unlockButton.disabled = false;
        unlockButton.textContent = "Open style notes";
    }
}


// ============================================================
// LOAD MESSAGES
// ============================================================

async function loadMessages() {

    if (!chatAuthenticated) {
        return;
    }


    if (!sessionToken) {

        console.error(
            "loadMessages: sessionToken is missing."
        );

        showChatError(
            "Chat session is missing. Please login again."
        );

        return;
    }


    const chat =
        document.getElementById("askme");


    if (!chat) {

        console.error(
            "Chat container #askme was not found."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${MESSAGES_API}?limit=50`,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json",

                        "Authorization":
                            `Bearer ${sessionToken}`
                    }
                }
            );


        const responseText =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(responseText);

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid response."
            );
        }


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationExpired();

            return;
        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                `Server returned ${response.status}`
            );
        }


        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result.error ||
                "Failed to load messages."
            );
        }


        if (
            !Array.isArray(result.messages)
        ) {

            throw new Error(
                "Invalid messages data received from server."
            );
        }


        renderMessages(
            result.messages
        );


    } catch (error) {

        console.error(
            "LOAD MESSAGES ERROR:",
            error
        );


        if (!chat.querySelector(".message")) {

            showChatError(
                error.message ||
                "Unable to connect to the chat server."
            );
        }
    }
}
// ============================================================
// FORMAT MESSAGE DATE & TIME
// ============================================================

function formatMessageDateTime(timestamp) {

    if (
        timestamp === null ||
        timestamp === undefined ||
        timestamp === ""
    ) {
        return "";
    }


    const date =
        new Date(
            Number(timestamp)
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }


    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    ).format(date);
}

// ============================================================
// RENDER MESSAGES
// ============================================================

function renderMessages(messages) {

    const chat =
        document.getElementById("askme");


    if (!chat) {

        throw new Error(
            "Chat container #askme was not found."
        );
    }


    if (!Array.isArray(messages)) {

        throw new Error(
            "Messages data is not an array."
        );
    }


    let signature;


    try {

        signature =
            JSON.stringify(messages);

    } catch (error) {

        signature = "";
    }


    if (
        signature &&
        signature === lastMessageSignature
    ) {

        return;
    }


    lastMessageSignature =
        signature;


    chat.innerHTML = "";


    if (messages.length === 0) {

        const emptyElement =
            document.createElement("div");

        emptyElement.className =
            "loading";

        emptyElement.textContent =
            "No messages yet.";

        chat.appendChild(
            emptyElement
        );

        return;
    }


    messages.forEach(
        message => {

            if (!message) {
                return;
            }


            const messageElement =
                document.createElement("div");

            messageElement.className =
                "message";


            // =================================================
            // USERNAME
            // =================================================

            const userElement =
                document.createElement("div");

            userElement.className =
                "message-user";

            userElement.textContent =
                `${message.username || "Unknown"}:`;

            messageElement.appendChild(
                userElement
            );
            
			// =================================================
			// MESSAGE DATE & TIME
			// =================================================

			const timeElement =
			document.createElement("div");

			timeElement.className =
			"message-time";

			timeElement.textContent =
			formatMessageDateTime(
			message.timestamp
			);

			if (timeElement.textContent) {

				messageElement.appendChild(
					timeElement
				);
				}

            // =================================================
            // PHOTO MESSAGE
            // =================================================

            if (
                message.type === "photo"
            ) {

                const imageContainer =
                    document.createElement("div");

                imageContainer.className =
                    "chat-image-container";


                const imageElement =
                    document.createElement("img");

                imageElement.className =
                    "chat-image";

                imageElement.alt =
                    "Chat image";

                imageElement.loading =
                    "lazy";

                imageElement.decoding =
                    "async";

                imageElement.style.display =
                    "none";


                imageContainer.appendChild(
                    imageElement
                );


                const loadingElement =
                    document.createElement("div");

                loadingElement.className =
                    "image-loading";

                loadingElement.textContent =
                    "Loading image...";


                imageContainer.appendChild(
                    loadingElement
                );


                messageElement.appendChild(
                    imageContainer
                );


                chat.appendChild(
                    messageElement
                );


                // =================================================
                // DISPLAY BASE64 IMAGE RETURNED BY BACKEND
                // =================================================

                if (message.image) {

                    try {

                        const imageType =
                            message.mimeType ||
                            "image/jpeg";


                        imageElement.src =
                            `data:${imageType};base64,${message.image}`;


                        imageElement.style.display =
                            "block";


                        loadingElement.remove();


                        imageElement.addEventListener(
                            "click",
                            () => {

                                openImageViewer(
                                    imageElement.src
                                );
                            }
                        );


                    } catch (imageError) {

                        console.error(
                            "Unable to display photo:",
                            imageError
                        );


                        loadingElement.textContent =
                            "Unable to display image.";
                    }

                } else {

                    loadingElement.textContent =
                        message.error ||
                        "Unable to load image.";
                }


                return;
            }


            // =================================================
            // TEXT MESSAGE
            // =================================================

            const textElement =
                document.createElement("div");

            textElement.className =
                "message-text";


            textElement.textContent =
                message.text || "";


            messageElement.appendChild(
                textElement
            );


            chat.appendChild(
                messageElement
            );
        }
    );


    chat.scrollTop =
        chat.scrollHeight;
}


// ============================================================
// IMAGE VIEWER
// ============================================================

function openImageViewer(
    imageSource
) {

    if (!imageSource) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "image-viewer-overlay";


    const image =
        document.createElement("img");

    image.className =
        "image-viewer-image";

    image.src =
        imageSource;

    image.alt =
        "Chat image";


    overlay.appendChild(
        image
    );


    overlay.addEventListener(
        "click",
        () => {
            overlay.remove();
        }
    );


    document.body.appendChild(
        overlay
    );
}


// ============================================================
// LOAD IMAGE FROM FILE
// ============================================================

function loadImageFromFile(file) {

    return new Promise(
        (resolve, reject) => {

            const objectUrl =
                URL.createObjectURL(file);


            const image =
                new Image();


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        objectUrl
                    );

                    resolve(image);
                };


            image.onerror =
                () => {

                    URL.revokeObjectURL(
                        objectUrl
                    );

                    reject(
                        new Error(
                            "The selected image could not be opened."
                        )
                    );
                };


            image.src =
                objectUrl;
        }
    );
}


// ============================================================
// PREPARE IMAGE FOR UPLOAD
// ============================================================

async function prepareImageForUpload(file) {

    if (
        file.size >
        MAX_IMAGE_SIZE
    ) {

        throw new Error(
            "The selected photo is too large. Please choose an image smaller than 10 MB."
        );
    }


    const image =
        await loadImageFromFile(file);


    let width =
        image.naturalWidth;

    let height =
        image.naturalHeight;


    if (
        !width ||
        !height
    ) {

        throw new Error(
            "Unable to determine the image dimensions."
        );
    }


    const scale =
        Math.min(
            1,
            MAX_IMAGE_WIDTH / width,
            MAX_IMAGE_HEIGHT / height
        );


    width =
        Math.max(
            1,
            Math.round(
                width * scale
            )
        );


    height =
        Math.max(
            1,
            Math.round(
                height * scale
            )
        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        width;

    canvas.height =
        height;


    const context =
        canvas.getContext(
            "2d"
        );


    if (!context) {

        throw new Error(
            "Your browser could not prepare the image."
        );
    }


    context.imageSmoothingEnabled =
        true;

    context.imageSmoothingQuality =
        "high";


    context.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    let outputType =
        file.type === "image/png"
            ? "image/png"
            : "image/jpeg";


    let quality =
        0.88;


    let blob =
        null;


    for (
        let attempt = 0;
        attempt < 7;
        attempt++
    ) {

        blob =
            await new Promise(
                resolve => {

                    canvas.toBlob(
                        resolve,
                        outputType,
                        quality
                    );
                }
            );


        if (!blob) {

            throw new Error(
                "Unable to compress the selected image."
            );
        }


        if (
            blob.size <=
            MAX_UPLOAD_BYTES
        ) {

            break;
        }


        if (
            outputType ===
            "image/png"
        ) {

            outputType =
                "image/jpeg";

            quality =
                0.88;

        } else {

            quality -=
                0.08;
        }
    }


    if (!blob) {

        throw new Error(
            "Unable to prepare the image."
        );
    }


    if (
        blob.size >
        MAX_UPLOAD_BYTES
    ) {

        throw new Error(
            "This photo could not be compressed enough for upload. Please choose a smaller photo."
        );
    }


    return blob;
}


// ============================================================
// BLOB TO BASE64
// ============================================================

function blobToBase64(blob) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    if (
                        typeof reader.result !==
                        "string"
                    ) {

                        reject(
                            new Error(
                                "Unable to read prepared image."
                            )
                        );

                        return;
                    }


                    const commaIndex =
                        reader.result.indexOf(",");


                    if (
                        commaIndex ===
                        -1
                    ) {

                        reject(
                            new Error(
                                "Invalid prepared image."
                            )
                        );

                        return;
                    }


                    resolve(
                        reader.result.slice(
                            commaIndex + 1
                        )
                    );
                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "Unable to read prepared image."
                        )
                    );
                };


            reader.readAsDataURL(
                blob
            );
        }
    );
}


// ============================================================
// IMAGE UPLOAD
// ============================================================

async function uploadImage(
    file
) {

    if (
        !chatAuthenticated ||
        !sessionToken
    ) {

        alert(
            "Please login to the chat first."
        );

        return;
    }


    if (!file) {
        return;
    }


    const selectedPhotoName =
        document.getElementById(
            "selectedPhotoName"
        );


    if (selectedPhotoName) {

        selectedPhotoName.textContent =
            file.name ||
            "Photo selected";
    }


    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {

        alert(
            "Please select an image file."
        );

        return;
    }

/*

    if (
        file.type === "image/heic" ||
        file.type === "image/heif"
    ) {

        alert(
            "HEIC/HEIF photos are not supported by this browser upload. Please choose JPG, PNG, or WebP from your iPhone."
        );

        return;
    }
*/


    if (
        !ALLOWED_IMAGE_TYPES.includes(
            file.type
        )
    ) {

        alert(
            "Please select a JPG, PNG, GIF, or WebP image."
        );

        return;
    }


    if (
        file.size >
        MAX_IMAGE_SIZE
    ) {

        alert(
            "The selected photo is too large. Maximum source size is 10 MB."
        );

        return;
    }


    const photoButton =
        document.getElementById(
            "photoButton"
        );


    if (photoButton) {

        photoButton.disabled =
            true;

        photoButton.textContent =
            "Uploading...";
    }


    try {

        console.log(
            "Preparing photo:",
            file.name,
            file.type,
            file.size
        );


        const preparedBlob =
            await prepareImageForUpload(
                file
            );


        console.log(
            "Prepared image:",
            preparedBlob.type,
            preparedBlob.size
        );


        const base64Image =
            await blobToBase64(
                preparedBlob
            );


        // ====================================================
        // IMPORTANT
        //
        // messages.js expects:
        //
        // type: "photo"
        //
        // NOT:
        //
        // type: "image"
        // ====================================================

        const response =
            await fetch(
                MESSAGES_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "Authorization":
                            `Bearer ${sessionToken}`
                    },

                    body:
                        JSON.stringify({

                            type:
                                "photo",

                            mimeType:
                                preparedBlob.type ||
                                "image/jpeg",

                            image:
                                base64Image
                        })
                }
            );


        const responseText =
            await response.text();


        console.log(
            "Photo upload response:",
            response.status,
            responseText
        );


        let result;


        try {

            result =
                JSON.parse(
                    responseText
                );

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid upload response."
            );
        }


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationExpired();

            return;
        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                `Server returned ${response.status}`
            );
        }


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Unable to upload image."
            );
        }


        console.log(
            "Photo uploaded successfully."
        );


        lastMessageSignature =
            "";


        await loadMessages();


    } catch (error) {

        console.error(
            "Image upload error:",
            error
        );


        alert(
            error.message ||
            "Unable to upload image. Please try again."
        );


    } finally {

        if (photoButton) {

            photoButton.disabled =
                false;

            photoButton.textContent =
                "Screen";
        }


        if (selectedPhotoName) {

            selectedPhotoName.textContent =
                "";
        }
    }
}


// ============================================================
// INITIALIZE IMAGE UPLOAD
// ============================================================

function initializeImageUpload() {

    const photoButton =
        document.getElementById(
            "photoButton"
        );


    const imageInput =
        document.getElementById(
            "imageInput"
        );


    if (
        !photoButton ||
        !imageInput
    ) {

        console.warn(
            "Photo upload elements were not found."
        );

        return;
    }


    photoButton.addEventListener(
        "click",
        () => {

            if (
                !chatAuthenticated ||
                !sessionToken
            ) {

                alert(
                    "Please login to the chat first."
                );

                return;
            }


            imageInput.click();
        }
    );


    imageInput.addEventListener(
        "change",
        async () => {

            const file =
                imageInput.files &&
                imageInput.files[0];


            if (!file) {
                return;
            }


            await uploadImage(
                file
            );


            imageInput.value =
                "";
        }
    );
}


// ============================================================
// SEND TEXT MESSAGE
// ============================================================

async function sendMessage(
    event
) {

    event.preventDefault();


    if (
        !chatAuthenticated ||
        !sessionToken
    ) {

        console.error(
            "Cannot send message: user is not authenticated."
        );

        return;
    }


    const input =
        document.getElementById("msg");


    const button =
        document.querySelector(
            "#form button[type='submit']"
        );


    if (
        !input ||
        !button
    ) {

        console.error(
            "Message input or send button was not found."
        );

        return;
    }


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    if (
        text.length >
        2000
    ) {

        alert(
            "Message is too long. Maximum 2000 characters."
        );

        return;
    }


    button.disabled =
        true;


    const originalButtonText =
        button.textContent;


    button.textContent =
        "Sending...";


    try {

        const response =
            await fetch(
                MESSAGES_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "Authorization":
                            `Bearer ${sessionToken}`
                    },

                    body:
                        JSON.stringify({

                            type:
                                "text",

                            text:
                                text
                        })
                }
            );


        const responseText =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(
                    responseText
                );

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid response."
            );
        }


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationExpired();

            return;
        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                `Server returned ${response.status}`
            );
        }


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Unable to send message."
            );
        }


        input.value =
            "";

        input.focus();


        lastMessageSignature =
            "";


        await loadMessages();


    } catch (error) {

        console.error(
            "Error sending message:",
            error
        );


        alert(
            error.message ||
            "Unable to send your message. Please try again."
        );


    } finally {

        button.disabled =
            false;

        button.textContent =
            originalButtonText ||
            "Notify to SAP";
    }
}


// ============================================================
// POLLING
// ============================================================

function startMessagePolling() {

    stopMessagePolling();


    loadMessages();


    messagePolling =
        setInterval(
            () => {

                if (
                    chatAuthenticated &&
                    sessionToken
                ) {

                    loadMessages();

                } else {

                    stopMessagePolling();
                }

            },
            2000
        );
}


// ============================================================
// STOP POLLING
// ============================================================

function stopMessagePolling() {

    if (messagePolling) {

        clearInterval(
            messagePolling
        );

        messagePolling =
            null;
    }
}


// ============================================================
// INITIALIZE CHAT
// ============================================================

function initializeChat() {

    const chat =
        document.getElementById("askme");


    if (chat) {
        chat.innerHTML = "";
    }


    lastMessageSignature =
        "";


    startMessagePolling();
}


// ============================================================
// DELETE ALL CHAT HISTORY
// ============================================================

async function deleteAllChatHistory() {

    if (
        !chatAuthenticated ||
        !sessionToken
    ) {

        alert(
            "You are not authenticated."
        );

        return;
    }


    const confirmed =
        confirm(
            "WARNING!\n\n" +
            "This will permanently delete ALL update messages and photos from the database.\n\n" +
            "This action cannot be undone.\n\n" +
            "Are you sure you want to continue?"
        );


    if (!confirmed) {
        return;
    }


    const button =
        document.getElementById(
            "deleteChatHistoryBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Deleting...";
    }


    try {

        const response =
            await fetch(
                MESSAGES_API,
                {

                    method:
                        "DELETE",

                    headers: {

                        "Accept":
                            "application/json",

                        "Authorization":
                            `Bearer ${sessionToken}`
                    }
                }
            );


        const responseText =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(
                    responseText
                );

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid delete response."
            );
        }


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationExpired();

            return;
        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                `Server returned ${response.status}`
            );
        }


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Unable to delete chat history."
            );
        }


        lastMessageSignature =
            "";


        const chat =
            document.getElementById(
                "askme"
            );


        if (chat) {

            chat.innerHTML =
                "";


            const emptyElement =
                document.createElement(
                    "div"
                );


            emptyElement.className =
                "loading";


            emptyElement.textContent =
                "No messages yet.";


            chat.appendChild(
                emptyElement
            );
        }


        alert(
            "All chat history has been deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete chat history error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete chat history."
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Delete updates";
        }
    }
}


// ============================================================
// LOGOUT / CLOSE CHAT
// ============================================================

async function closeChat() {

    stopMessagePolling();


    try {

        if (sessionToken) {

            await fetch(
                LOGOUT_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Accept":
                            "application/json",

                        "Authorization":
                            `Bearer ${sessionToken}`
                    }
                }
            );
        }

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    } finally {

        dateToken = "";
        sessionToken = "";
        csrfToken = "";
        chatAuthenticated = false;


        const dateInput =
            document.getElementById(
                "dateInput"
            );

        if (dateInput) {
            dateInput.value = "";
        }


        const dateError =
            document.getElementById(
                "dateError"
            );

        if (dateError) {
            dateError.textContent = "";
        }


        const password =
            document.getElementById(
                "chatPassword"
            );

        if (password) {
            password.value = "";
        }


        const passwordError =
            document.getElementById(
                "passwordError"
            );

        if (passwordError) {
            passwordError.textContent = "";
        }


        const messageInput =
            document.getElementById(
                "msg"
            );

        if (messageInput) {
            messageInput.value = "";
        }


        const imageInput =
            document.getElementById(
                "imageInput"
            );

        if (imageInput) {
            imageInput.value = "";
        }


        const selectedPhotoName =
            document.getElementById(
                "selectedPhotoName"
            );

        if (selectedPhotoName) {
            selectedPhotoName.textContent = "";
        }


        const passwordGate =
            document.getElementById(
                "chatPasswordGate"
            );

        if (passwordGate) {
            passwordGate.classList.remove(
                "visible"
            );
        }


        const authenticatedChat =
            document.getElementById(
                "authenticatedChat"
            );

        if (authenticatedChat) {
            authenticatedChat.classList.remove(
                "visible"
            );
        }


        const askmeContainer =
            document.getElementById(
                "askmeContainer"
            );

        if (askmeContainer) {
            askmeContainer.classList.remove(
                "visible"
            );

            askmeContainer.classList.remove("chat-authenticated");
        }


        const sapContainer =
            document.getElementById(
                "sapContainer"
            );

        if (sapContainer) {
            sapContainer.style.display =
                "block";
        }


        const chat =
            document.getElementById(
                "askme"
            );

        if (chat) {
            chat.innerHTML = "";
        }


        chatInitialized =
            false;

        lastMessageSignature =
            "";
    }
}


// ============================================================
// AUTHENTICATION EXPIRED
// ============================================================

function handleAuthenticationExpired() {

    chatAuthenticated =
        false;

    sessionToken =
        "";

    csrfToken =
        "";

    dateToken =
        "";


    stopMessagePolling();


    const askmeContainer =
        document.getElementById(
            "askmeContainer"
        );

    if (askmeContainer) {
        askmeContainer.classList.remove(
            "visible"
        );
    }


    const authenticatedChat =
        document.getElementById(
            "authenticatedChat"
        );

    if (authenticatedChat) {
        authenticatedChat.classList.remove(
            "visible"
        );
    }


    const passwordGate =
        document.getElementById(
            "chatPasswordGate"
        );

    if (passwordGate) {
        passwordGate.classList.remove(
            "visible"
        );
    }


    const sapContainer =
        document.getElementById(
            "sapContainer"
        );

    if (sapContainer) {
        sapContainer.style.display =
            "block";
    }


    const dateInput =
        document.getElementById(
            "dateInput"
        );

    if (dateInput) {
        dateInput.value = "";
    }


    chatInitialized =
        false;

    lastMessageSignature =
        "";


    alert(
        "Your chat session has expired. Please enter the date and password again."
    );
}


// ============================================================
// ERROR
// ============================================================

function showChatError(
    message
) {

    const chat =
        document.getElementById(
            "askme"
        );


    if (!chat) {
        return;
    }


    chat.innerHTML = "";


    const errorElement =
        document.createElement(
            "div"
        );


    errorElement.className =
        "error-message";


    errorElement.textContent =
        message;


    chat.appendChild(
        errorElement
    );
}


// ============================================================
// PAGE EVENTS
// ============================================================

function initializePage() {

        // Render the fashion cards immediately when the page is ready.
        try {
            loadSapContent();
        } catch (error) {
            console.error("Could not render fashion picks:", error);
            const target = document.getElementById("sapText");
            if (target) {
                target.classList.remove("loading");
                target.textContent = "Fashion picks could not be displayed. Please refresh the page.";
            }
        }


        const verifyDateButton =
            document.getElementById(
                "verifyDateButton"
            );


        if (verifyDateButton) {

            verifyDateButton.addEventListener(
                "click",
                verifyDate
            );
        }


        const dateInput =
            document.getElementById(
                "dateInput"
            );


        if (dateInput) {

            dateInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        verifyDate();
                    }
                }
            );
        }


        const passwordForm =
            document.getElementById(
                "passwordForm"
            );


        if (passwordForm) {

            passwordForm.addEventListener(
                "submit",
                loginToChat
            );
        }


        const cancelPasswordButton =
            document.getElementById(
                "cancelPasswordBtn"
            );


        if (cancelPasswordButton) {

            cancelPasswordButton.addEventListener(
                "click",
                closeChat
            );
        }


        const messageForm =
            document.getElementById(
                "form"
            );


        if (messageForm) {

            messageForm.addEventListener(
                "submit",
                sendMessage
            );
        }


        initializeImageUpload();


        const closeChatButton =
            document.getElementById(
                "closeaskmeBtn"
            );


        if (closeChatButton) {

            closeChatButton.addEventListener(
                "click",
                closeChat
            );
        }


        const deleteButton =
            document.getElementById(
                "deleteChatHistoryBtn"
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                deleteAllChatHistory
            );
        }


        console.log(
            "Chat application initialized."
        );
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage, { once: true });
} else {
    initializePage();
}
