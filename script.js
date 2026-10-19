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
        { brand: "Nykd by Nykaa", name: "Ultimate Cotton Flare Leggings", price: "₹1,107", detail: "Cotton comfort with a flared silhouette" },
        { brand: "Styli", name: "Pintuck Drawstring Wide-Leg Joggers", price: "₹750", detail: "Relaxed joggers for everyday wear" },
        { brand: "Mabish By Sonal Jain", name: "Blue Cotton Sleeveless Co-Ord Set", price: "₹1,428", detail: "An easy coordinated look" },
        { brand: "H&M", name: "Blue Wide High-Waist Jeans", price: "₹1,999", detail: "A versatile denim essential" },
        { brand: "Tripursundari Fashion", name: "Navy Blue Denim Mini Skirt", price: "₹867", detail: "Denim with a front-and-centre look" },
        { brand: "PURYS", name: "Ombre Kimono Printed Shrug", price: "₹798", detail: "A lightweight layering piece" },
        { brand: "Buynewtrend", name: "Yellow Striped Wrap-Style Cotton Shirt", price: "₹705", detail: "A bright casual shirt" },
        { brand: "PIMU", name: "Blue V-Neck Midi Dress", price: "₹810", detail: "An easy one-piece outfit" },
        { brand: "Odette", name: "Black Solid Polyester Top", price: "₹323", detail: "A simple wardrobe basic" },
        { brand: "Outzidr", name: "Pink Cinched-Waist Maxi Dress", price: "₹996", detail: "A defined waist with a flowing length" },
        { brand: "Cider", name: "Boat-Neck Ruched Long-Sleeve Tee", price: "₹931", detail: "A modern fitted everyday style" },
        { brand: "Off Duty India", name: "Grunge Edge High-Waisted Denim", price: "₹1,738", detail: "Statement denim styling" },
        { brand: "Twenty Dresses by Nykaa Fashion", name: "Denim Midi Dress with Pockets", price: "₹1,330", detail: "Denim dress with practical pockets" },
        { brand: "MYSHKA", name: "Rust Cotton Embroidered Top", price: "₹810", detail: "A warm tone with embroidered detail" },
        { brand: "Miss Chase", name: "Blue Flared Wide-Leg High-Rise Jeans", price: "₹1,260", detail: "Flared denim with a high-rise fit" },
        { brand: "ZUMMER", name: "Off-White Embroidered A-Line Dress", price: "₹1,949", detail: "An embroidered A-line silhouette" }
    ];

    const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));

    const productCards = products.map(product => `
        <article class="fashion-product-card">
            <div class="fashion-product-art" aria-hidden="true"><span>STYLE<br>EDIT</span></div>
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
            "Please enter the date in YYYY-MM-DD format.";

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
            "Date verification:",
            response.status,
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Invalid date."
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
            "Date verification error:",
            error
        );


        dateError.textContent =
            error.message ||
            "Unable to verify date.";


    } finally {

        button.disabled = false;
        button.textContent = "Continue";
    }
}