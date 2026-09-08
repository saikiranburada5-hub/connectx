(function () {
    const panel = document.getElementById("yoyo-panel");
    const launcher = document.querySelector("[data-yoyo-open]");
    const closeButton = document.querySelector("[data-yoyo-close]");
    const form = document.getElementById("yoyo-form");
    const input = document.getElementById("yoyo-input");
    const messages = document.getElementById("yoyo-messages");
    const micBtn = document.getElementById("yoyo-mic");
    const voiceStatus = document.getElementById("yoyo-voice-status");
    const voiceMsg = document.getElementById("yoyo-voice-msg");

    if (!panel || !launcher || !form || !input || !messages) return;

    const answers = [
        {
            matches: ["book", "booking", "service", "hire", "worker", "plumber", "electrician", "carpenter", "cleaner"],
            text: "To book a service, head to the Services page, select the service you need, describe what's needed (by voice or text), and choose a nearby provider to confirm."
        },
        {
            matches: ["request", "status", "track", "tracking", "my booking", "where", "arrival", "eta"],
            text: "You can track your service requests live under 'Requests'. When a provider is on their way, live ETA and proximity updates will appear automatically.",
            link: { label: "View My Requests", href: "/requests" }
        },
        {
            matches: ["pay", "payment", "price", "cost", "fee", "rate", "money"],
            text: "Pricing is shown upfront before you confirm. Payment can be completed online after the provider marks your service as completed."
        },
        {
            matches: ["feedback", "complaint", "suggestion", "issue", "problem", "review", "rating"],
            text: "We value your input! You can submit suggestions or report issues from the Feedback page, or rate your provider after a job.",
            link: { label: "Give Feedback", href: "/feedback" }
        },
        {
            matches: ["login", "sign in", "account", "otp", "phone", "number", "register"],
            text: "You can sign in or register with any 10-digit mobile number using instant OTP verification."
        },
        {
            matches: ["language", "hindi", "tamil", "telugu", "kannada", "english", "translate"],
            text: "You can change your language anytime from your Profile page. We support English, Hindi, Tamil, Telugu, and Kannada.",
            link: { label: "Change Language", href: "/profile" }
        },
        {
            matches: ["hello", "hi", "hey", "help", "yoyo", "who are you"],
            text: "Hello! I'm Yoyo, your smart assistant. You can speak or type to ask about bookings, tracking, workers, payments, or feedback."
        }
    ];

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

    function answer(question) {
        const normalized = question.toLowerCase();
        const match = answers.find((item) => item.matches.some((word) => normalized.includes(word)));
        return match || {
            text: "I can help with booking services, checking requests, payments, language change, and feedback. Try asking something like 'How do I book a plumber?' or 'Where are my requests?'"
        };
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

    launcher.addEventListener("click", () => {
        panel.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        input.focus();
    });

    closeButton.addEventListener("click", () => {
        panel.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
        launcher.focus();
        stopYoyoListening();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitQuestion(input.value);
    });

    document.querySelectorAll("[data-yoyo-question]").forEach((button) => {
        button.addEventListener("click", () => submitQuestion(button.dataset.yoyoQuestion));
    });

    // ==========================================
    // YOYO VOICE / MICROPHONE SUPPORT WITH 6S AUTO-OFF
    // ==========================================
    let yoyoRecognition = null;
    let isYoyoListening = false;
    let baseInput = "";
    let accumulatedText = "";
    let voiceStatusTimeout = null;
    let silenceTimeout = null;
    const SILENCE_LIMIT_MS = 6000; // Automatically turns off after 6 seconds of silence
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    function resetSilenceTimer() {
        if (silenceTimeout) clearTimeout(silenceTimeout);
        silenceTimeout = setTimeout(() => {
            if (isYoyoListening) {
                handleSilenceAutoOff();
            }
        }, SILENCE_LIMIT_MS);
    }

    function clearSilenceTimer() {
        if (silenceTimeout) {
            clearTimeout(silenceTimeout);
            silenceTimeout = null;
        }
    }

    function handleSilenceAutoOff() {
        isYoyoListening = false;
        clearSilenceTimer();
        if (yoyoRecognition) {
            try { yoyoRecognition.stop(); } catch (e) {}
        }
        if (micBtn) {
            micBtn.classList.remove("is-listening");
            micBtn.textContent = "🎙️";
            micBtn.title = "Speak to Yoyo";
        }
        if (input.value.trim()) {
            showVoiceStatus("Mic turned off (6s silence). Review and tap Send.");
            hideVoiceStatus(4000);
            input.focus();
        } else {
            showVoiceStatus("Mic turned off due to 6s inactivity.");
            hideVoiceStatus(3500);
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

    function startYoyoListening() {
        if (!SpeechRecognitionClass) {
            showVoiceStatus("Voice recognition is not supported in this browser.", true);
            hideVoiceStatus(3500);
            return;
        }

        try {
            if (yoyoRecognition) {
                try { yoyoRecognition.abort(); } catch (e) {}
            }

            yoyoRecognition = new SpeechRecognitionClass();
            yoyoRecognition.lang = getSpeechLang();
            yoyoRecognition.continuous = true;
            yoyoRecognition.interimResults = true;
            yoyoRecognition.maxAlternatives = 1;

            baseInput = input.value.trim();
            accumulatedText = "";

            yoyoRecognition.onstart = () => {
                isYoyoListening = true;
                if (micBtn) {
                    micBtn.classList.add("is-listening");
                    micBtn.textContent = "⏹️";
                    micBtn.title = "Tap to stop recording";
                }
                showVoiceStatus("Listening... (Auto-stops if silent for 6s)");
                resetSilenceTimer(); // Start 6-second silence countdown
            };

            yoyoRecognition.onresult = (event) => {
                resetSilenceTimer(); // Reset 6-second silence countdown upon hearing speech

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

            yoyoRecognition.onerror = (event) => {
                console.warn("Yoyo speech error:", event.error);
                if (event.error === "no-speech") {
                    // Browser detected brief no-speech, let silence timer handle full 6s
                    return;
                }
                isYoyoListening = false;
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

            yoyoRecognition.onend = () => {
                if (isYoyoListening) {
                    // If user is still recording and 6s silence has not expired, restart engine
                    try {
                        baseInput = input.value.trim();
                        accumulatedText = "";
                        yoyoRecognition.start();
                        return;
                    } catch (e) {}
                }
                isYoyoListening = false;
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

            yoyoRecognition.start();

        } catch (err) {
            console.error("Yoyo speech start error:", err);
            isYoyoListening = false;
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

    function stopYoyoListening() {
        isYoyoListening = false;
        clearSilenceTimer();
        if (yoyoRecognition) {
            try {
                yoyoRecognition.stop();
            } catch (e) {}
        }
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
    }

    if (micBtn) {
        micBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (isYoyoListening) {
                stopYoyoListening();
            } else {
                startYoyoListening();
            }
        });
    }

}());
