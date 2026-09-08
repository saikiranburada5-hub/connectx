(function () {
    const language = window.gigconnectLanguage || 'English';
    if (language === 'English') return;

    const translations = {
        Hindi: {
            'ConnectX': 'कनेक्टएक्स', 'GigConnect': 'गिगकनेक्ट', 'Home': 'होम', 'Requests': 'अनुरोध', 'Profile': 'प्रोफ़ाइल', 'Help': 'सहायता',
            'Back to Home': 'होम पर वापस जाएं', 'Login / Get Started': 'लॉगिन / शुरू करें', 'Send OTP': 'ओटीपी भेजें',
            'Verify OTP': 'ओटीपी सत्यापित करें', 'Create Account': 'खाता बनाएं', 'Phone Number': 'फ़ोन नंबर',
            'One-Time Password': 'वन-टाइम पासवर्ड', 'Name': 'नाम', 'Email ID': 'ईमेल आईडी', 'Customer details': 'ग्राहक विवरण',
            'Preferences': 'प्राथमिकताएं', 'Language': 'भाषा', 'Save language': 'भाषा सहेजें', 'View my bookings': 'मेरी बुकिंग देखें',
            'Log out': 'लॉग आउट', 'Choose your language': 'अपनी भाषा चुनें', 'Preferred language': 'पसंदीदा भाषा', 'Continue': 'जारी रखें',
            'Where do you need the service?': 'आपको सेवा कहां चाहिए?', 'Continue to Services': 'सेवाओं पर जाएं',
            'Select services': 'सेवाएं चुनें', 'Problem details': 'समस्या का विवरण', 'Continue to choose a provider': 'प्रदाता चुनने के लिए जारी रखें',
            'Worker on the way': 'कर्मचारी रास्ते में है', 'Requests': 'अनुरोध', 'View booking details': 'बुकिंग विवरण देखें',
            'Cancel request': 'अनुरोध रद्द करें', 'Estimated price': 'अनुमानित कीमत', 'Provider': 'प्रदाता', 'Service': 'सेवा',
            'Distance': 'दूरी', 'ETA': 'अनुमानित समय', 'Status': 'स्थिति', 'Heading your way': 'आपकी ओर आ रहा है',
            'At your location': 'आपके स्थान पर', 'Active': 'सक्रिय', 'Customer Account': 'ग्राहक खाता', 'Account': 'खाता',
            'Use Current Location': 'वर्तमान स्थान का उपयोग करें', 'Save': 'सहेजें', 'Available': 'उपलब्ध', 'Send Request': 'अनुरोध भेजें'
        },
        Kannada: {
            'ConnectX': 'ಕನೆಕ್ಟ್‌ಎಕ್ಸ್', 'GigConnect': 'ಗಿಗ್‌ಕನೆಕ್ಟ್', 'Home': 'ಮುಖಪುಟ', 'Requests': 'ವಿನಂತಿಗಳು', 'Profile': 'ಪ್ರೊಫೈಲ್', 'Help': 'ಸಹಾಯ',
            'Back to Home': 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ', 'Login / Get Started': 'ಲಾಗಿನ್ / ಪ್ರಾರಂಭಿಸಿ', 'Send OTP': 'ಒಟಿಪಿ ಕಳುಹಿಸಿ',
            'Verify OTP': 'ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ', 'Create Account': 'ಖಾತೆ ರಚಿಸಿ', 'Phone Number': 'ಫೋನ್ ಸಂಖ್ಯೆ',
            'One-Time Password': 'ಒನ್-ಟೈಮ್ ಪಾಸ್‌ವರ್ಡ್', 'Name': 'ಹೆಸರು', 'Email ID': 'ಇಮೇಲ್ ಐಡಿ', 'Customer details': 'ಗ್ರಾಹಕರ ವಿವರಗಳು',
            'Preferences': 'ಆದ್ಯತೆಗಳು', 'Language': 'ಭಾಷೆ', 'Save language': 'ಭಾಷೆ ಉಳಿಸಿ', 'View my bookings': 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳನ್ನು ನೋಡಿ',
            'Log out': 'ಲಾಗ್ ಔಟ್', 'Choose your language': 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'Preferred language': 'ಆದ್ಯತೆಯ ಭಾಷೆ', 'Continue': 'ಮುಂದುವರಿಸಿ',
            'Where do you need the service?': 'ಸೇವೆ ನಿಮಗೆ ಎಲ್ಲಿ ಬೇಕು?', 'Continue to Services': 'ಸೇವೆಗಳಿಗೆ ಮುಂದುವರಿಸಿ',
            'Problem details': 'ಸಮಸ್ಯೆಯ ವಿವರಗಳು', 'View booking details': 'ಬುಕಿಂಗ್ ವಿವರಗಳನ್ನು ನೋಡಿ', 'Cancel request': 'ವಿನಂತಿಯನ್ನು ರದ್ದುಮಾಡಿ',
            'Estimated price': 'ಅಂದಾಜು ಬೆಲೆ', 'Provider': 'ಸೇವಾ ಪೂರೈಕೆದಾರ', 'Service': 'ಸೇವೆ', 'Distance': 'ದೂರ', 'ETA': 'ಅಂದಾಜು ಸಮಯ',
            'Status': 'ಸ್ಥಿತಿ', 'Heading your way': 'ನಿಮ್ಮ ಕಡೆಗೆ ಬರುತ್ತಿದ್ದಾರೆ', 'At your location': 'ನಿಮ್ಮ ಸ್ಥಳದಲ್ಲಿದ್ದಾರೆ',
            'Active': 'ಸಕ್ರಿಯ', 'Customer Account': 'ಗ್ರಾಹಕರ ಖಾತೆ', 'Account': 'ಖಾತೆ', 'Use Current Location': 'ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ',
            'Available': 'ಲಭ್ಯವಿದೆ', 'Send Request': 'ವಿನಂತಿ ಕಳುಹಿಸಿ'
        },
        Telugu: {
            'ConnectX': 'కనెక్ట్‌ఎక్స్', 'GigConnect': 'గిగ్‌కనెక్ట్', 'Home': 'హోమ్', 'Requests': 'అభ్యర్థనలు', 'Profile': 'ప్రొఫైల్', 'Help': 'సహాయం',
            'Back to Home': 'హోమ్‌కు తిరిగి వెళ్ళండి', 'Login / Get Started': 'లాగిన్ / ప్రారంభించండి', 'Send OTP': 'ఓటీపీ పంపండి',
            'Verify OTP': 'ఓటీపీ ధృవీకరించండి', 'Create Account': 'ఖాతా సృష్టించండి', 'Phone Number': 'ఫోన్ నంబర్',
            'One-Time Password': 'వన్-టైమ్ పాస్‌వర్డ్', 'Name': 'పేరు', 'Email ID': 'ఈమెయిల్ ఐడి', 'Customer details': 'కస్టమర్ వివరాలు',
            'Preferences': 'ప్రాధాన్యతలు', 'Language': 'భాష', 'Save language': 'భాషను సేవ్ చేయండి', 'View my bookings': 'నా బుకింగ్‌లను చూడండి',
            'Log out': 'లాగ్ అవుట్', 'Choose your language': 'మీ భాషను ఎంచుకోండి', 'Preferred language': 'ఇష్టమైన భాష', 'Continue': 'కొనసాగించండి',
            'Where do you need the service?': 'మీకు సేవ ఎక్కడ కావాలి?', 'Continue to Services': 'సేవలకు కొనసాగండి',
            'Problem details': 'సమస్య వివరాలు', 'View booking details': 'బుకింగ్ వివరాలను చూడండి', 'Cancel request': 'అభ్యర్థనను రద్దు చేయండి',
            'Estimated price': 'అంచనా ధర', 'Provider': 'సేవా ప్రదాత', 'Service': 'సేవ', 'Distance': 'దూరం', 'ETA': 'అంచనా సమయం',
            'Status': 'స్థితి', 'Heading your way': 'మీ వైపు వస్తున్నారు', 'At your location': 'మీ ప్రదేశంలో ఉన్నారు',
            'Active': 'క్రియాశీలం', 'Customer Account': 'కస్టమర్ ఖాతా', 'Account': 'ఖాತೆ', 'Use Current Location': 'ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
            'Available': 'అందుబాటులో ఉంది', 'Send Request': 'అభ్యర్థన పంపండి'
        },
        Tamil: {
            'ConnectX': 'கனெக்ட்எக்ஸ்', 'GigConnect': 'கிக் கனெக்ட்', 'Home': 'முகப்பு', 'Requests': 'கோரிக்கைகள்', 'Profile': 'சுயவிவரம்', 'Help': 'உதவி',
            'Back to Home': 'முகப்புக்குத் திரும்பு', 'Login / Get Started': 'உள்நுழை / தொடங்கு', 'Send OTP': 'OTP அனுப்பு',
            'Verify OTP': 'OTP சரிபார்', 'Create Account': 'கணக்கை உருவாக்கு', 'Phone Number': 'தொலைபேசி எண்',
            'One-Time Password': 'ஒருமுறை கடவுச்சொல்', 'Name': 'பெயர்', 'Email ID': 'மின்னஞ்சல் ஐடி', 'Customer details': 'வாடிக்கையாளர் விவரங்கள்',
            'Preferences': 'விருப்பங்கள்', 'Language': 'மொழி', 'Save language': 'மொழியைச் சேமி', 'View my bookings': 'எனது முன்பதிவுகளைக் காண்க',
            'Log out': 'வெளியேறு', 'Choose your language': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', 'Preferred language': 'விருப்ப மொழி', 'Continue': 'தொடரவும்',
            'Where do you need the service?': 'சேவை எங்கு தேவை?', 'Continue to Services': 'சேவைகளுக்குத் தொடரவும்',
            'Problem details': 'சிக்கல் விவரங்கள்', 'View booking details': 'முன்பதிவு விவரங்களைக் காண்க', 'Cancel request': 'கோரிக்கையை ரத்து செய்',
            'Estimated price': 'மதிப்பிடப்பட்ட விலை', 'Provider': 'சேவை வழங்குநர்', 'Service': 'சேவை', 'Distance': 'தூரம்', 'ETA': 'மதிப்பிடப்பட்ட நேரம்',
            'Status': 'நிலை', 'Heading your way': 'உங்கள் இடத்தை நோக்கி வருகிறார்', 'At your location': 'உங்கள் இடத்தில் உள்ளார்',
            'Active': 'செயலில்', 'Customer Account': 'வாடிக்கையாளர் கணக்கு', 'Account': 'கணக்கு', 'Use Current Location': 'தற்போதைய இடத்தைப் பயன்படுத்து',
            'Available': 'கிடைக்கிறது', 'Send Request': 'கோரிக்கையை அனுப்பு'
        }
    };

    const dictionary = translations[language] || {};
    const normalizedDictionary = Object.fromEntries(
        Object.entries(dictionary).map(([key, value]) => [key.toLowerCase(), value])
    );
    const translate = value => dictionary[value.trim()] || normalizedDictionary[value.trim().toLowerCase()] || value;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
        const translated = translate(node.nodeValue);
        if (translated !== node.nodeValue.trim()) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), translated);
    });

    document.querySelectorAll('input, textarea, select, [aria-label], [title]').forEach(element => {
        ['placeholder', 'aria-label', 'title'].forEach(attribute => {
            if (element.hasAttribute(attribute)) element.setAttribute(attribute, translate(element.getAttribute(attribute)));
        });
    });
})();