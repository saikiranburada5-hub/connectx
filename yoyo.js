function initYoyo() {
    const answers = [
        {
            matches: ["book", "booking", "service", "hire", "worker", "plumber", "electrician", "carpenter", "cleaner", "painter", "mason", "mechanic", "ac repair", "gardener", "maid", "appliance"],
            text: "To book a service, head to the Services page, select what you need, describe your issue (by voice or text), and select a nearby verified provider to confirm.",
            link: { label: "Browse Services", href: "/services" }
        },
        {
            matches: ["request", "status", "track", "tracking", "my booking", "where", "arrival", "eta", "distance", "coming", "live"],
            text: "You can track your service requests live under 'Requests'. When your provider is on the way, real-time map location, ETA countdown, and distance update automatically.",
            link: { label: "View My Requests", href: "/requests" }
        },
        {
            matches: ["history", "previous", "past booking", "all bookings", "my bookings"],
            text: "You can check all your previous and active bookings in your booking history.",
            link: { label: "My Bookings History", href: "/bookings" }
        },
        {
            matches: ["address", "location", "saved address", "home address", "gps", "pincode", "city"],
            text: "You can save multiple home/work addresses in your Profile for 1-click booking, or use GPS location detection on the Location step.",
            link: { label: "Manage Saved Addresses", href: "/profile" }
        },
        {
            matches: ["pay", "payment", "price", "cost", "fee", "rate", "money", "charges", "estimate"],
            text: "All pricing estimates are transparent and displayed upfront before you confirm. Payment can be completed online or after the provider finishes the job."
        },
        {
            matches: ["worker", "provider", "professional", "rating", "filter", "sort", "nearest", "reviews", "experience"],
            text: "Our service providers are verified professionals. You can sort nearby available providers by nearest distance, highest customer ratings, or lowest price."
        },
        {
            matches: ["feedback", "complaint", "suggestion", "issue", "problem", "review", "rate"],
            text: "Your feedback helps us continuously improve ConnectX! You can submit suggestions or report any issue from our Feedback page.",
            link: { label: "Give Feedback", href: "/feedback" }
        },
        {
            matches: ["language", "hindi", "tamil", "telugu", "kannada", "english", "translate", "voice lang"],
            text: "ConnectX supports 5 languages: English, Hindi, Tamil, Telugu, and Kannada. You can update your language anytime in your Profile.",
            link: { label: "Change Language", href: "/profile" }
        },
        {
            matches: ["login", "sign in", "account", "otp", "phone", "number", "register", "profile"],
            text: "You can sign in with any 10-digit mobile number using instant OTP verification, or review your profile details.",
            link: { label: "Login / Get Started", href: "/login" }
        },
        {
            matches: ["help", "support", "contact", "agent", "customer care", "email", "reach"],
            text: "Need extra help? You can view common questions on our Help page or reach out directly to our support team at support@connectx.local.",
            link: { label: "Help Center", href: "/help" }
        },
        {
            matches: ["hello", "hi", "hey", "yoyo", "who are you", "start", "good morning", "good evening"],
            text: "Hello! I'm Yoyo, your smart ConnectX AI assistant. You can speak 🎙️ or type to ask about bookings, tracking, providers, addresses, payments, or feedback."
        }
    ];

    function getSpeechLang() {
        const currentLang = window.gigconnectLanguage || "English";
        const map = {
            "Hindi": "hi-IN",
            "Tamil": "ta-IN",
            "Telugu": "te-IN",
            "Kannada": "kn-IN",
            "English": "en-IN"
        };
        return map[currentLang] || "en-IN";
    }

    function answer(question) {
        const normalized = question.toLowerCase();
        const match = answers.find((item) => item.matches.some((word) => normalized.includes(word)));
        return match || {
            text: "I can help with booking services, checking requests, payments, language change, and feedback. Try asking something like 'How do I book a plumber?' or 'Where are my requests?'"
        };
    }

    function createChatInstance(options) {
        const { form, input, messages, micBtn, voiceStatus, voiceMsg } = options;
        if (!form || !input || !messages) return null;

        function addMessage(text, type, link) {
            const message = document.createElement("div");
            message.className = `yoyo-message ${type}`;
            message.textContent = text;
            if (link) {
                const anchor = document.createElement("a");
                anchor.href = link.href;
                anchor.textContent = link.label;
                anchor.className = "yoyo-answer-link";
                message.append(document.createElement("br"));
                message.append(anchor);
            }
            messages.append(message);
            messages.scrollTop = messages.scrollHeight;
        }

        function submitQuestion(question) {
            const trimmed = question.trim();
            if (!trimmed) return;
            addMessage(trimmed, "yoyo-user");
            const response = answer(trimmed);
            setTimeout(() => {
                addMessage(response.text, "yoyo-bot", response.link);
            }, 250);
            input.value = "";
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            submitQuestion(input.value);
        });

        // Voice Recognition with 6s Silence Auto-Off
        let recognition = null;
        let isListening = false;
        let baseInput = "";
        let accumulatedText = "";
        let voiceStatusTimeout = null;
        let silenceTimeout = null;
        const SILENCE_LIMIT_MS = 6000;
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

        function resetSilenceTimer() {
            if (silenceTimeout) clearTimeout(silenceTimeout);
            silenceTimeout = setTimeout(() => {
                if (isListening) {
                    stopListening("Mic turned off (6s silence). Review and tap Send.");
                }
            }, SILENCE_LIMIT_MS);
        }

        function clearSilenceTimer() {
            if (silenceTimeout) {
                clearTimeout(silenceTimeout);
                silenceTimeout = null;
            }
        }

        function showVoiceStatus(msg, isError = false) {
            if (!voiceStatus) return;
            if (voiceStatusTimeout) clearTimeout(voiceStatusTimeout);
            voiceStatus.style.display = "flex";
            voiceStatus.className = "yoyo-voice-status" + (isError ? " is-error" : "");
            if (voiceMsg) voiceMsg.textContent = msg;
        }

        function hideVoiceStatus(delay = 0) {
            if (!voiceStatus) return;
            if (voiceStatusTimeout) clearTimeout(voiceStatusTimeout);
            if (delay > 0) {
                voiceStatusTimeout = setTimeout(() => {
                    voiceStatus.style.display = "none";
                }, delay);
            } else {
                voiceStatus.style.display = "none";
            }
        }

        function startListening() {
            if (!SpeechRecognitionClass) {
                showVoiceStatus("Voice recognition is not supported in this browser.", true);
                hideVoiceStatus(3500);
                return;
            }

            try {
                if (recognition) {
                    try { recognition.abort(); } catch (e) {}
                }

                recognition = new SpeechRecognitionClass();
                recognition.lang = getSpeechLang();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.maxAlternatives = 1;

                baseInput = input.value.trim();
                accumulatedText = "";

                recognition.onstart = () => {
                    isListening = true;
                    if (micBtn) {
                        micBtn.classList.add("is-listening");
                        micBtn.textContent = "⏹️";
                        micBtn.title = "Tap to stop recording";
                    }
                    showVoiceStatus("Listening... (Auto-stops if silent for 6s)");
                    resetSilenceTimer();
                };

                recognition.onresult = (event) => {
                    resetSilenceTimer();
                    let currentFinal = "";
                    let currentInterim = "";

                    for (let i = 0; i < event.results.length; i++) {
                        const res = event.results[i];
                        if (res.isFinal) {
                            currentFinal += res[0].transcript + " ";
                        } else {
                            currentInterim += res[0].transcript;
                        }
                    }

                    accumulatedText = currentFinal;
                    const spokenSoFar = (accumulatedText + currentInterim).trim();

                    if (spokenSoFar) {
                        input.value = baseInput ? (baseInput + " " + spokenSoFar) : spokenSoFar;
                        if (currentInterim.trim()) {
                            showVoiceStatus(`Hearing: "${currentInterim.trim()}"`);
                        }
                    }
                };

                recognition.onerror = (event) => {
                    console.warn("Yoyo speech error:", event.error);
                    if (event.error === "no-speech") return;
                    isListening = false;
                    clearSilenceTimer();
                    if (micBtn) {
                        micBtn.classList.remove("is-listening");
                        micBtn.textContent = "🎙️";
                        micBtn.title = "Speak to Yoyo";
                    }
                    if (event.error === "not-allowed") {
                        showVoiceStatus("Microphone permission denied.", true);
                    } else {
                        showVoiceStatus("Voice error. Tap 🎙️ to try again.", true);
                    }
                    hideVoiceStatus(3500);
                };

                recognition.onend = () => {
                    if (isListening) {
                        try {
                            baseInput = input.value.trim();
                            accumulatedText = "";
                            recognition.start();
                            return;
                        } catch (e) {}
                    }
                    isListening = false;
                    clearSilenceTimer();
                    if (micBtn) {
                        micBtn.classList.remove("is-listening");
                        micBtn.textContent = "🎙️";
                        micBtn.title = "Speak to Yoyo";
                    }
                    if (input.value.trim()) {
                        showVoiceStatus("Voice captured. Review and tap Send.");
                        hideVoiceStatus(3000);
                        input.focus();
                    } else {
                        hideVoiceStatus();
                    }
                };

                recognition.start();

            } catch (err) {
                console.error("Yoyo speech start error:", err);
                isListening = false;
                clearSilenceTimer();
                if (micBtn) {
                    micBtn.classList.remove("is-listening");
                    micBtn.textContent = "🎙️";
                    micBtn.title = "Speak to Yoyo";
                }
                showVoiceStatus("Could not start microphone.", true);
                hideVoiceStatus(3500);
            }
        }

        function stopListening(message) {
            isListening = false;
            clearSilenceTimer();
            if (recognition) {
                try { recognition.stop(); } catch (e) {}
            }
            if (micBtn) {
                micBtn.classList.remove("is-listening");
                micBtn.textContent = "🎙️";
                micBtn.title = "Speak to Yoyo";
            }
            if (message) {
                showVoiceStatus(message);
                hideVoiceStatus(3500);
                input.focus();
            } else if (input.value.trim()) {
                showVoiceStatus("Voice captured. Review and tap Send.");
                hideVoiceStatus(3000);
                input.focus();
            } else {
                hideVoiceStatus();
            }
        }

        if (micBtn) {
            micBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (isListening) {
                    stopListening();
                } else {
                    startListening();
                }
            });
        }

        return { submitQuestion, stopListening, input };
    }

    // Initialize Embedded Home Chatbot (if present on index.html)
    const homeForm = document.getElementById("yoyo-home-form");
    const homeInput = document.getElementById("yoyo-home-input");
    const homeMessages = document.getElementById("yoyo-home-messages");
    const homeMic = document.getElementById("yoyo-home-mic");
    const homeVoiceStatus = document.getElementById("yoyo-home-voice-status");
    const homeVoiceMsg = document.getElementById("yoyo-home-voice-msg");

    let homeChatInstance = null;
    if (homeForm && homeInput && homeMessages) {
        homeChatInstance = createChatInstance({
            form: homeForm,
            input: homeInput,
            messages: homeMessages,
            micBtn: homeMic,
            voiceStatus: homeVoiceStatus,
            voiceMsg: homeVoiceMsg
        });

        document.querySelectorAll("[data-yoyo-embed-question]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (homeChatInstance) {
                    homeChatInstance.submitQuestion(btn.dataset.yoyoEmbedQuestion);
                }
            });
        });
    }

    // Initialize Floating Widget (if present)
    const panel = document.getElementById("yoyo-panel");
    const launchers = document.querySelectorAll("[data-yoyo-open]");
    const closeButton = document.querySelector("[data-yoyo-close]");
    const widgetForm = document.getElementById("yoyo-form");
    const widgetInput = document.getElementById("yoyo-input");
    const widgetMessages = document.getElementById("yoyo-messages");
    const widgetMic = document.getElementById("yoyo-mic");
    const widgetVoiceStatus = document.getElementById("yoyo-voice-status");
    const widgetVoiceMsg = document.getElementById("yoyo-voice-msg");

    let widgetChatInstance = null;
    if (widgetForm && widgetInput && widgetMessages) {
        widgetChatInstance = createChatInstance({
            form: widgetForm,
            input: widgetInput,
            messages: widgetMessages,
            micBtn: widgetMic,
            voiceStatus: widgetVoiceStatus,
            voiceMsg: widgetVoiceMsg
        });
    }

    if (panel && launchers.length > 0) {
        function openWidget() {
            panel.hidden = false;
            launchers.forEach(l => l.setAttribute("aria-expanded", "true"));
            if (widgetInput) widgetInput.focus();
        }

        function closeWidget() {
            panel.hidden = true;
            launchers.forEach(l => l.setAttribute("aria-expanded", "false"));
            if (widgetChatInstance) widgetChatInstance.stopListening();
        }

        launchers.forEach(launcher => {
            launcher.addEventListener("click", () => {
                if (panel.hidden) {
                    openWidget();
                } else {
                    closeWidget();
                }
            });
        });

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                closeWidget();
                const firstLauncher = document.querySelector("[data-yoyo-open]");
                if (firstLauncher) firstLauncher.focus();
            });
        }

        document.querySelectorAll("[data-yoyo-question]").forEach((button) => {
            button.addEventListener("click", () => {
                openWidget();
                if (widgetChatInstance) {
                    widgetChatInstance.submitQuestion(button.dataset.yoyoQuestion);
                }
            });
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initYoyo);
} else {
    initYoyo();
}
