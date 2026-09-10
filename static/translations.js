(function () {
    const language = window.gigconnectLanguage || 'English';
    if (!language || language === 'English') return;

    const translations = {
        Hindi: {
            // Branding & Navigation
            'ConnectX': 'कनेक्टएक्स',
            'CX': 'सीएक्स',
            'GigConnect': 'गिगकनेक्ट',
            'Home': 'होम',
            'Requests': 'अनुरोध',
            'Profile': 'प्रोफ़ाइल',
            'Payments': 'भुगतान',
            'Help': 'सहायता',
            'Feedback': 'प्रतिक्रिया',
            'Login': 'लॉगिन',
            'Logout': 'लॉग आउट',
            'Log out': 'लॉग आउट',
            'My Profile': 'मेरी प्रोफ़ाइल',
            'Customer Account': 'ग्राहक खाता',
            'Active': 'सक्रिय',
            'ACCOUNT': 'खाता',
            'WELCOME': 'स्वागत है',
            'SERVICE REQUESTS': 'सेवा अनुरोध',
            'FEEDBACK': 'प्रतिक्रिया',
            'ALMOST THERE': 'लगभग पूरा हुआ',
            'MATCHED FOR YOU': 'आपके लिए उपयुक्त',
            'A LITTLE MORE DETAIL': 'थोड़ा और विवरण',
            'WHAT CAN WE HELP WITH?': 'हम किसमें मदद कर सकते हैं?',
            'START A REQUEST': 'अनुरोध शुरू करें',
            'COOPERATIVE GIG PLATFORM': 'सहकारी गिग प्लेटफ़ॉर्म',
            'NEED A HAND?': 'मदद चाहिए?',
            'SERVICE COMPLETED': 'सेवा पूर्ण हुई',
            'LIVE WORKER LOCATION': 'कर्मचारी का लाइव स्थान',
            'Online': 'ऑनलाइन',
            '● Online': '● ऑनलाइन',
            '● Available': '● उपलब्ध',
            'Available': 'उपलब्ध',
            'Available Now': 'अभी उपलब्ध',

            // Home / Landing
            'Cooperative Gig Services Platform': 'सहकारी गिग सेवा प्लेटफ़ॉर्म',
            'Connect directly with verified local service providers for home repairs, maintenance, cleaning, and more.': 'घर की मरम्मत, रखरखाव, सफाई और अन्य सेवाओं के लिए सत्यापित स्थानीय सेवा प्रदाताओं से सीधे जुड़ें।',
            'Login / Get Started': 'लॉगिन / शुरू करें',
            'Explore Services': 'सेवाएं देखें',
            'Verified Professionals': 'सत्यापित पेशेवर',
            'Direct connections to verified electricians, plumbers, carpenters, and technicians.': 'सत्यापित इलेक्ट्रीशियन, प्लंबर, बढ़ई और तकनीशियनों से सीधा संपर्क।',
            'Real-time Tracking': 'रीयल-टाइम ट्रैकिंग',
            'Live GPS tracking with ETA updates and direct contact with your assigned provider.': 'ईटीए अपडेट और प्रदाता से सीधे संपर्क के साथ लाइव जीपीएस ट्रैकिंग।',
            '5 Languages Supported': '5 भाषाएं समर्थित',
            'Voice search and support in English, Hindi, Tamil, Telugu, and Kannada.': 'अंग्रेजी, हिन्दी, तमिल, तेलुगु और कन्नड़ में आवाज खोज और सहायता।',

            // Login / Auth
            'Enter your phone number to continue.': 'जारी रखने के लिए अपना फ़ोन नंबर दर्ज करें।',
            'Phone Number': 'फ़ोन नंबर',
            'Enter phone number': 'फ़ोन नंबर दर्ज करें',
            'Send OTP': 'ओटीपी भेजें',
            'One-Time Password': 'वन-टाइम पासवर्ड',
            'Verify OTP': 'ओटीपी सत्यापित करें',
            'Enter 6-digit SMS code': '6 अंकों का एसएमएस कोड दर्ज करें',
            'Change phone number': 'फ़ोन नंबर बदलें',
            '← Change phone number': '← फ़ोन नंबर बदलें',
            'Resend OTP': 'ओटीपी पुनः भेजें',
            'Name': 'नाम',
            'Enter your name': 'अपना नाम दर्ज करें',
            'Email ID': 'ईमेल आईडी',
            'Enter your email': 'अपना ईमेल दर्ज करें',
            'Create Account': 'खाता बनाएं',
            'Back to Home': 'होम पर वापस जाएं',
            '← Back to Home': '← होम पर वापस जाएं',
            'Country code': 'देश कोड',
            '+91 India': '+91 भारत',
            '+1 USA/Canada': '+1 यूएसए/कनाडा',
            '+44 UK': '+44 यूके',
            '+971 UAE': '+971 यूएई',

            // Language Selection
            'Choose your language': 'अपनी भाषा चुनें',
            'Select your preferred language before continuing to your account.': 'अपने खाते में आगे बढ़ने से पहले अपनी पसंदीदा भाषा चुनें।',
            'Preferred language': 'पसंदीदा भाषा',
            'Continue': 'जारी रखें',
            'Save language': 'भाषा सहेजें',

            // Location
            'Service Location': 'सेवा का स्थान',
            'Where do you need the service?': 'आपको सेवा कहां चाहिए?',
            'We use your location to show available professionals nearby.': 'हम आस-पास उपलब्ध पेशेवरों को दिखाने के लिए आपके स्थान का उपयोग करते हैं।',
            'Use a saved address': 'सहेजा गया पता उपयोग करें',
            'Choose an address': 'एक पता चुनें',
            'Use Current Location': 'वर्तमान स्थान का उपयोग करें',
            '📍 Use Current Location': '📍 वर्तमान स्थान का उपयोग करें',
            'Your browser may ask for location permission.': 'आपका ब्राउज़र स्थान अनुमति मांग सकता है।',
            'Choose your service location on the map': 'मानचित्र पर अपना सेवा स्थान चुनें',
            'Drag to pan up, down, left, or right. Use the wheel or +/- controls to zoom.': 'खींचकर मानचित्र घुमाएं। ज़ूम करने के लिए व्हील या +/- का उपयोग करें।',
            'Address label': 'पते का नाम/लेबल',
            'Home, work, shop': 'घर, दफ़्तर, दुकान',
            'House / Flat number': 'मकान / फ्लैट नंबर',
            'House / Flat number (optional)': 'मकान / फ्लैट नंबर (वैकल्पिक)',
            'Street / Area': 'सड़क / क्षेत्र',
            'City': 'शहर',
            'Pincode': 'पिनकोड',
            'Save this address to my profile': 'इस पते को मेरी प्रोफ़ाइल में सहेजें',
            'Name this address': 'इस पते को नाम दें',
            'Home, Office, Work': 'घर, कार्यालय, कार्यस्थल',
            'Use any name so you can find it quickly next time.': 'कोई भी नाम रखें ताकि अगली बार इसे जल्दी ढूंढ सकें।',
            'Continue to Services': 'सेवाओं पर जाएं',

            // Services
            'Choose a Service': 'सेवा चुनें',
            'What service do you need?': 'आपको कौन सी सेवा चाहिए?',
            'Pick one or more services. You can search or speak what you need.': 'एक या अधिक सेवाएं चुनें। आप खोज सकते हैं या बोल सकते हैं।',
            'Search services or tap 🎙️ to speak...': 'सेवाएं खोजें या 🎙️ पर टैप करके बोलें...',
            'Clear search query': 'खोज साफ़ करें',
            'Clear text': 'टेक्स्ट साफ़ करें',
            'Search by voice': 'आवाज से खोजें',
            'Click to speak service name': 'सेवा का नाम बोलने के लिए क्लिक करें',
            'Speak': 'बोलें',
            'Listening... speak your service name (auto-stops if silent for 6s).': 'सुन रहे हैं... सेवा का नाम बोलें (6 सेकंड शांत रहने पर स्वतः बंद)।',
            'No services found matching': 'इस नाम से कोई सेवा नहीं मिली',
            'Try speaking another keyword or pick from below.': 'दूसरा शब्द बोलें या नीचे से चुनें।',
            'No services selected': 'कोई सेवा नहीं चुनी गई',
            'selected': 'चुनी गई',
            'service selected': 'सेवा चुनी गई',
            'services selected': 'सेवाएं चुनी गईं',
            'Continue to Problem Details': 'समस्या विवरण पर जाएं',

            // Categories & Descriptions
            'Plumber': 'प्लंबर (नलसाज)',
            'Pipe repairs, leak fixing, and bathroom installations': 'पाइप मरम्मत, रिसाव ठीक करना और बाथरूम फिटिंग',
            'Electrician': 'इलेक्ट्रीशियन (बिजली मिस्त्री)',
            'Wiring, switches, fuse fixes, and appliance setup': 'वायरिंग, स्विच, फ्यूज मरम्मत और उपकरण सेटअप',
            'Carpenter': 'बढ़ई (कारपेंटर)',
            'Furniture assembly, woodwork, and door repairs': 'फर्नीचर असेंबली, लकड़ी का काम और दरवाजों की मरम्मत',
            'Cleaning & Sanitization': 'सफाई एवं स्वच्छता',
            'Deep home cleaning, kitchen & sofa wash': 'घर की गहरी सफाई, रसोई और सोफा धुलाई',
            'Painter': 'पेंटर (रंगाई मिस्त्री)',
            'Interior/exterior wall painting & touchups': 'दीवारों की आंतरिक/बाहरी पेंटिंग और टचअप',
            'Mason / Construction': 'राजमिस्त्री / निर्माण कार्य',
            'Tile fixing, cement work, plastering & brickwork': 'टाइल लगाना, सीमेंट कार्य, प्लास्टर और चिनाई',
            'AC Repair & Service': 'एसी मरम्मत और सर्विसिंग',
            'Cooling issues, gas refill, filter cleaning': 'कूलिंग की समस्या, गैस रिफिल, फ़िल्टर सफाई',
            'Gardener': 'माली (बागवानी)',
            'Lawn trimming, plant potting & garden care': 'घास कटाई, पौध रोपण और बगीचे की देखभाल',
            'Maid & Housekeeping': 'घरेलू सहायिका / कामवाली',
            'Daily chores, dusting, sweeping & kitchen help': 'दैनिक घरेलू काम, झाड़ू-पोंछा और रसोई में मदद',
            'Appliance Repair': 'उपकरण मरम्मत',
            'Washing machine, fridge, microwave & TV repair': 'वॉशिंग मशीन, फ्रिज, माइक्रोवेव और टीवी मरम्मत',
            'Home Painting': 'घर की पेंटिंग',
            'Car Wash & Detailing': 'कार वॉश और डिटेलिंग',
            'Doorstep car foam wash, interior vacuum & polish': 'घर पर कार फोम वॉश, वैक्यूम और पॉलिश',

            // Problem Details
            'Problem Details': 'समस्या का विवरण',
            'Tell us about your problem': 'अपनी समस्या के बारे में बताएं',
            'Selected:': 'चयनित:',
            'What needs attention?': 'क्या ठीक करना है?',
            'Voice input language': 'आवाज इनपुट भाषा',
            'Select speech language': 'बोलने की भाषा चुनें',
            'Describe by voice': 'आवाज से विवरण दें',
            'Click to start speaking': 'बोलना शुरू करने के लिए क्लिक करें',
            'Listening... speak into your microphone.': 'सुन रहे हैं... अपने माइक्रोफ़ोन में बोलें।',
            'Describe what happened and what you need help with (or use the mic above)...': 'बताएं कि क्या हुआ और आपको क्या मदद चाहिए (या ऊपर माइक का उपयोग करें)...',
            'Add a photo': 'फ़ोटो जोड़ें',
            'Optional': 'वैकल्पिक',
            '(optional)': '(वैकल्पिक)',
            'When do you need help?': 'आपको सेवा कब चाहिए?',
            'Find Nearby Providers': 'आस-पास के प्रदाता खोजें',

            // Providers / Workers
            'Nearby Providers': 'आस-पास के प्रदाता',
            'Nearby available providers': 'आस-पास उपलब्ध सेवा प्रदाता',
            'Based on': 'आधारित:',
            'and your saved location.': 'और आपका सहेजा गया स्थान।',
            'Sort providers': 'प्रदाता क्रमबद्ध करें',
            'Nearest': 'निकटतम',
            'Highest Rated': 'उच्चतम रेटिंग',
            'Lowest Price': 'न्यूनतम कीमत',
            'estimated': 'अनुमानित',
            'yrs': 'वर्ष',
            'Send Request': 'अनुरोध भेजें',
            'No providers available yet': 'अभी कोई प्रदाता उपलब्ध नहीं है',
            'Try another service or check back shortly. Your request details are saved.': 'अन्य सेवा का प्रयास करें या थोड़ी देर बाद देखें। आपके विवरण सहेजे गए हैं।',

            // Confirmation & Summary
            'Confirm Request': 'अनुरोध की पुष्टि करें',
            'Booking Summary': 'बुकिंग सारांश',
            'Review your request before sending it.': 'अनुरोध भेजने से पहले विवरण जांचें।',
            'Customer': 'ग्राहक',
            'Service': 'सेवा',
            'Provider': 'सेवा प्रदाता',
            'Estimated price': 'अनुमानित कीमत',
            'Requested time': 'अनुरोधित समय',
            'Problem': 'समस्या',
            'Contact': 'संपर्क',
            'Confirm Service Request': 'सेवा अनुरोध की पुष्टि करें',

            // Live Status & Tracking
            'Request Status': 'अनुरोध की स्थिति',
            'Your service request has been sent!': 'आपका सेवा अनुरोध भेज दिया गया है!',
            'is reviewing your request...': 'आपके अनुरोध की समीक्षा कर रहे हैं...',
            'accepted your booking!': 'ने आपकी बुकिंग स्वीकार कर ली है!',
            'is on the way!': 'रास्ते में हैं!',
            'Service in progress with': 'के साथ सेवा जारी है',
            'Service Completed!': 'सेवा पूर्ण हुई!',
            'will review your booking and respond shortly.': 'जल्द ही आपकी बुकिंग देखकर जवाब देंगे।',
            'Provider is checking the problem details and preparing response.': 'प्रदाता समस्या विवरण जांच रहे हैं।',
            'Booking confirmed! Worker is packing tools to head to your location.': 'बुकिंग कन्फर्म! कर्मचारी औजार लेकर आपके पते की ओर निकल रहे हैं।',
            'Follow live tracking below. Estimated arrival:': 'नीचे लाइव ट्रैकिंग देखें। पहुंचने का अनुमानित समय:',
            'is handling your service.': 'आपकी सेवा संभाल रहे हैं।',
            'Order Confirmed': 'ऑर्डर की पुष्टि हुई',
            'Provider Assigned': 'प्रदाता नियुक्त',
            'Heading your way': 'आपकी ओर आ रहे हैं',
            'At your location': 'आपके स्थान पर पहुंच गए',
            'In Progress': 'प्रगति में है',
            'Service Completed': 'सेवा पूर्ण हुई',
            'Distance': 'दूरी',
            'ETA': 'अनुमानित समय',
            'Status': 'स्थिति',
            'Payment': 'भुगतान',
            'Payment Pending': 'भुगतान लंबित',
            'Paid': 'भुगतान पूर्ण',
            'Request ID': 'अनुरोध आईडी',
            'How was your experience?': 'आपका अनुभव कैसा रहा?',
            'Pay': 'भुगतान करें',
            'Payment completed successfully.': 'भुगतान सफलतापूर्वक पूरा हुआ।',
            'Rate your worker': 'कर्मचारी को रेटिंग दें',
            'Choose a rating': 'रेटिंग चुनें',
            '5 - Excellent': '5 - उत्कृष्ट',
            '4 - Good': '4 - अच्छा',
            '3 - Average': '3 - औसत',
            '2 - Poor': '2 - खराब',
            '1 - Very poor': '1 - बहुत खराब',
            'Submit worker rating': 'रेटिंग सबमिट करें',
            'Advance Status': 'स्थिति आगे बढ़ाएं',
            'Contact worker': 'कर्मचारी से संपर्क करें',
            'View booking details': 'बुकिंग विवरण देखें',
            'Cancel request': 'अनुरोध रद्द करें',

            // Requests & Bookings
            'My requests': 'मेरे अनुरोध',
            'Track Live Status →': 'लाइव स्थिति ट्रैक करें →',
            'No requests yet': 'अभी कोई अनुरोध नहीं है',
            'Your sent requests will appear here.': 'आपके भेजे गए अनुरोध यहां दिखाई देंगे।',
            'Provider:': 'प्रदाता:',
            'Time:': 'समय:',
            'Price:': 'कीमत:',
            'Message:': 'संदेश:',
            'Booking History': 'बुकिंग इतिहास',
            'View my bookings': 'मेरी बुकिंग देखें',

            // Profile
            'Manage your details and preferences.': 'अपने विवरण और प्राथमिकताएं प्रबंधित करें।',
            'Customer details': 'ग्राहक विवरण',
            'Preferences': 'प्राथमिकताएं',
            'Language': 'भाषा',
            'Saved addresses': 'सहेजे गए पते',
            'No saved addresses yet.': 'अभी कोई सहेजा गया पता नहीं है।',
            'Delete': 'हटाएं',
            'Add an address': 'नया पता जोड़ें',
            'Add address': 'पता जोड़ें',

            // Feedback Page
            'Tell us about ConnectX': 'कनेक्टएक्स के बारे में अपनी राय दें',
            'Help us make booking, tracking, and service quality better for everyone.': 'बुकिंग, ट्रैकिंग और सेवा गुणवत्ता को और बेहतर बनाने में हमारी मदद करें।',
            'Thank you! Your feedback has been received and helps improve ConnectX.': 'धन्यवाद! आपकी प्रतिक्रिया प्राप्त हो गई है।',
            'Select Topic': 'विषय चुनें',
            'General Experience': 'सामान्य अनुभव',
            'Worker Quality': 'कर्मचारी की गुणवत्ता',
            'Worker & Service Quality': 'कर्मचारी और सेवा गुणवत्ता',
            'App & Speed': 'ऐप और गति',
            'App & Navigation': 'ऐप और नेविगेशन',
            'Payments & Price': 'भुगतान और कीमत',
            'Payment & Pricing': 'भुगतान और मूल्य निर्धारण',
            'Feature Request': 'नई सुविधा का सुझाव',
            'Report an Issue': 'समस्या की रिपोर्ट करें',
            'Rating': 'रेटिंग',
            'Quick Tags': 'त्वरित टैग',
            'Tap to add to your feedback': 'प्रतिक्रिया में जोड़ने के लिए टैप करें',
            '⚡ Fast Booking': '⚡ तेज़ बुकिंग',
            '⚡ Fast and easy booking': '⚡ तेज़ और आसान बुकिंग',
            '👷 Great Worker': '👷 बेहतरीन कर्मचारी',
            '👷 Professional and polite worker': '👷 पेशेवर और विनम्र कर्मचारी',
            '📱 Smooth App': '📱 आसान ऐप',
            '📱 Smooth app experience': '📱 बहुत सहज ऐप अनुभव',
            '💰 Fair Pricing': '💰 उचित दर',
            '💰 Fair and upfront pricing': '💰 पारदर्शी और उचित दर',
            '⏱️ On-Time': '⏱️ समय पर',
            '⏱️ Arrived on time': '⏱️ समय पर आगमन',
            '🗺️ Accurate Tracking': '🗺️ सटीक ट्रैकिंग',
            '🗺️ Accurate live tracking': '🗺️ सटीक लाइव ट्रैकिंग',
            '✨ Clean Job': '✨ साफ़-सुथरा काम',
            '✨ Clean and neat job': '✨ साफ़-सुथरा और बढ़िया काम',
            '🔧 Need More Providers': '🔧 अधिक प्रदाताओं की आवश्यकता',
            '🔧 Need more local providers': '🔧 क्षेत्र में और प्रदाताओं की आवश्यकता',
            '💬 Helpful Support': '💬 मददगार सहायता',
            '💬 Helpful customer support': '💬 बहुत मददगार ग्राहक सहायता',
            'Your Feedback': 'आपकी प्रतिक्रिया',
            'What did you like or what can we improve? Tap quick tags above or speak using mic...': 'आपको क्या पसंद आया या हम क्या सुधार सकते हैं? ऊपर दिए टैग टैप करें या माइक से बोलें...',
            'Send feedback': 'प्रतिक्रिया भेजें',

            // Help
            'How can we help?': 'हम आपकी क्या सहायता कर सकते हैं?',
            'Choose a service, describe the problem, and we will help you find an available professional nearby.': 'सेवा चुनें, समस्या बताएं, और हम आपको आस-पास उपलब्ध पेशेवर खोजने में मदद करेंगे।',
            'Finding a provider': 'प्रदाता खोजना',
            'Filter providers by rating, price, or availability.': 'रेटिंग, कीमत या उपलब्धता के आधार पर प्रदाताओं को फ़िल्टर करें।',
            'Request support': 'सहायता अनुरोध',
            'Contact us at': 'हमसे संपर्क करें:',

            // Yoyo Assistant
            'Yoyo AI Assistant': 'योयो एआई सहायक',
            'ConnectX assistant': 'कनेक्टएक्स सहायक',
            'Ask Yoyo support assistant': 'योयो सहायता सहायक से पूछें',
            'Ask Yoyo': 'योयो से पूछें',
            'Ask a question or tap 🎙️…': 'प्रश्न पूछें या 🎙️ पर टैप करें…',
            'Ask Yoyo anything or tap 🎙️ to speak…': 'योयो से कुछ भी पूछें या 🎙️ पर टैप करें…',
            'Close chat': 'चैट बंद करें',
            'Suggested questions': 'सुझाए गए प्रश्न',
            'Book a service': 'सेवा बुक करें',
            'How do I book?': 'बुकिंग कैसे करें?',
            'Pricing info': 'कीमत की जानकारी',
            'Live tracking': 'लाइव ट्रैकिंग',
            'Services list': 'सेवाओं की सूची',
            'Languages': 'भाषाएं',
            'Give feedback': 'प्रतिक्रिया दें',
            'Browse Services': 'सेवाएं देखें',
            'View My Requests': 'मेरे अनुरोध देखें',
            'Manage Saved Addresses': 'पते प्रबंधित करें',
            'Change Language': 'भाषा बदलें',
            'Help Center': 'सहायता केंद्र'
        },

        Telugu: {
            // Branding & Navigation
            'ConnectX': 'కనెక్ట్‌ఎక్స్',
            'CX': 'సీఎక్స్',
            'GigConnect': 'గిగ్‌కనెక్ట్',
            'Home': 'హోమ్',
            'Requests': 'అభ్యర్థనలు',
            'Profile': 'ప్రొఫైల్',
            'Payments': 'చెల్లింపులు',
            'Help': 'సహాయం',
            'Feedback': 'ఫీడ్‌బ్యాక్',
            'Login': 'లాగిన్',
            'Logout': 'లాగ్ అవుట్',
            'Log out': 'లాగ్ అవుట్',
            'My Profile': 'నా ప్రొఫైల్',
            'Customer Account': 'కస్టమర్ ఖాతా',
            'Active': 'యాక్టివ్',
            'ACCOUNT': 'ఖాతా',
            'WELCOME': 'స్వాగతం',
            'SERVICE REQUESTS': 'సేవా అభ్యర్థనలు',
            'FEEDBACK': 'ఫీడ్‌బ్యాక్',
            'ALMOST THERE': 'దాదాపు పూర్తయింది',
            'MATCHED FOR YOU': 'మీ కోసం సరిపోలినవి',
            'A LITTLE MORE DETAIL': 'మరికొన్ని వివరాలు',
            'WHAT CAN WE HELP WITH?': 'మేము మీకు ఎలా సహాయపడగలం?',
            'START A REQUEST': 'అభ్యర్థన ప్రారంభించండి',
            'COOPERATIVE GIG PLATFORM': 'కోఆపరేటివ్ గిగ్ ప్లాట్‌ఫారమ్',
            'NEED A HAND?': 'సహాయం కావాలా?',
            'SERVICE COMPLETED': 'సేవ పూర్తయింది',
            'LIVE WORKER LOCATION': 'సిబ్బంది లైవ్ లొకేషన్',
            'Online': 'ఆన్‌లైన్',
            '● Online': '● ఆన్‌లైన్',
            '● Available': '● అందుబాటులో ఉన్నారు',
            'Available': 'అందుబాటులో ఉంది',
            'Available Now': 'ఇప్పుడే అందుబాటులో ఉంది',

            // Home / Landing
            'Cooperative Gig Services Platform': 'కోఆపరేటివ్ గిగ్ సర్వీసెస్ ప్లాట్‌ఫారమ్',
            'Connect directly with verified local service providers for home repairs, maintenance, cleaning, and more.': 'ఇంటి మరమ్మతులు, నిర్వహణ, శుభ్రపరచడం కోసం ధృవీకరించబడిన నిపుణులతో నేరుగా కనెక్ట్ అవ్వండి.',
            'Login / Get Started': 'లాగిన్ / ప్రారంభించండి',
            'Explore Services': 'సేవలను చూడండి',
            'Verified Professionals': 'ధృవీకరించబడిన నిపుణులు',
            'Direct connections to verified electricians, plumbers, carpenters, and technicians.': 'ధృవీకరించబడిన ఎలక్ట్రీషియన్లు, ప్లంబర్లు, కార్పెంటర్లతో నేరుగా కనెక్ట్ అవ్వండి.',
            'Real-time Tracking': 'రియల్-టైమ్ ట్రాకింగ్',
            'Live GPS tracking with ETA updates and direct contact with your assigned provider.': 'లైవ్ జీపీఎస్ ట్రాకింగ్, సమయ అంచనాలు మరియు నిపుణుడితో నేరుగా సంప్రదింపు.',
            '5 Languages Supported': '5 భాషలు అందుబాటులో ఉన్నాయి',
            'Voice search and support in English, Hindi, Tamil, Telugu, and Kannada.': 'ఇంగ్లీష్, హిందీ, తమిళం, తెలుగు, కన్నడ భాషల్లో వాయిస్ శోధన మరియు సహాయం.',

            // Login / Auth
            'Enter your phone number to continue.': 'కొనసాగడానికి మీ ఫోన్ నంబర్‌ను నమోదు చేయండి.',
            'Phone Number': 'ఫోన్ నంబర్',
            'Enter phone number': 'ఫోన్ నంబర్ నమోదు చేయండి',
            'Send OTP': 'ఓటీపీ పంపండి',
            'One-Time Password': 'వన్-టైమ్ పాస్‌వర్డ్',
            'Verify OTP': 'ఓటీపీ ధృవీకరించండి',
            'Enter 6-digit SMS code': '6 అంకెల ఎస్ఎమ్ఎస్ కోడ్ నమోదు చేయండి',
            'Change phone number': 'ఫోన్ నంబర్ మార్చండి',
            '← Change phone number': '← ఫోన్ నంబర్ మార్చండి',
            'Resend OTP': 'ఓటీపీ మళ్లీ పంపండి',
            'Name': 'పేరు',
            'Enter your name': 'మీ పేరు నమోదు చేయండి',
            'Email ID': 'ఈమెయిల్ ఐడి',
            'Enter your email': 'మీ ఈమెయిల్ నమోదు చేయండి',
            'Create Account': 'ఖాతా సృష్టించండి',
            'Back to Home': 'హోమ్‌కు తిరిగి వెళ్ళండి',
            '← Back to Home': '← హోమ్‌కు తిరిగి వెళ్ళండి',
            'Country code': 'దేశ కోడ్',
            '+91 India': '+91 భారతదేశం',
            '+1 USA/Canada': '+1 అమెరికా/కెనడా',
            '+44 UK': '+44 యూకే',
            '+971 UAE': '+971 యూఏఈ',

            // Language Selection
            'Choose your language': 'మీ భాషను ఎంచుకోండి',
            'Select your preferred language before continuing to your account.': 'మీ ఖాతాకు వెళ్లే ముందు మీ ప్రాధాన్య భాషను ఎంచుకోండి.',
            'Preferred language': 'ఇష్టమైన భాష',
            'Continue': 'కొనసాగించండి',
            'Save language': 'భాషను సేవ్ చేయండి',

            // Location
            'Service Location': 'సేవా స్థానం',
            'Where do you need the service?': 'మీకు సేవ ఎక్కడ కావాలి?',
            'We use your location to show available professionals nearby.': 'సమీపంలోని నిపుణులను చూపించడానికి మేము మీ స్థానాన్ని ఉపయోగిస్తాము.',
            'Use a saved address': 'సేవ్ చేసిన చిరునామాను ఉపయోగించండి',
            'Choose an address': 'చిరునామాను ఎంచుకోండి',
            'Use Current Location': 'ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
            '📍 Use Current Location': '📍 ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
            'Your browser may ask for location permission.': 'మీ బ్రౌజర్ లొకేషన్ అనుమతి అడగవచ్చు.',
            'Choose your service location on the map': 'మ్యాప్‌లో మీ సేవా స్థానాన్ని ఎంచుకోండి',
            'Drag to pan up, down, left, or right. Use the wheel or +/- controls to zoom.': 'మ్యాప్‌ను తరలించండి. జూమ్ చేయడానికి +/- ఉపయోగించండి.',
            'Address label': 'చిరునామా పేరు/లేబుల్',
            'Home, work, shop': 'ఇల్లు, కార్యాలయం, దుకాణం',
            'House / Flat number': 'ఇంటి / ఫ్లాట్ నంబర్',
            'House / Flat number (optional)': 'ఇంటి / ఫ్లాట్ నంబర్ (ఐచ్ఛికం)',
            'Street / Area': 'వీధి / ప్రాంతం',
            'City': 'నగరం',
            'Pincode': 'పిన్‌కోడ్',
            'Save this address to my profile': 'ఈ చిరునామాను నా ప్రొఫైల్‌లో సేవ్ చేయండి',
            'Name this address': 'ఈ చిరునామాకు పేరు పెట్టండి',
            'Home, Office, Work': 'ఇల్లు, ఆఫీస్, వర్క్',
            'Use any name so you can find it quickly next time.': 'తదుపరిసారి సులభంగా కనుగొనడానికి ఏదైనా పేరు ఇవ్వండి.',
            'Continue to Services': 'సేవలకు కొనసాగండి',

            // Services
            'Choose a Service': 'సేవను ఎంచుకోండి',
            'What service do you need?': 'మీకు ఏ సేవ కావాలి?',
            'Pick one or more services. You can search or speak what you need.': 'ఒకటి లేదా అంతకంటే ఎక్కువ సేవలను ఎంచుకోండి. మాట్లాడవచ్చు లేదా వెతకవచ్చు.',
            'Search services or tap 🎙️ to speak...': 'సేవలను వెతకండి లేదా 🎙️ నొక్కి మాట్లాడండి...',
            'Clear search query': 'వెతుకులాట తొలగించండి',
            'Clear text': 'టెక్స్ట్ క్లియర్ చేయండి',
            'Search by voice': 'వాయిస్ ద్వారా వెతకండి',
            'Click to speak service name': 'సేవ పేరు మాట్లాడటానికి క్లిక్ చేయండి',
            'Speak': 'మాట్లాడండి',
            'Listening... speak your service name (auto-stops if silent for 6s).': 'వింటున్నాము... సేవ పేరు చెప్పండి (6 సెకన్ల మౌనం తర్వాత ఆగుతుంది).',
            'No services found matching': 'సరిపోలే సేవలు ఏవీ కనుగొనబడలేదు',
            'Try speaking another keyword or pick from below.': 'మరొక పదం చెప్పండి లేదా కింద నుండి ఎంచుకోండి.',
            'No services selected': 'ఏ సేవలు ఎంపిక చేయలేదు',
            'selected': 'ఎంపిక చేయబడింది',
            'service selected': 'సేవ ఎంపిక చేయబడింది',
            'services selected': 'సేవలు ఎంపిక చేయబడ్డాయి',
            'Continue to Problem Details': 'సమస్య వివరాలకు కొనసాగండి',

            // Categories & Descriptions
            'Plumber': 'ప్లంబర్ (పైపుల పని)',
            'Pipe repairs, leak fixing, and bathroom installations': 'పైపుల మరమ్మతులు, లీకేజ్ పరిష్కారం మరియు బాత్‌రూమ్ ఫిట్టింగ్స్',
            'Electrician': 'ఎలక్ట్రీషియన్ (కరెంట్ పని)',
            'Wiring, switches, fuse fixes, and appliance setup': 'వైరింగ్, స్విచ్‌లు, ఫ్యూజ్ మరమ్మతులు మరియు ఉపకరణాల ఏర్పాటు',
            'Carpenter': 'కార్పెంటర్ (వడ్రంగి పని)',
            'Furniture assembly, woodwork, and door repairs': 'ఫర్నిచర్ తయారీ, చెక్క పని మరియు తలుపుల మరమ్మతులు',
            'Cleaning & Sanitization': 'క్లీనింగ్ & శానిటైజేషన్',
            'Deep home cleaning, kitchen & sofa wash': 'ఇంటి డీప్ క్లీనింగ్, కిచెన్ మరియు సోఫా వాష్',
            'Painter': 'పెయింటర్ (రంగుల పని)',
            'Interior/exterior wall painting & touchups': 'గోడలకు లోపలి/వెలుపలి రంగులు మరియు టచ్‌అప్‌లు',
            'Mason / Construction': 'మేస్త్రీ / నిర్మాణ పనులు',
            'Tile fixing, cement work, plastering & brickwork': 'టైల్స్ అమర్చడం, సిమెంట్ పని, ప్లాస్టరింగ్ మరియు ఇటుక పని',
            'AC Repair & Service': 'ఏసీ రిపేర్ & సర్వీసింగ్',
            'Cooling issues, gas refill, filter cleaning': 'కూలింగ్ సమస్యలు, గ్యాస్ రీఫిల్, ఫిల్టర్ క్లీనింగ్',
            'Gardener': 'తోటమాలి',
            'Lawn trimming, plant potting & garden care': 'గడ్డి కత్తిరింపు, మొక్కలు నాటడం మరియు తోట నిర్వహణ',
            'Maid & Housekeeping': 'ఇంటి పని మనిషి',
            'Daily chores, dusting, sweeping & kitchen help': 'రోజువారీ పనులు, దుమ్ము దులపడం, ఊడ్చడం మరియు వంట సహాయం',
            'Appliance Repair': 'గృహోపకరణాల మరమ్మతు',
            'Washing machine, fridge, microwave & TV repair': 'వాషింగ్ మెషిన్, ఫ్రిజ్, మైక్రోవేవ్ మరియు టీవీ రిపేర్',
            'Home Painting': 'ఇంటి పెయింటింగ్',
            'Car Wash & Detailing': 'కార్ వాష్ & పాలిషింగ్',
            'Doorstep car foam wash, interior vacuum & polish': 'ఇంటి వద్దే కార్ ఫోమ్ వాష్, వాక్యూమ్ మరియు పాలిష్',

            // Problem Details
            'Problem Details': 'సమస్య వివరాలు',
            'Tell us about your problem': 'మీ సమస్య గురించి చెప్పండి',
            'Selected:': 'ఎంపిక చేసినవి:',
            'What needs attention?': 'దేనికి మరమ్మతు అవసరం?',
            'Voice input language': 'వాయిస్ ఇన్పుట్ భాష',
            'Select speech language': 'మాట్లాడే భాషను ఎంచుకోండి',
            'Describe by voice': 'వాయిస్ ద్వారా వివరించండి',
            'Click to start speaking': 'మాట్లాడటం ప్రారంభించడానికి క్లిక్ చేయండి',
            'Listening... speak into your microphone.': 'వింటున్నాము... మైక్రోఫోన్‌లో మాట్లాడండి.',
            'Describe what happened and what you need help with (or use the mic above)...': 'సమస్య ఏమిటి మరియు మీకు ఏ సహాయం కావాలో వివరించండి (లేదా మైక్ ఉపయోగించండి)...',
            'Add a photo': 'ఫోటో జోడించండి',
            'Optional': 'ఐచ్ఛికం',
            '(optional)': '(ఐచ్ఛికం)',
            'When do you need help?': 'మీకు ఎప్పుడు సహాయం కావాలి?',
            'Find Nearby Providers': 'సమీపంలోని నిపుణులను కనుగొనండి',

            // Providers / Workers
            'Nearby Providers': 'సమీపంలోని సర్వీస్ ప్రొవైడర్లు',
            'Nearby available providers': 'సమీపంలో అందుబాటులో ఉన్న నిపుణులు',
            'Based on': 'ఆధారంగా:',
            'and your saved location.': 'మరియు మీ సేవ్ చేసిన లొకేషన్.',
            'Sort providers': 'క్రమబద్ధీకరించండి',
            'Nearest': 'సమీపంలోని వారు',
            'Highest Rated': 'అత్యుత్తమ రేటింగ్',
            'Lowest Price': 'తక్కువ ధర',
            'estimated': 'అంచనా',
            'yrs': 'సంవత్సరాలు',
            'Send Request': 'అభ్యర్థన పంపండి',
            'No providers available yet': 'ప్రస్తుతం ప్రొవైడర్లు అందుబాటులో లేరు',
            'Try another service or check back shortly. Your request details are saved.': 'మరొక సేవను ప్రయత్నించండి లేదా కాసేపటి తర్వాత చూడండి. మీ వివరాలు భద్రపరచబడ్డాయి.',

            // Confirmation & Summary
            'Confirm Request': 'అభ్యర్థనను నిర్ధారించండి',
            'Booking Summary': 'బుకింగ్ సారాంశం',
            'Review your request before sending it.': 'పంపే ముందు మీ అభ్యర్థన వివరాలను సమీక్షించండి.',
            'Customer': 'కస్టమర్',
            'Service': 'సేవ',
            'Provider': 'సేవా ప్రదాత',
            'Estimated price': 'అంచనా ధర',
            'Requested time': 'కోరిన సమయం',
            'Problem': 'సమస్య',
            'Contact': 'సంప్రదింపు',
            'Confirm Service Request': 'సర్వీస్ అభ్యర్థనను నిర్ధారించండి',

            // Live Status & Tracking
            'Request Status': 'అభ్యర్థన స్థితి',
            'Your service request has been sent!': 'మీ సేవా అభ్యర్థన పంపబడింది!',
            'is reviewing your request...': 'మీ అభ్యర్థనను పరిశీలిస్తున్నారు...',
            'accepted your booking!': 'మీ బుకింగ్‌ను అంగీకరించారు!',
            'is on the way!': 'మీ వైపు వస్తున్నారు!',
            'Service in progress with': 'తో సేవ కొనసాగుతోంది',
            'Service Completed!': 'సేవ పూర్తయింది!',
            'will review your booking and respond shortly.': 'త్వరలో పరిశీలించి స్పందిస్తారు.',
            'Provider is checking the problem details and preparing response.': 'నిపుణుడు సమస్య వివరాలను పరిశీలిస్తున్నారు.',
            'Booking confirmed! Worker is packing tools to head to your location.': 'బుకింగ్ నిర్ధారించబడింది! నిపుణుడు బయలుదేరుతున్నారు.',
            'Follow live tracking below. Estimated arrival:': 'లైవ్ ట్రాకింగ్ చూడండి. చేరుకునే అంచనా సమయం:',
            'is handling your service.': 'మీ సేవను నిర్వహిస్తున్నారు.',
            'Order Confirmed': 'ఆర్డర్ నిర్ధారించబడింది',
            'Provider Assigned': 'నిపుణుడు కేటాయించబడ్డారు',
            'Heading your way': 'మీ వైపు వస్తున్నారు',
            'At your location': 'మీ ప్రదేశానికి చేరుకున్నారు',
            'In Progress': 'పురోగతిలో ఉంది',
            'Service Completed': 'సేవ పూర్తయింది',
            'Distance': 'దూరం',
            'ETA': 'అంచనా సమయం',
            'Status': 'స్థితి',
            'Payment': 'చెల్లింపు',
            'Payment Pending': 'చెల్లింపు పెండింగ్‌లో ఉంది',
            'Paid': 'చెల్లింపు పూర్తయింది',
            'Request ID': 'అభ్యర్థన ఐడి',
            'How was your experience?': 'మీ అనుభవం ఎలా ఉంది?',
            'Pay': 'చెల్లించండి',
            'Payment completed successfully.': 'చెల్లింపు విజయవంతంగా పూర్తయింది.',
            'Rate your worker': 'రేటింగ్ ఇవ్వండి',
            'Choose a rating': 'రేటింగ్ ఎంచుకోండి',
            '5 - Excellent': '5 - అద్భుతం',
            '4 - Good': '4 - మంచిది',
            '3 - Average': '3 - సాధారణం',
            '2 - Poor': '2 - సరిపోదు',
            '1 - Very poor': '1 - చాలా అధ్వాన్నం',
            'Submit worker rating': 'రేటింగ్ సమర్పించండి',
            'Advance Status': 'స్థితిని ముందుకు తీసుకెళ్లండి',
            'Contact worker': 'సిబ్బందిని సంప్రదించండి',
            'View booking details': 'బుకింగ్ వివరాలు చూడండి',
            'Cancel request': 'అభ్యర్థనను రద్దు చేయండి',

            // Requests & Bookings
            'My requests': 'నా అభ్యర్థనలు',
            'Track Live Status →': 'లైవ్ స్థితిని ట్రాక్ చేయండి →',
            'No requests yet': 'ఇంకా ఎలాంటి అభ్యర్థనలు లేవు',
            'Your sent requests will appear here.': 'మీరు పంపిన అభ్యర్థనలు ఇక్కడ కనిపిస్తాయి.',
            'Provider:': 'ప్రదాత:',
            'Time:': 'సమయం:',
            'Price:': 'ధర:',
            'Message:': 'సందేశం:',
            'Booking History': 'బుకింగ్ చరిత్ర',
            'View my bookings': 'నా బుకింగ్‌లను చూడండి',

            // Profile
            'Manage your details and preferences.': 'మీ వివరాలు మరియు ప్రాధాన్యతలను నిర్వహించండి.',
            'Customer details': 'కస్టమర్ వివరాలు',
            'Preferences': 'ప్రాధాన్యతలు',
            'Language': 'భాష',
            'Saved addresses': 'సేవ్ చేసిన చిరునామాలు',
            'No saved addresses yet.': 'ఇంకా సేవ్ చేసిన చిరునామాలు లేవు.',
            'Delete': 'తొలగించు',
            'Add an address': 'చిరునామా జోడించండి',
            'Add address': 'చిరునామా జోడించండి',

            // Feedback Page
            'Tell us about ConnectX': 'కనెక్ట్‌ఎక్స్ గురించి మీ అభిప్రాయాన్ని తెలియజేయండి',
            'Help us make booking, tracking, and service quality better for everyone.': 'సేవల నాణ్యతను మరింత మెరుగుపరచడానికి మీ అభిప్రాయం సహాయపడుతుంది.',
            'Thank you! Your feedback has been received and helps improve ConnectX.': 'ధన్యవాదాలు! మీ అభిప్రాయం అందింది.',
            'Select Topic': 'అంశాన్ని ఎంచుకోండి',
            'General Experience': 'సాధారణ అనుభవం',
            'Worker Quality': 'సిబ్బంది నాణ్యత',
            'Worker & Service Quality': 'సిబ్బంది & సేవా నాణ్యత',
            'App & Speed': 'యాప్ & వేగం',
            'App & Navigation': 'యాప్ & నావిగేషన్',
            'Payments & Price': 'చెల్లింపులు & ధర',
            'Payment & Pricing': 'చెల్లింపు & ధరల విధానం',
            'Feature Request': 'కొత్త ఫీచర్ సూచన',
            'Report an Issue': 'సమస్యను నివేదించండి',
            'Rating': 'రేటింగ్',
            'Quick Tags': 'త్వరిత ట్యాగ్‌లు',
            'Tap to add to your feedback': 'ఫీడ్‌బ్యాక్‌లో చేర్చడానికి నొక్కండి',
            '⚡ Fast Booking': '⚡ వేగవంతమైన బుకింగ్',
            '⚡ Fast and easy booking': '⚡ వేగవంతమైన మరియు సులభమైన బుకింగ్',
            '👷 Great Worker': '👷 అద్భుతమైన నిపుణుడు',
            '👷 Professional and polite worker': '👷 వృత్తిపరమైన మరియు మర్యాదపూర్వక సిబ్బంది',
            '📱 Smooth App': '📱 సులభమైన యాప్',
            '📱 Smooth app experience': '📱 చాలా సులభమైన యాప్ అనుభవం',
            '💰 Fair Pricing': '💰 సరసమైన ధర',
            '💰 Fair and upfront pricing': '💰 పారదర్శకమైన సరసమైన ధర',
            '⏱️ On-Time': '⏱️ సరైన సమయానికి',
            '⏱️ Arrived on time': '⏱️ సమయానికి చేరుకున్నారు',
            '🗺️ Accurate Tracking': '🗺️ ఖచ్చితమైన ట్రాకింగ్',
            '🗺️ Accurate live tracking': '🗺️ ఖచ్చితమైన లైవ్ ట్రాకింగ్',
            '✨ Clean Job': '✨ శుభ్రమైన పని',
            '✨ Clean and neat job': '✨ చాలా శుభ్రంగా పని చేశారు',
            '🔧 Need More Providers': '🔧 మరిన్ని సర్వీసులు కావాలి',
            '🔧 Need more local providers': '🔧 ఈ ప్రాంతంలో మరిన్ని నిపుణులు కావాలి',
            '💬 Helpful Support': '💬 చక్కటి సపోర్ట్',
            '💬 Helpful customer support': '💬 ఉపయోగకరమైన కస్టమర్ మద్దతు',
            'Your Feedback': 'మీ అభిప్రాయం',
            'What did you like or what can we improve? Tap quick tags above or speak using mic...': 'మీకు ఏమి నచ్చింది లేదా మేము ఏమి మెరుగుపరచాలి? పైన ఉన్న ట్యాగ్‌లను నొక్కండి లేదా మైక్ ఉపయోగించండి...',
            'Send feedback': 'ఫీడ్‌బ్యాక్ పంపండి',

            // Help
            'How can we help?': 'మేము మీకు ఎలా సహాయం చేయగలం?',
            'Choose a service, describe the problem, and we will help you find an available professional nearby.': 'సేవను ఎంచుకోండి, సమస్యను వివరించండి, మేము సమీపంలోని నిపుణులను కనుగొనడంలో సహాయం చేస్తాము.',
            'Finding a provider': 'నిపుణుడిని కనుగొనడం',
            'Filter providers by rating, price, or availability.': 'రేటింగ్, ధర లేదా లభ్యత ఆధారంగా ఫిల్టర్ చేయండి.',
            'Request support': 'సపోర్ట్ కోరండి',
            'Contact us at': 'మమ్మల్ని సంప్రదించండి:',

            // Yoyo Assistant
            'Yoyo AI Assistant': 'యోయో ఏఐ అసిస్టెంట్',
            'ConnectX assistant': 'కనెక్ట్‌ఎక్స్ సహాయకుడు',
            'Ask Yoyo support assistant': 'యోయో సహాయకుడిని అడగండి',
            'Ask Yoyo': 'యోయోను అడగండి',
            'Ask a question or tap 🎙️…': 'ప్రశ్న అడగండి లేదా 🎙️ నొక్కండి…',
            'Ask Yoyo anything or tap 🎙️ to speak…': 'యోయోను ఏదైనా అడగండి లేదా 🎙️ నొక్కండి…',
            'Close chat': 'చాట్ మూసివేయండి',
            'Suggested questions': 'సూచించిన ప్రశ్నలు',
            'Book a service': 'సేవను బుక్ చేయండి',
            'How do I book?': 'బుకింగ్ ఎలా చేయాలి?',
            'Pricing info': 'ధరల సమాచారం',
            'Live tracking': 'లైవ్ ట్రాకింగ్',
            'Services list': 'సేవల జాబితా',
            'Languages': 'భాషలు',
            'Give feedback': 'ఫీడ్‌బ్యాక్ ఇవ్వండి',
            'Browse Services': 'సేవలను బ్రౌజ్ చేయండి',
            'View My Requests': 'నా అభ్యర్థనలను చూడండి',
            'Manage Saved Addresses': 'చిరునామాలను నిర్వహించండి',
            'Change Language': 'భాషను మార్చండి',
            'Help Center': 'సహాయ కేంద్రం'
        },

        Tamil: {
            // Branding & Navigation
            'ConnectX': 'கனெக்ட்எக்ஸ்',
            'CX': 'சிஎக்ஸ்',
            'GigConnect': 'கிக் கனெக்ட்',
            'Home': 'முகப்பு',
            'Requests': 'கோரிக்கைகள்',
            'Profile': 'சுயவிவரம்',
            'Payments': 'கட்டணங்கள்',
            'Help': 'உதவி',
            'Feedback': 'கருத்து',
            'Login': 'உள்நுழை',
            'Logout': 'வெளியேறு',
            'Log out': 'வெளியேறு',
            'My Profile': 'எனது சுயவிவரம்',
            'Customer Account': 'வாடிக்கையாளர் கணக்கு',
            'Active': 'செயலில்',
            'ACCOUNT': 'கணக்கு',
            'WELCOME': 'வரவேற்கிறோம்',
            'SERVICE REQUESTS': 'சேவை கோரிக்கைகள்',
            'FEEDBACK': 'கருத்து',
            'ALMOST THERE': 'கிட்டத்தட்ட முடிந்தது',
            'MATCHED FOR YOU': 'உங்களுக்காக பொருத்தப்பட்டது',
            'A LITTLE MORE DETAIL': 'கூடுதல் விவரங்கள்',
            'WHAT CAN WE HELP WITH?': 'நாங்கள் எதில் உதவ வேண்டும்?',
            'START A REQUEST': 'கோரிக்கையைத் தொடங்குங்கள்',
            'COOPERATIVE GIG PLATFORM': 'கூட்டுறவு கிக் தளம்',
            'NEED A HAND?': 'உதவி தேவையா?',
            'SERVICE COMPLETED': 'சேவை முடிந்தது',
            'LIVE WORKER LOCATION': 'பணியாளரின் நேரலை இருப்பிடம்',
            'Online': 'ஆன்லைன்',
            '● Online': '● ஆன்லைன்',
            '● Available': '● கிடைக்கிறார்',
            'Available': 'கிடைக்கிறது',
            'Available Now': 'இப்போது கிடைக்கிறது',

            // Home / Landing
            'Cooperative Gig Services Platform': 'கூட்டுறவு கிக் சேவைகள் தளம்',
            'Connect directly with verified local service providers for home repairs, maintenance, cleaning, and more.': 'வீட்டு பழுதுபார்ப்பு, பராமரிப்பு மற்றும் சுத்தம் செய்வதற்கு சரிபார்க்கப்பட்ட நிபுணர்களுடன் நேரடியாக இணையுங்கள்.',
            'Login / Get Started': 'உள்நுழை / தொடங்கு',
            'Explore Services': 'சேவைகளைப் பார்க்கவும்',
            'Verified Professionals': 'சரிபார்க்கப்பட்ட நிபுணர்கள்',
            'Direct connections to verified electricians, plumbers, carpenters, and technicians.': 'சரிபார்க்கப்பட்ட எலக்ட்ரீஷியன்கள், பிளம்பர்கள், தச்சர்களுடன் நேரடி தொடர்பு.',
            'Real-time Tracking': 'நேரலை கண்காணிப்பு',
            'Live GPS tracking with ETA updates and direct contact with your assigned provider.': 'நேரலை ஜிபிஎஸ் டிராக்கிங் மற்றும் நிபுணருடன் நேரடி தொடர்பு.',
            '5 Languages Supported': '5 மொழிகள் ஆதரிக்கப்படுகின்றன',
            'Voice search and support in English, Hindi, Tamil, Telugu, and Kannada.': 'ஆங்கிலம், இந்தி, தமிழ், தெலுங்கு, கன்னட மொழிகளில் குரல் தேடல் மற்றும் உதவி.',

            // Login / Auth
            'Enter your phone number to continue.': 'தொடர உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்.',
            'Phone Number': 'தொலைபேசி எண்',
            'Enter phone number': 'தொலைபேசி எண்ணை உள்ளிடவும்',
            'Send OTP': 'OTP அனுப்பு',
            'One-Time Password': 'ஒருமுறை கடவுச்சொல்',
            'Verify OTP': 'OTP சரிபார்',
            'Enter 6-digit SMS code': '6 இலக்க எஸ்எம்எஸ் குறியீட்டை உள்ளிடவும்',
            'Change phone number': 'தொலைபேசி எண்ணை மாற்று',
            '← Change phone number': '← தொலைபேசி எண்ணை மாற்று',
            'Resend OTP': 'OTP-ஐ மீண்டும் அனுப்பு',
            'Name': 'பெயர்',
            'Enter your name': 'உங்கள் பெயரை உள்ளிடவும்',
            'Email ID': 'மின்னஞ்சல் ஐடி',
            'Enter your email': 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
            'Create Account': 'கணக்கை உருவாக்கு',
            'Back to Home': 'முகப்புக்குத் திரும்பு',
            '← Back to Home': '← முகப்புக்குத் திரும்பு',
            'Country code': 'நாட்டுக் குறியீடு',
            '+91 India': '+91 இந்தியா',
            '+1 USA/Canada': '+1 அமெரிக்கா/கனடா',
            '+44 UK': '+44 யுகே',
            '+971 UAE': '+971 யுஏஇ',

            // Language Selection
            'Choose your language': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
            'Select your preferred language before continuing to your account.': 'உங்கள் கணக்கிற்குச் செல்லும் முன் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்.',
            'Preferred language': 'விருப்ப மொழி',
            'Continue': 'தொடரவும்',
            'Save language': 'மொழியைச் சேமி',

            // Location
            'Service Location': 'சேவை இருப்பிடம்',
            'Where do you need the service?': 'சேவை எங்கு தேவை?',
            'We use your location to show available professionals nearby.': 'அருகிலுள்ள நிபுணர்களைக் காட்ட உங்கள் இருப்பிடத்தைப் பயன்படுத்துகிறோம்.',
            'Use a saved address': 'சேமித்த முகவரியைப் பயன்படுத்து',
            'Choose an address': 'முகவரியைத் தேர்ந்தெடுக்கவும்',
            'Use Current Location': 'தற்போதைய இடத்தைப் பயன்படுத்து',
            '📍 Use Current Location': '📍 தற்போதைய இடத்தைப் பயன்படுத்து',
            'Your browser may ask for location permission.': 'உங்கள் உலாவி இருப்பிட அனுமதியைக் கோரலாம்.',
            'Choose your service location on the map': 'வரைபடத்தில் உங்கள் சேவை இருப்பிடத்தைத் தேர்வுசெய்க',
            'Drag to pan up, down, left, or right. Use the wheel or +/- controls to zoom.': 'வரைபடத்தை நகர்த்தவும். பெரிதாக்க +/- பயன்படுத்தவும்.',
            'Address label': 'முகவரி லேபிள்',
            'Home, work, shop': 'வீடு, அலுவலகம், கடை',
            'House / Flat number': 'வீடு / பிளாட் எண்',
            'House / Flat number (optional)': 'வீடு / பிளாட் எண் (விருப்பத்தேர்வு)',
            'Street / Area': 'தெரு / பகுதி',
            'City': 'நகரம்',
            'Pincode': 'அஞ்சல் குறியீடு (பின்கோடு)',
            'Save this address to my profile': 'இந்த முகவரியை எனது சுயவிவரத்தில் சேமிக்கவும்',
            'Name this address': 'இந்த முகவரிக்கு பெயரிடுங்கள்',
            'Home, Office, Work': 'வீடு, அலுவலகம், பணிமனை',
            'Use any name so you can find it quickly next time.': 'அடுத்த முறை எளிதாகக் கண்டுபிடிக்க ஏதேனும் ஒரு பெயரை இடவும்.',
            'Continue to Services': 'சேவைகளுக்குத் தொடரவும்',

            // Services
            'Choose a Service': 'சேவையைத் தேர்ந்தெடுக்கவும்',
            'What service do you need?': 'உங்களுக்கு என்ன சேவை தேவை?',
            'Pick one or more services. You can search or speak what you need.': 'ஒன்று அல்லது அதற்கு மேற்பட்ட சேவைகளைத் தேர்ந்தெடுக்கவும். பேசலாம் அல்லது தேடலாம்.',
            'Search services or tap 🎙️ to speak...': 'சேவைகளைத் தேடுங்கள் அல்லது 🎙️ தட்டிப் பேசுங்கள்...',
            'Clear search query': 'தேடலை அழிக்கவும்',
            'Clear text': 'உரையை அழிக்கவும்',
            'Search by voice': 'குரல் மூலம் தேடுங்கள்',
            'Click to speak service name': 'சேவை பெயரைப் பேச கிளிக் செய்யவும்',
            'Speak': 'பேசுங்கள்',
            'Listening... speak your service name (auto-stops if silent for 6s).': 'கேட்கிறது... சேவை பெயரைப் பேசுங்கள் (6 வினாடி மௌனத்திற்குப் பின் நிற்கும்).',
            'No services found matching': 'பொருந்தும் சேவைகள் எதுவும் கிடைக்கவில்லை',
            'Try speaking another keyword or pick from below.': 'வேறு வார்த்தையைப் பேசுங்கள் அல்லது கீழிருந்து தேர்வு செய்யவும்.',
            'No services selected': 'சேவைகள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
            'selected': 'தேர்ந்தெடுக்கப்பட்டது',
            'service selected': 'சேவை தேர்ந்தெடுக்கப்பட்டது',
            'services selected': 'சேவைகள் தேர்ந்தெடுக்கப்பட்டன',
            'Continue to Problem Details': 'சிக்கல் விவரங்களுக்குத் தொடரவும்',

            // Categories & Descriptions
            'Plumber': 'பிளம்பர் (குழாய் பழுதுபார்ப்பவர்)',
            'Pipe repairs, leak fixing, and bathroom installations': 'குழாய் பழுது, கசிவு சரிசெய்தல் மற்றும் குளியலறை பொருத்துதல்கள்',
            'Electrician': 'எலக்ட்ரீஷியன் (மின்சார நிபுணர்)',
            'Wiring, switches, fuse fixes, and appliance setup': 'வயரிங், சுவிட்சுகள், பியூஸ் பழுது மற்றும் சாதனங்கள் பொருத்துதல்',
            'Carpenter': 'தச்சர் (மரவேலை செய்பவர்)',
            'Furniture assembly, woodwork, and door repairs': 'மரச்சாமான்கள் பொருத்துதல், மரவேலை மற்றும் கதவு பழுதுகள்',
            'Cleaning & Sanitization': 'சுத்தம் மற்றும் சுகாதாரம்',
            'Deep home cleaning, kitchen & sofa wash': 'ஆழமான வீடு சுத்தம், சமையலறை மற்றும் சோபா கழுவுதல்',
            'Painter': 'பெயிண்டர் (வர்ணம் பூசுபவர்)',
            'Interior/exterior wall painting & touchups': 'உட்புற/வெளிப்புற சுவர் வர்ணம் பூசுதல்',
            'Mason / Construction': 'மேஸ்திரி / கட்டுமான வேலை',
            'Tile fixing, cement work, plastering & brickwork': 'டைல்ஸ் பொருத்துதல், சிமெண்ட் வேலை, பூச்சு மற்றும் செங்கல் வேலை',
            'AC Repair & Service': 'ஏசி பழுது மற்றும் சேவை',
            'Cooling issues, gas refill, filter cleaning': 'குளிர்ச்சி சிக்கல்கள், கேஸ் நிரப்புதல், பில்டர் சுத்தம் செய்தல்',
            'Gardener': 'தோட்டக்காரர்',
            'Lawn trimming, plant potting & garden care': 'புல் வெட்டுதல், செடி நடுதல் மற்றும் தோட்ட பராமரிப்பு',
            'Maid & Housekeeping': 'வீட்டுப் பணிப்பெண்',
            'Daily chores, dusting, sweeping & kitchen help': 'தினசரி வேலைகள், தூசி துடைத்தல், பெருக்குதல், சமையல் உதவி',
            'Appliance Repair': 'சாதனங்கள் பழுதுபார்ப்பு',
            'Washing machine, fridge, microwave & TV repair': 'வாஷிங் மெஷின், பிரிட்ஜ், மைக்ரோவேவ், டிவி பழுதுபார்ப்பு',
            'Home Painting': 'வீட்டு வர்ணம் பூசுதல்',
            'Car Wash & Detailing': 'கார் வாஷ் & பாலிஷ்',
            'Doorstep car foam wash, interior vacuum & polish': 'வீட்டு வாசலில் கார் போம் வாஷ், வேக்யூம் மற்றும் பாலிஷ்',

            // Problem Details
            'Problem Details': 'சிக்கல் விவரங்கள்',
            'Tell us about your problem': 'உங்கள் சிக்கலைப் பற்றி சொல்லுங்கள்',
            'Selected:': 'தேர்ந்தெடுக்கப்பட்டவை:',
            'What needs attention?': 'எதற்கு பழுது நீக்க வேண்டும்?',
            'Voice input language': 'குரல் உள்ளீட்டு மொழி',
            'Select speech language': 'பேசும் மொழியைத் தேர்ந்தெடுக்கவும்',
            'Describe by voice': 'குரல் மூலம் விவரிக்கவும்',
            'Click to start speaking': 'பேசத் தொடங்க கிளிக் செய்யவும்',
            'Listening... speak into your microphone.': 'கேட்கிறது... மைக்ரோஃபோனில் பேசுங்கள்.',
            'Describe what happened and what you need help with (or use the mic above)...': 'என்ன பிரச்சனை மற்றும் உங்களுக்கு என்ன உதவி தேவை என்பதை விவரிக்கவும்...',
            'Add a photo': 'புகைப்படம் சேர்க்கவும்',
            'Optional': 'விருப்பத்தேர்வு',
            '(optional)': '(விருப்பத்தேர்வு)',
            'When do you need help?': 'எப்போது உதவி தேவை?',
            'Find Nearby Providers': 'அருகிலுள்ள நிபுணர்களைக் கண்டறியவும்',

            // Providers / Workers
            'Nearby Providers': 'அருகிலுள்ள சேவை வழங்குநர்கள்',
            'Nearby available providers': 'அருகில் உள்ள நிபுணர்கள்',
            'Based on': 'அடிப்படையில்:',
            'and your saved location.': 'மற்றும் உங்கள் சேமித்த இடம்.',
            'Sort providers': 'வரிசைப்படுத்துங்கள்',
            'Nearest': 'மிக அருகில்',
            'Highest Rated': 'அதிக மதிப்பீடு',
            'Lowest Price': 'குறைந்த விலை',
            'estimated': 'மதிப்பிடப்பட்டது',
            'yrs': 'ஆண்டுகள்',
            'Send Request': 'கோரிக்கையை அனுப்பு',
            'No providers available yet': 'தற்போது நிபுணர்கள் யாரும் கிடைக்கவில்லை',
            'Try another service or check back shortly. Your request details are saved.': 'வேறு சேவையை முயற்சிக்கவும் அல்லது சிறிது நேரம் கழித்து பார்க்கவும்.',

            // Confirmation & Summary
            'Confirm Request': 'கோரிக்கையை உறுதிப்படுத்தவும்',
            'Booking Summary': 'முன்பதிவு சுருக்கம்',
            'Review your request before sending it.': 'அனுப்பும் முன் உங்கள் கோரிக்கை விவரங்களை மதிப்பாய்வு செய்யவும்.',
            'Customer': 'வாடிக்கையாளர்',
            'Service': 'சேவை',
            'Provider': 'சேவை வழங்குநர்',
            'Estimated price': 'மதிப்பிடப்பட்ட விலை',
            'Requested time': 'கோரப்பட்ட நேரம்',
            'Problem': 'சிக்கல்',
            'Contact': 'தொடர்பு',
            'Confirm Service Request': 'சேவை கோரிக்கையை உறுதிப்படுத்தவும்',

            // Live Status & Tracking
            'Request Status': 'கோரிக்கையின் நிலை',
            'Your service request has been sent!': 'உங்கள் சேவை கோரிக்கை அனுப்பப்பட்டது!',
            'is reviewing your request...': 'உங்கள் கோரிக்கையை பரிசீலிக்கிறார்...',
            'accepted your booking!': 'உங்கள் முன்பதிவை ஏற்றுக்கொண்டார்!',
            'is on the way!': 'உங்கள் இடத்தை நோக்கி வருகிறார்!',
            'Service in progress with': 'உடன் சேவை நடைபெறுகிறது',
            'Service Completed!': 'சேவை முடிந்தது!',
            'will review your booking and respond shortly.': 'விரைவில் பரிசீலித்து பதிலளிப்பார்.',
            'Provider is checking the problem details and preparing response.': 'நிபுணர் சிக்கல் விவரங்களை சரிபார்த்து வருகிறார்.',
            'Booking confirmed! Worker is packing tools to head to your location.': 'முன்பதிவு உறுதி செய்யப்பட்டது! நிபுணர் கிளம்புகிறார்.',
            'Follow live tracking below. Estimated arrival:': 'நேரலை டிராக்கிங் பார்க்கவும். எதிர்பார்க்கப்படும் வருகை நேரம்:',
            'is handling your service.': 'உங்கள் சேவையை கையாளுகிறார்.',
            'Order Confirmed': 'ஆர்டர் உறுதி செய்யப்பட்டது',
            'Provider Assigned': 'நிபுணர் நியமிக்கப்பட்டார்',
            'Heading your way': 'உங்கள் இடத்தை நோக்கி வருகிறார்',
            'At your location': 'உங்கள் இடத்தில் உள்ளார்',
            'In Progress': 'நடைபெறுகிறது',
            'Service Completed': 'சேவை முடிந்தது',
            'Distance': 'தூரம்',
            'ETA': 'மதிப்பிடப்பட்ட நேரம்',
            'Status': 'நிலை',
            'Payment': 'கட்டணம்',
            'Payment Pending': 'கட்டணம் நிலுவையில் உள்ளது',
            'Paid': 'செலுத்தப்பட்டது',
            'Request ID': 'கோரிக்கை ஐடி',
            'How was your experience?': 'உங்கள் அனுபவம் எப்படி இருந்தது?',
            'Pay': 'கட்டணம் செலுத்தவும்',
            'Payment completed successfully.': 'கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது.',
            'Rate your worker': 'பணியாளரை மதிப்பிடுங்கள்',
            'Choose a rating': 'மதிப்பீட்டைத் தேர்ந்தெடுக்கவும்',
            '5 - Excellent': '5 - மிகச் சிறந்தது',
            '4 - Good': '4 - நல்லது',
            '3 - Average': '3 - நடுத்தரம்',
            '2 - Poor': '2 - போதாது',
            '1 - Very poor': '1 - மிகவும் மோசம்',
            'Submit worker rating': 'மதிப்பீட்டைச் சமர்ப்பிக்கவும்',
            'Advance Status': 'நிலையை அடுத்த கட்டத்திற்கு நகர்த்தவும்',
            'Contact worker': 'பணியாளரைத் தொடர்பு கொள்ளவும்',
            'View booking details': 'முன்பதிவு விவரங்களைக் காண்க',
            'Cancel request': 'கோரிக்கையை ரத்து செய்',

            // Requests & Bookings
            'My requests': 'எனது கோரிக்கைகள்',
            'Track Live Status →': 'நேரலை நிலையை கண்காணிக்கவும் →',
            'No requests yet': 'இன்னும் கோரிக்கைகள் எதுவும் இல்லை',
            'Your sent requests will appear here.': 'நீங்கள் அனுப்பிய கோரிக்கைகள் இங்கே தோன்றும்.',
            'Provider:': 'வழங்குநர்:',
            'Time:': 'நேரம்:',
            'Price:': 'விலை:',
            'Message:': 'செய்தி:',
            'Booking History': 'முன்பதிவு வரலாறு',
            'View my bookings': 'எனது முன்பதிவுகளைக் காண்க',

            // Profile
            'Manage your details and preferences.': 'உங்கள் விவரங்கள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்.',
            'Customer details': 'வாடிக்கையாளர் விவரங்கள்',
            'Preferences': 'விருப்பங்கள்',
            'Language': 'மொழி',
            'Saved addresses': 'சேமிக்கப்பட்ட முகவரிகள்',
            'No saved addresses yet.': 'இன்னும் சேமித்த முகவரிகள் எதுவும் இல்லை.',
            'Delete': 'நீக்கு',
            'Add an address': 'முகவரியைச் சேர்க்கவும்',
            'Add address': 'முகவரியைச் சேர்க்கவும்',

            // Feedback Page
            'Tell us about ConnectX': 'கனெக்ட்எக்ஸ் பற்றிய உங்கள் கருத்து',
            'Help us make booking, tracking, and service quality better for everyone.': 'சேவை தரத்தை மேலும் மேம்படுத்த உங்கள் கருத்து உதவுகிறது.',
            'Thank you! Your feedback has been received and helps improve ConnectX.': 'நன்றி! உங்கள் கருத்து பெறப்பட்டது.',
            'Select Topic': 'தலைப்பைத் தேர்ந்தெடுக்கவும்',
            'General Experience': 'பொதுவான அனுபவம்',
            'Worker Quality': 'பணியாளர் தரம்',
            'Worker & Service Quality': 'பணியாளர் மற்றும் சேவை தரம்',
            'App & Speed': 'செயலி மற்றும் வேகம்',
            'App & Navigation': 'செயலி மற்றும் பயன்பாடு',
            'Payments & Price': 'கட்டணம் மற்றும் விலை',
            'Payment & Pricing': 'கட்டணம் மற்றும் கட்டண முறை',
            'Feature Request': 'புதிய வசதிக்கான யோசனை',
            'Report an Issue': 'சிக்கலைப் புகாரளிக்கவும்',
            'Rating': 'மதிப்பீடு',
            'Quick Tags': 'விரைவு குறிச்சொற்கள்',
            'Tap to add to your feedback': 'கருத்தில் சேர்க்க தட்டவும்',
            '⚡ Fast Booking': '⚡ வேகமான முன்பதிவு',
            '⚡ Fast and easy booking': '⚡ வேகமான மற்றும் எளிதான முன்பதிவு',
            '👷 Great Worker': '👷 சிறந்த பணியாளர்',
            '👷 Professional and polite worker': '👷 தொழில்முறை மற்றும் கண்ணியமான பணியாளர்',
            '📱 Smooth App': '📱 எளிதான செயலி',
            '📱 Smooth app experience': '📱 மிகச் சிறந்த செயலி பயன்பாடு',
            '💰 Fair Pricing': '💰 நியாயமான விலை',
            '💰 Fair and upfront pricing': '💰 வெளிப்படையான நியாயமான விலை',
            '⏱️ On-Time': '⏱️ சரியான நேரத்தில்',
            '⏱️ Arrived on time': '⏱️ சரியான நேரத்திற்கு வந்தார்',
            '🗺️ Accurate Tracking': '🗺️ துல்லியமான டிராக்கிங்',
            '🗺️ Accurate live tracking': '🗺️ துல்லியமான நேரலை டிராக்கிங்',
            '✨ Clean Job': '✨ சுத்தமான வேலை',
            '✨ Clean and neat job': '✨ மிகச் சுத்தமாகவும் நேர்த்தியாகவும் வேலை செய்தார்',
            '🔧 Need More Providers': '🔧 கூடுதல் நிபுணர்கள் தேவை',
            '🔧 Need more local providers': '🔧 இப்பகுதியில் கூடுதல் நிபுணர்கள் தேவை',
            '💬 Helpful Support': '💬 சிறந்த உதவி மையம்',
            '💬 Helpful customer support': '💬 மிகவும் பயனுள்ள வாடிக்கையாளர் உதவி',
            'Your Feedback': 'உங்கள் கருத்து',
            'What did you like or what can we improve? Tap quick tags above or speak using mic...': 'உங்களுக்கு என்ன பிடித்திருந்தது அல்லது நாங்கள் எதை மேம்படுத்த வேண்டும்? குறிச்சொற்களைத் தட்டவும் அல்லது மைக் மூலம் பேசவும்...',
            'Send feedback': 'கருத்தை அனுப்பவும்',

            // Help
            'How can we help?': 'நாங்கள் உங்களுக்கு எவ்வாறு உதவலாம்?',
            'Choose a service, describe the problem, and we will help you find an available professional nearby.': 'சேவையைத் தேர்வுசெய்யவும், சிக்கலை விவரிக்கவும், அருகிலுள்ள நிபுணரைக் கண்டறிய நாங்கள் உங்களுக்கு உதவுவோம்.',
            'Finding a provider': 'நிபுணரைக் கண்டறிதல்',
            'Filter providers by rating, price, or availability.': 'மதிப்பீடு, விலை அல்லது கிடைக்கும் தன்மை அடிப்படையில் வடிகட்டவும்.',
            'Request support': 'உதவி கோரிக்கை',
            'Contact us at': 'எங்களைத் தொடர்பு கொள்ள:',

            // Yoyo Assistant
            'Yoyo AI Assistant': 'யோயோ ஏஐ உதவியாளர்',
            'ConnectX assistant': 'கனெக்ட்எக்ஸ் உதவியாளர்',
            'Ask Yoyo support assistant': 'யோயோ உதவி உதவியாளரிடம் கேளுங்கள்',
            'Ask Yoyo': 'யோயோவிடம் கேளுங்கள்',
            'Ask a question or tap 🎙️…': 'கேள்வி கேளுங்கள் அல்லது 🎙️ தட்டவும்…',
            'Ask Yoyo anything or tap 🎙️ to speak…': 'யோயோவிடம் எதையும் கேளுங்கள் அல்லது 🎙️ தட்டவும்…',
            'Close chat': 'அரட்டையை மூடு',
            'Suggested questions': 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
            'Book a service': 'சேவை முன்பதிவு செய்',
            'How do I book?': 'முன்பதிவு செய்வது எப்படி?',
            'Pricing info': 'விலை தகவல்',
            'Live tracking': 'நேரலை கண்காணிப்பு',
            'Services list': 'சேவைகள் பட்டியல்',
            'Languages': 'மொழிகள்',
            'Give feedback': 'கருத்து தெரிவிக்கவும்',
            'Browse Services': 'சேவைகளை உலாவவும்',
            'View My Requests': 'என் கோரிக்கைகளைப் பார்',
            'Manage Saved Addresses': 'முகவரிகளை நிர்வகிக்கவும்',
            'Change Language': 'மொழியை மாற்றவும்',
            'Help Center': 'உதவி மையம்'
        },

        Kannada: {
            // Branding & Navigation
            'ConnectX': 'ಕನೆಕ್ಟ್‌ಎಕ್ಸ್',
            'CX': 'ಸಿಎಕ್ಸ್',
            'GigConnect': 'ಗಿಗ್‌ಕನೆಕ್ಟ್',
            'Home': 'ಮುಖಪುಟ',
            'Requests': 'ವಿನಂತಿಗಳು',
            'Profile': 'ಪ್ರೊಫೈಲ್',
            'Payments': 'ಪಾವತಿಗಳು',
            'Help': 'ಸಹಾಯ',
            'Feedback': 'ಪ್ರತಿಕ್ರಿಯೆ',
            'Login': 'ಲಾಗಿನ್',
            'Logout': 'ಲಾಗ್ ಔಟ್',
            'Log out': 'ಲಾಗ್ ಔಟ್',
            'My Profile': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
            'Customer Account': 'ಗ್ರಾಹಕರ ಖಾತೆ',
            'Active': 'ಸಕ್ರಿಯ',
            'ACCOUNT': 'ಖಾತೆ',
            'WELCOME': 'ಸ್ವಾಗತ',
            'SERVICE REQUESTS': 'ಸೇವಾ ವಿನಂತಿಗಳು',
            'FEEDBACK': 'ಪ್ರತಿಕ್ರಿಯೆ',
            'ALMOST THERE': 'ಬಹುತೇಕ ಪೂರ್ಣಗೊಂಡಿದೆ',
            'MATCHED FOR YOU': 'ನಿಮಗಾಗಿ ಹೊಂದಿಸಲಾಗಿದೆ',
            'A LITTLE MORE DETAIL': 'ಸ್ವಲ್ಪ ಹೆಚ್ಚಿನ ವಿವರ',
            'WHAT CAN WE HELP WITH?': 'ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
            'START A REQUEST': 'ವಿನಂತಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
            'COOPERATIVE GIG PLATFORM': 'ಸಹಕಾರಿ ಗಿಗ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
            'NEED A HAND?': 'ಸಹಾಯ ಬೇಕೇ?',
            'SERVICE COMPLETED': 'ಸೇವೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
            'LIVE WORKER LOCATION': 'ಸಿಬ್ಬಂದಿಯ ಲೈವ್ ಸ್ಥಳ',
            'Online': 'ಆನ್‌ಲೈನ್',
            '● Online': '● ಆನ್‌ಲೈನ್',
            '● Available': '● ಲಭ್ಯವಿದೆ',
            'Available': 'ಲಭ್ಯವಿದೆ',
            'Available Now': 'ಈಗ ಲಭ್ಯವಿದೆ',

            // Home / Landing
            'Cooperative Gig Services Platform': 'ಸಹಕಾರಿ ಗಿಗ್ ಸೇವೆಗಳ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
            'Connect directly with verified local service providers for home repairs, maintenance, cleaning, and more.': 'ಮನೆಯ ದುರಸ್ತಿ, ನಿರ್ವಹಣೆ ಮತ್ತು ಶುಚಿಗೊಳಿಸುವಿಕೆಗಾಗಿ ಪರಿಶೀಲಿಸಿದ ಸ್ಥಳೀಯ ಸೇವಾ ಪೂರೈಕೆದಾರರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.',
            'Login / Get Started': 'ಲಾಗಿನ್ / ಪ್ರಾರಂಭಿಸಿ',
            'Explore Services': 'ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
            'Verified Professionals': 'ಪರಿಶೀಲಿಸಿದ ವೃತ್ತಿಪರರು',
            'Direct connections to verified electricians, plumbers, carpenters, and technicians.': 'ಪರಿಶೀಲಿಸಿದ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್‌ಗಳು, ಪ್ಲಂಬರ್‌ಗಳು, ಬಡಗಿಗಳೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ.',
            'Real-time Tracking': 'ನೈಜ-ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್',
            'Live GPS tracking with ETA updates and direct contact with your assigned provider.': 'ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್, ಸಮಯದ ಅಂದಾಜು ಮತ್ತು ನಿಗದಿತ ಪೂರೈಕೆದಾರರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ.',
            '5 Languages Supported': '5 ಭಾಷೆಗಳು ಲಭ್ಯವಿದೆ',
            'Voice search and support in English, Hindi, Tamil, Telugu, and Kannada.': 'ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ತಮಿಳು, ತೆಲುಗು ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಶೋಧನೆ ಮತ್ತು ಬೆಂಬಲ.',

            // Login / Auth
            'Enter your phone number to continue.': 'ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
            'Phone Number': 'ಫೋನ್ ಸಂಖ್ಯೆ',
            'Enter phone number': 'ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
            'Send OTP': 'ಒಟಿಪಿ ಕಳುಹಿಸಿ',
            'One-Time Password': 'ಒನ್-ಟೈಮ್ ಪಾಸ್‌ವರ್ಡ್',
            'Verify OTP': 'ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ',
            'Enter 6-digit SMS code': '6 ಅಂಕಿಯ ಎಸ್‌ಎಂಎಸ್ ಕೋಡ್ ನಮೂದಿಸಿ',
            'Change phone number': 'ಫೋನ್ ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ',
            '← Change phone number': '← ಫೋನ್ ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ',
            'Resend OTP': 'ಒಟಿಪಿ ಮರುಕಳುಹಿಸಿ',
            'Name': 'ಹೆಸರು',
            'Enter your name': 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
            'Email ID': 'ಇಮೇಲ್ ಐಡಿ',
            'Enter your email': 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
            'Create Account': 'ಖಾತೆ ರಚಿಸಿ',
            'Back to Home': 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
            '← Back to Home': '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
            'Country code': 'ದೇಶದ ಕೋಡ್',
            '+91 India': '+91 ಭಾರತ',
            '+1 USA/Canada': '+1 ಯುಎಸ್ಎ/ಕೆನಡಾ',
            '+44 UK': '+44 ಯುಕೆ',
            '+971 UAE': '+971 ಯುಎಇ',

            // Language Selection
            'Choose your language': 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            'Select your preferred language before continuing to your account.': 'ನಿಮ್ಮ ಖಾತೆಗೆ ಮುಂದುವರಿಯುವ ಮೊದಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
            'Preferred language': 'ಆದ್ಯತೆಯ ಭಾಷೆ',
            'Continue': 'ಮುಂದುವರಿಸಿ',
            'Save language': 'ಭಾಷೆ ಉಳಿಸಿ',

            // Location
            'Service Location': 'ಸೇವಾ ಸ್ಥಳ',
            'Where do you need the service?': 'ಸೇವೆ ನಿಮಗೆ ಎಲ್ಲಿ ಬೇಕು?',
            'We use your location to show available professionals nearby.': 'ಹತ್ತಿರದ ಲಭ್ಯವಿರುವ ವೃತ್ತಿಪರರನ್ನು ತೋರಿಸಲು ನಾವು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಬಳಸುತ್ತೇವೆ.',
            'Use a saved address': 'ಉಳಿಸಿದ ವಿಳಾಸವನ್ನು ಬಳಸಿ',
            'Choose an address': 'ವಿಳಾಸವನ್ನು ಆರಿಸಿ',
            'Use Current Location': 'ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ',
            '📍 Use Current Location': '📍 ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ',
            'Your browser may ask for location permission.': 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸ್ಥಳದ ಅನುಮತಿ ಕೇಳಬಹುದು.',
            'Choose your service location on the map': 'ನಕ್ಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಸೇವಾ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            'Drag to pan up, down, left, or right. Use the wheel or +/- controls to zoom.': 'ನಕ್ಷೆಯನ್ನು ಚಲಿಸಿ. ಜೂಮ್ ಮಾಡಲು +/- ಬಳಸಿ.',
            'Address label': 'ವಿಳಾಸದ ಲೇಬಲ್',
            'Home, work, shop': 'ಮನೆ, ಕಚೇರಿ, ಅಂಗಡಿ',
            'House / Flat number': 'ಮನೆ / ಫ್ಲಾಟ್ ಸಂಖ್ಯೆ',
            'House / Flat number (optional)': 'ಮನೆ / ಫ್ಲಾಟ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
            'Street / Area': 'ರಸ್ತೆ / ಪ್ರದೇಶ',
            'City': 'ನಗರ',
            'Pincode': 'ಪಿನ್‌ಕೋಡ್',
            'Save this address to my profile': 'ಈ ವಿಳಾಸವನ್ನು ನನ್ನ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಿ',
            'Name this address': 'ಈ ವಿಳಾಸಕ್ಕೆ ಹೆಸರಿಸಿ',
            'Home, Office, Work': 'ಮನೆ, ಕಚೇರಿ, ಕೆಲಸದ ಸ್ಥಳ',
            'Use any name so you can find it quickly next time.': 'ಮುಂದಿನ ಬಾರಿ ಸುಲಭವಾಗಿ ಹುಡುಕಲು ಯಾವುದೇ ಹೆಸರನ್ನು ನೀಡಿ.',
            'Continue to Services': 'ಸೇವೆಗಳಿಗೆ ಮುಂದುವರಿಸಿ',

            // Services
            'Choose a Service': 'ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            'What service do you need?': 'ನಿಮಗೆ ಯಾವ ಸೇವೆ ಬೇಕು?',
            'Pick one or more services. You can search or speak what you need.': 'ಒಂದು ಅಥವಾ ಹೆಚ್ಚಿನ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಮಾತನಾಡಬಹುದು ಅಥವಾ ಹುಡುಕಬಹುದು.',
            'Search services or tap 🎙️ to speak...': 'ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ ಅಥವಾ 🎙️ ಒತ್ತಿ ಮಾತನಾಡಿ...',
            'Clear search query': 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ',
            'Clear text': 'ಪಠ್ಯ ತೆರವುಗೊಳಿಸಿ',
            'Search by voice': 'ಧ್ವನಿ ಮೂಲಕ ಹುಡುಕಿ',
            'Click to speak service name': 'ಸೇವೆಯ ಹೆಸರನ್ನು ಹೇಳಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
            'Speak': 'ಮಾತನಾಡಿ',
            'Listening... speak your service name (auto-stops if silent for 6s).': 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಸೇವೆಯ ಹೆಸರು ಹೇಳಿ (6 ಸೆಕೆಂಡ್ ಮೌನದ ನಂತರ ನಿಲ್ಲುತ್ತದೆ).',
            'No services found matching': 'ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಸೇವೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
            'Try speaking another keyword or pick from below.': 'ಬೇರೆ ಪದ ಹೇಳಿ ಅಥವಾ ಕೆಳಗಿನಿಂದ ಆಯ್ಕೆಮಾಡಿ.',
            'No services selected': 'ಯಾವುದೇ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ',
            'selected': 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
            'service selected': 'ಸೇವೆ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
            'services selected': 'ಸೇವೆಗಳು ಆಯ್ಕೆಯಾಗಿವೆ',
            'Continue to Problem Details': 'ಸಮಸ್ಯೆಯ ವಿವರಗಳಿಗೆ ಮುಂದುವರಿಸಿ',

            // Categories & Descriptions
            'Plumber': 'ಪ್ಲಂಬರ್ (ನಲ್ಲಿ ಮತ್ತು ಪೈಪ್ ಕೆಲಸ)',
            'Pipe repairs, leak fixing, and bathroom installations': 'ಪೈಪ್ ದುರಸ್ತಿ, ಸೋರಿಕೆ ಪರಿಹಾರ ಮತ್ತು ಸ್ನಾನಗೃಹ ಫಿಟ್ಟಿಂಗ್',
            'Electrician': 'ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ (ವಿದ್ಯುತ್ ಕೆಲಸ)',
            'Wiring, switches, fuse fixes, and appliance setup': 'ವೈರಿಂಗ್, ಸ್ವಿಚ್‌ಗಳು, ಫ್ಯೂಸ್ ದುರಸ್ತಿ ಮತ್ತು ಉಪಕರಣಗಳ ಜೋಡಣೆ',
            'Carpenter': 'ಬಡಗಿ (ಮರದ ಕೆಲಸ)',
            'Furniture assembly, woodwork, and door repairs': 'ಪೀಠೋಪಕರಣ ಜೋಡಣೆ, ಮರದ ಕೆಲಸ ಮತ್ತು ಬಾಗಿಲು ದುರಸ್ತಿ',
            'Cleaning & Sanitization': 'ಸ್ವಚ್ಛತೆ ಮತ್ತು ನೈರ್ಮಲ್ಯ',
            'Deep home cleaning, kitchen & sofa wash': 'ಮನೆಯ ಸಂಪೂರ್ಣ ಸ್ವಚ್ಛತೆ, ಅಡುಗೆಮನೆ ಮತ್ತು ಸೋಫಾ ವಾಶ್',
            'Painter': 'ಪೇಂಟರ್ (ಬಣ್ಣ ಬಳಿಯುವವರು)',
            'Interior/exterior wall painting & touchups': 'ಗೋಡೆಗಳಿಗೆ ಒಳಾಂಗಣ/ಹೊರಾಂಗಣ ಬಣ್ಣ ಮತ್ತು ಟಚ್‌ಅಪ್‌ಗಳು',
            'Mason / Construction': 'ಮೇಸ್ತ್ರಿ / ಕಟ್ಟಡ ನಿರ್ಮಾಣ',
            'Tile fixing, cement work, plastering & brickwork': 'ಟೈಲ್ಸ್ ಜೋಡಣೆ, ಸಿಮೆಂಟ್ ಕೆಲಸ, ಪ್ಲಾಸ್ಟರಿಂಗ್ ಮತ್ತು ಇಟ್ಟಿಗೆ ಕೆಲಸ',
            'AC Repair & Service': 'ಎಸಿ ರಿಪೇರಿ ಮತ್ತು ಸರ್ವಿಸ್',
            'Cooling issues, gas refill, filter cleaning': 'ಕೂಲಿಂಗ್ ಸಮಸ್ಯೆಗಳು, ಗ್ಯಾಸ್ ಮರುಪೂರಣ, ಫಿಲ್ಟರ್ ಸ್ವಚ್ಛತೆ',
            'Gardener': 'ತೋಟಗಾರ',
            'Lawn trimming, plant potting & garden care': 'ಹುಲ್ಲು ಕತ್ತರಿಸುವುದು, ಗಿಡ ನೆಡುವುದು ಮತ್ತು ತೋಟದ ಆರೈಕೆ',
            'Maid & Housekeeping': 'ಮನೆಗೆಲಸದವರು',
            'Daily chores, dusting, sweeping & kitchen help': 'ದೈನಂದಿನ ಕೆಲಸಗಳು, ಧೂಳು ತೆಗೆಯುವುದು, ಕಸ ಗುಡಿಸುವುದು, ಅಡುಗೆ ಸಹಾಯ',
            'Appliance Repair': 'ಗೃಹೋಪಯೋಗಿ ಉಪಕರಣಗಳ ದುರಸ್ತಿ',
            'Washing machine, fridge, microwave & TV repair': 'ವಾಷಿಂಗ್ ಮೆಷಿನ್, ಫ್ರಿಜ್, ಮೈಕ್ರೊವೇವ್ ಮತ್ತು ಟಿವಿ ದುರಸ್ತಿ',
            'Home Painting': 'ಮನೆ ಪೇಂಟಿಂಗ್',
            'Car Wash & Detailing': 'ಕಾರ್ ವಾಶ್ ಮತ್ತು ಪಾಲಿಶ್',
            'Doorstep car foam wash, interior vacuum & polish': 'ಮನೆಬಾಗಿಲಿಗೆ ಕಾರ್ ಫೋಮ್ ವಾಶ್, ವ್ಯಾಕ್ಯೂಮ್ ಮತ್ತು ಪಾಲಿಶ್',

            // Problem Details
            'Problem Details': 'ಸಮಸ್ಯೆಯ ವಿವರಗಳು',
            'Tell us about your problem': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ',
            'Selected:': 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ:',
            'What needs attention?': 'ಏನನ್ನು ಸರಿಪಡಿಸಬೇಕು?',
            'Voice input language': 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಭಾಷೆ',
            'Select speech language': 'ಮಾತನಾಡುವ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
            'Describe by voice': 'ಧ್ವನಿ ಮೂಲಕ ವಿವರಿಸಿ',
            'Click to start speaking': 'ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
            'Listening... speak into your microphone.': 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ.',
            'Describe what happened and what you need help with (or use the mic above)...': 'ಏನಾಯಿತು ಮತ್ತು ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು ಎಂಬುದನ್ನು ವಿವರಿಸಿ...',
            'Add a photo': 'ಫೋಟೋ ಸೇರಿಸಿ',
            'Optional': 'ಐಚ್ಛಿಕ',
            '(optional)': '(ಐಚ್ಛಿಕ)',
            'When do you need help?': 'ನಿಮಗೆ ಯಾವಾಗ ಸಹಾಯ ಬೇಕು?',
            'Find Nearby Providers': 'ಹತ್ತಿರದ ಪೂರೈಕೆದಾರರನ್ನು ಹುಡುಕಿ',

            // Providers / Workers
            'Nearby Providers': 'ಹತ್ತಿರದ ಸೇವಾ ಪೂರೈಕೆದಾರರು',
            'Nearby available providers': 'ಹತ್ತಿರದ ಲಭ್ಯವಿರುವ ವೃತ್ತಿಪರರು',
            'Based on': 'ಆಧಾರಿತ:',
            'and your saved location.': 'ಮತ್ತು ನಿಮ್ಮ ಉಳಿಸಿದ ಸ್ಥಳ.',
            'Sort providers': 'ವಿಂಗಡಿಸಿ',
            'Nearest': 'ಅತಿ ಹತ್ತಿರದ',
            'Highest Rated': 'ಅತ್ಯುತ್ತಮ ರೇಟಿಂಗ್',
            'Lowest Price': 'ಕಡಿಮೆ ಬೆಲೆ',
            'estimated': 'ಅಂದಾಜು',
            'yrs': 'ವರ್ಷಗಳು',
            'Send Request': 'ವಿನಂತಿ ಕಳುಹಿಸಿ',
            'No providers available yet': 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಪೂರೈಕೆದಾರರು ಲಭ್ಯವಿಲ್ಲ',
            'Try another service or check back shortly. Your request details are saved.': 'ಬೇರೆ ಸೇವೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ನೋಡಿ.',

            // Confirmation & Summary
            'Confirm Request': 'ವಿನಂತಿಯನ್ನು ದೃಢೀಕರಿಸಿ',
            'Booking Summary': 'ಬುಕಿಂಗ್ ಸಾರಾಂಶ',
            'Review your request before sending it.': 'ಕಳುಹಿಸುವ ಮೊದಲು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
            'Customer': 'ಗ್ರಾಹಕರು',
            'Service': 'ಸೇವೆ',
            'Provider': 'ಸೇವಾ ಪೂರೈಕೆದಾರ',
            'Estimated price': 'ಅಂದಾಜು ಬೆಲೆ',
            'Requested time': 'ಕೋರಿದ ಸಮಯ',
            'Problem': 'ಸಮಸ್ಯೆ',
            'Contact': 'ಸಂಪರ್ಕ',
            'Confirm Service Request': 'ಸೇವಾ ವಿನಂತಿಯನ್ನು ದೃಢೀಕರಿಸಿ',

            // Live Status & Tracking
            'Request Status': 'ವಿನಂತಿಯ ಸ್ಥಿತಿ',
            'Your service request has been sent!': 'ನಿಮ್ಮ ಸೇವಾ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ!',
            'is reviewing your request...': 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ...',
            'accepted your booking!': 'ನಿಮ್ಮ ಬುಕಿಂಗ್ ಅನ್ನು ಸ್ವೀಕರಿಸಿದ್ದಾರೆ!',
            'is on the way!': 'ನಿಮ್ಮ ಕಡೆಗೆ ಬರುತ್ತಿದ್ದಾರೆ!',
            'Service in progress with': 'ರೊಂದಿಗೆ ಸೇವೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
            'Service Completed!': 'ಸೇವೆ ಪೂರ್ಣಗೊಂಡಿದೆ!',
            'will review your booking and respond shortly.': 'ಶೀಘ್ರದಲ್ಲೇ ಪರಿಶೀಲಿಸಿ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಾರೆ.',
            'Provider is checking the problem details and preparing response.': 'ಪೂರೈಕೆದಾರರು ಸಮಸ್ಯೆಯ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ.',
            'Booking confirmed! Worker is packing tools to head to your location.': 'ಬುಕಿಂಗ್ ದೃಢಪಟ್ಟಿದೆ! ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ಹೊರಡುತ್ತಿದ್ದಾರೆ.',
            'Follow live tracking below. Estimated arrival:': 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್ ವೀಕ್ಷಿಸಿ. ತಲುಪುವ ಅಂದಾಜು ಸಮಯ:',
            'is handling your service.': 'ನಿಮ್ಮ ಸೇವೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತಿದ್ದಾರೆ.',
            'Order Confirmed': 'ಆರ್ಡರ್ ದೃಢಪಟ್ಟಿದೆ',
            'Provider Assigned': 'ಪೂರೈಕೆದಾರರನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ',
            'Heading your way': 'ನಿಮ್ಮ ಕಡೆಗೆ ಬರುತ್ತಿದ್ದಾರೆ',
            'At your location': 'ನಿಮ್ಮ ಸ್ಥಳದಲ್ಲಿದ್ದಾರೆ',
            'In Progress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
            'Service Completed': 'ಸೇವೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
            'Distance': 'ದೂರ',
            'ETA': 'ಅಂದಾಜು ಸಮಯ',
            'Status': 'ಸ್ಥಿತಿ',
            'Payment': 'ಪಾವತಿ',
            'Payment Pending': 'ಪಾವತಿ ಬಾಕಿ ಇದೆ',
            'Paid': 'ಪಾವತಿಸಲಾಗಿದೆ',
            'Request ID': 'ವಿನಂತಿ ಐಡಿ',
            'How was your experience?': 'ನಿಮ್ಮ ಅನುಭವ ಹೇಗಿತ್ತು?',
            'Pay': 'ಪಾವತಿಸಿ',
            'Payment completed successfully.': 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ.',
            'Rate your worker': 'ಸಿಬ್ಬಂದಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ',
            'Choose a rating': 'ರೇಟಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ',
            '5 - Excellent': '5 - ಅತ್ಯುತ್ತಮ',
            '4 - Good': '4 - ಉತ್ತಮ',
            '3 - Average': '3 - ಸಾಧಾರಣ',
            '2 - Poor': '2 - ಸಾಲದು',
            '1 - Very poor': '1 - ತುಂಬಾ ಕಳಪೆ',
            'Submit worker rating': 'ರೇಟಿಂಗ್ ಸಲ್ಲಿಸಿ',
            'Advance Status': 'ಸ್ಥಿತಿಯನ್ನು ಮುಂದಕ್ಕೆ ಸರಿಸಿ',
            'Contact worker': 'ಸಿಬ್ಬಂದಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ',
            'View booking details': 'ಬುಕಿಂಗ್ ವಿವರಗಳನ್ನು ನೋಡಿ',
            'Cancel request': 'ವಿನಂತಿಯನ್ನು ರದ್ದುಮಾಡಿ',

            // Requests & Bookings
            'My requests': 'ನನ್ನ ವಿನಂತಿಗಳು',
            'Track Live Status →': 'ಲೈವ್ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ →',
            'No requests yet': 'ಇನ್ನೂ ಯಾವುದೇ ವಿನಂತಿಗಳಿಲ್ಲ',
            'Your sent requests will appear here.': 'ನೀವು ಕಳುಹಿಸಿದ ವಿನಂತಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.',
            'Provider:': 'ಪೂರೈಕೆದಾರ:',
            'Time:': 'ಸಮಯ:',
            'Price:': 'ಬೆಲೆ:',
            'Message:': 'ಸಂದೇಶ:',
            'Booking History': 'ಬುಕಿಂಗ್ ಇತಿಹಾಸ',
            'View my bookings': 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳನ್ನು ನೋಡಿ',

            // Profile
            'Manage your details and preferences.': 'ನಿಮ್ಮ ವಿವರಗಳು ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
            'Customer details': 'ಗ್ರಾಹಕರ ವಿವರಗಳು',
            'Preferences': 'ಆದ್ಯತೆಗಳು',
            'Language': 'ಭಾಷೆ',
            'Saved addresses': 'ಉಳಿಸಿದ ವಿಳಾಸಗಳು',
            'No saved addresses yet.': 'ಇನ್ನೂ ಉಳಿಸಿದ ವಿಳಾಸಗಳಿಲ್ಲ.',
            'Delete': 'ಅಳಿಸಿ',
            'Add an address': 'ವಿಳಾಸ ಸೇರಿಸಿ',
            'Add address': 'ವಿಳಾಸ ಸೇರಿಸಿ',

            // Feedback Page
            'Tell us about ConnectX': 'ಕನೆಕ್ಟ್‌ಎಕ್ಸ್ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆ ತಿಳಿಸಿ',
            'Help us make booking, tracking, and service quality better for everyone.': 'ಬುಕಿಂಗ್, ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸೇವಾ ಗುಣಮಟ್ಟವನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡಿ.',
            'Thank you! Your feedback has been received and helps improve ConnectX.': 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.',
            'Select Topic': 'ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            'General Experience': 'ಸಾಮಾನ್ಯ ಅನುಭವ',
            'Worker Quality': 'ಸಿಬ್ಬಂದಿ ಗುಣಮಟ್ಟ',
            'Worker & Service Quality': 'ಸಿಬ್ಬಂದಿ ಮತ್ತು ಸೇವಾ ಗುಣಮಟ್ಟ',
            'App & Speed': 'ಆ್ಯಪ್ ಮತ್ತು ವೇಗ',
            'App & Navigation': 'ಆ್ಯಪ್ ಮತ್ತು ಬಳಕೆ',
            'Payments & Price': 'ಪಾವತಿ ಮತ್ತು ಬೆಲೆ',
            'Payment & Pricing': 'ಪಾವತಿ ಮತ್ತು ಬೆಲೆ ನಿಗದಿ',
            'Feature Request': 'ಹೊಸ ವೈಶಿಷ್ಟ್ಯದ ಸಲಹೆ',
            'Report an Issue': 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
            'Rating': 'ರೇಟಿಂಗ್',
            'Quick Tags': 'ತ್ವರಿತ ಟ್ಯಾಗ್‌ಗಳು',
            'Tap to add to your feedback': 'ಪ್ರತಿಕ್ರಿಯೆಗೆ ಸೇರಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
            '⚡ Fast Booking': '⚡ ವೇಗದ ಬುಕಿಂಗ್',
            '⚡ Fast and easy booking': '⚡ ವೇಗದ ಮತ್ತು ಸುಲಭವಾದ ಬುಕಿಂಗ್',
            '👷 Great Worker': '👷 ಉತ್ತಮ ಸಿಬ್ಬಂದಿ',
            '👷 Professional and polite worker': '👷 ವೃತ್ತಿಪರ ಮತ್ತು ವಿನಮ್ರ ಸಿಬ್ಬಂದಿ',
            '📱 Smooth App': '📱 ಸುಲಭವಾದ ಆ್ಯಪ್',
            '📱 Smooth app experience': '📱 ಅತ್ಯಂತ ಸುಲಭವಾದ ಆ್ಯಪ್ ಅನುಭವ',
            '💰 Fair Pricing': '💰 ನ್ಯಾಯಯುತ ಬೆಲೆ',
            '💰 Fair and upfront pricing': '💰 ಪಾರದರ್ಶಕ ಮತ್ತು ನ್ಯಾಯಯುತ ಬೆಲೆ',
            '⏱️ On-Time': '⏱️ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ',
            '⏱️ Arrived on time': '⏱️ ನಿಗದಿತ ಸಮಯಕ್ಕೆ ತಲುಪಿದರು',
            '🗺️ Accurate Tracking': '🗺️ ನಿಖರವಾದ ಟ್ರ್ಯಾಕಿಂಗ್',
            '🗺️ Accurate live tracking': '🗺️ ನಿಖರವಾದ ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
            '✨ Clean Job': '✨ ಅಚ್ಚುಕಟ್ಟಾದ ಕೆಲಸ',
            '✨ Clean and neat job': '✨ ಅತ್ಯಂತ ಅಚ್ಚುಕಟ್ಟಾದ ಕೆಲಸ',
            '🔧 Need More Providers': '🔧 ಹೆಚ್ಚಿನ ತಜ್ಞರು ಬೇಕು',
            '🔧 Need more local providers': '🔧 ಈ ಪ್ರದೇಶದಲ್ಲಿ ಹೆಚ್ಚಿನ ತಜ್ಞರು ಬೇಕಾಗಿದ್ದಾರೆ',
            '💬 Helpful Support': '💬 ಉಪಯುಕ್ತ ಬೆಂಬಲ',
            '💬 Helpful customer support': '💬 ಅತ್ಯಂತ ಸಹಾಯಕ ಗ್ರಾಹಕ ಬೆಂಬಲ',
            'Your Feedback': 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ',
            'What did you like or what can we improve? Tap quick tags above or speak using mic...': 'ನಿಮಗೆ ಏನು ಇಷ್ಟವಾಯಿತು ಅಥವಾ ನಾವು ಏನನ್ನು ಸುಧಾರಿಸಬೇಕು? ಮೇಲಿನ ಟ್ಯಾಗ್ ಒತ್ತಿ ಅಥವಾ ಮೈಕ್ ಬಳಸಿ...',
            'Send feedback': 'ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಿ',

            // Help
            'How can we help?': 'ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
            'Choose a service, describe the problem, and we will help you find an available professional nearby.': 'ಸೇವೆಯನ್ನು ಆರಿಸಿ, ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ, ಹತ್ತಿರದ ವೃತ್ತಿಪರರನ್ನು ಹುಡುಕಲು ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
            'Finding a provider': 'ಪೂರೈಕೆದಾರರನ್ನು ಹುಡುಕುವುದು',
            'Filter providers by rating, price, or availability.': 'ರೇಟಿಂಗ್, ಬೆಲೆ ಅಥವಾ ಲಭ್ಯತೆಯ ಆಧಾರದ ಮೇಲೆ ಫಿಲ್ಟರ್ ಮಾಡಿ.',
            'Request support': 'ಬೆಂಬಲ ಕೋರಿ',
            'Contact us at': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ:',

            // Yoyo Assistant
            'Yoyo AI Assistant': 'ಯೋಯೋ ಎಐ ಸಹಾಯಕ',
            'ConnectX assistant': 'ಕನೆಕ್ಟ್‌ಎಕ್ಸ್ ಸಹಾಯಕ',
            'Ask Yoyo support assistant': 'ಯೋಯೋ ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
            'Ask Yoyo': 'ಯೋಯೋ ಅವರನ್ನು ಕೇಳಿ',
            'Ask a question or tap 🎙️…': 'ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ 🎙️ ಟ್ಯಾಪ್ ಮಾಡಿ…',
            'Ask Yoyo anything or tap 🎙️ to speak…': 'ಯೋಯೋ ಬಳಿ ಏನನ್ನಾದರೂ ಕೇಳಿ ಅಥವಾ 🎙️ ಟ್ಯಾಪ್ ಮಾಡಿ…',
            'Close chat': 'ಚಾಟ್ ಮುಚ್ಚಿ',
            'Suggested questions': 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು',
            'Book a service': 'ಸೇವೆ ಬುಕ್ ಮಾಡಿ',
            'How do I book?': 'ಬುಕಿಂಗ್ ಮಾಡುವುದು ಹೇಗೆ?',
            'Pricing info': 'ಬೆಲೆ ಮಾಹಿತಿ',
            'Live tracking': 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
            'Services list': 'ಸೇವೆಗಳ ಪಟ್ಟಿ',
            'Languages': 'ಭಾಷೆಗಳು',
            'Give feedback': 'ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ',
            'Browse Services': 'ಸೇವೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
            'View My Requests': 'ನನ್ನ ವಿನಂತಿಗಳನ್ನು ನೋಡಿ',
            'Manage Saved Addresses': 'ವಿಳಾಸಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
            'Change Language': 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
            'Help Center': 'ಸಹಾಯ ಕೇಂದ್ರ'
        }
    };

    const dictionary = translations[language] || {};
    const normalizedDictionary = Object.fromEntries(
        Object.entries(dictionary).map(([key, value]) => [key.trim().toLowerCase(), value])
    );

    // Sort dictionary keys by length (longest first) for robust substring replacement
    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

    function translateText(str) {
        if (!str || typeof str !== 'string') return str;
        const trimmed = str.trim();
        if (!trimmed) return str;

        // 1. Direct exact or normalized match
        if (dictionary[trimmed]) {
            return str.replace(trimmed, dictionary[trimmed]);
        }
        const lower = trimmed.toLowerCase();
        if (normalizedDictionary[lower]) {
            return str.replace(trimmed, normalizedDictionary[lower]);
        }

        // 2. Pattern-based dynamic replacements
        let result = str;

        // Handle "Step X of Y" -> "ಹಂತ X / Y"
        const stepMatch = result.match(/(\d+)\s+of\s+(\d+)/i);
        if (stepMatch) {
            const stepWord = {
                Hindi: 'चरण',
                Telugu: 'దశ',
                Tamil: 'படி',
                Kannada: 'ಹಂತ'
            }[language] || 'Step';
            result = result.replace(stepMatch[0], `${stepWord} ${stepMatch[1]} / ${stepMatch[2]}`);
        }

        // Handle "Selected: X" or "Welcome back, X!"
        const welcomeMatch = result.match(/Welcome back,\s*([^!]+)!/i);
        if (welcomeMatch) {
            const welcomeWord = {
                Hindi: 'पुनः स्वागत है',
                Telugu: 'తిరిగి స్వాగతం',
                Tamil: 'மீண்டும் வரவேற்கிறோம்',
                Kannada: 'ಮತ್ತೆ ಸುಸ್ವಾಗತ'
            }[language] || 'Welcome back';
            result = result.replace(welcomeMatch[0], `${welcomeWord}, ${welcomeMatch[1]}!`);
        }

        // Substring dictionary replacement for multi-part sentences
        for (let i = 0; i < sortedKeys.length; i++) {
            const phrase = sortedKeys[i];
            if (phrase.length > 3 && result.includes(phrase)) {
                result = result.split(phrase).join(dictionary[phrase]);
            }
        }

        return result;
    }

    function translateElement(element) {
        if (!element) return;
        const tagName = element.tagName ? element.tagName.toUpperCase() : '';
        if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'NOSCRIPT'].includes(tagName)) return;

        // Translate Attributes (placeholder, aria-label, title)
        ['placeholder', 'aria-label', 'title'].forEach(attr => {
            if (element.hasAttribute && element.hasAttribute(attr)) {
                const currentVal = element.getAttribute(attr);
                if (currentVal && currentVal.trim()) {
                    const trans = translateText(currentVal);
                    if (trans !== currentVal) element.setAttribute(attr, trans);
                }
            }
        });

        // Translate Option text in select elements
        if (tagName === 'OPTION' && element.text) {
            const trans = translateText(element.text);
            if (trans !== element.text) element.text = trans;
        }

        // Translate submit button values
        if (tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button') && element.value) {
            const trans = translateText(element.value);
            if (trans !== element.value) element.value = trans;
        }
    }

    function translateDOM(root = document.body) {
        if (!root) return;

        // 1. Process Text Nodes
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (parent && ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'NOSCRIPT'].includes(parent.tagName.toUpperCase())) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);

        textNodes.forEach(node => {
            const original = node.nodeValue;
            const translated = translateText(original);
            if (translated !== original) {
                node.nodeValue = translated;
            }
        });

        // 2. Process Interactive Elements & Attributes
        root.querySelectorAll('input, textarea, select, option, button, [aria-label], [title]').forEach(translateElement);
    }

    // Initial Translation on Load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => translateDOM());
    } else {
        translateDOM();
    }

    // Live Translation Observer for Dynamic DOM updates (e.g. status polling, chat responses, voice status)
    if (window.MutationObserver) {
        let debounceTimer = null;
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            for (let i = 0; i < mutations.length; i++) {
                const m = mutations[i];
                if (m.type === 'childList' && m.addedNodes.length > 0) {
                    for (let j = 0; j < m.addedNodes.length; j++) {
                        const node = m.addedNodes[j];
                        if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE'].includes(node.tagName.toUpperCase())) {
                            hasNewNodes = true;
                            break;
                        }
                    }
                } else if (m.type === 'characterData') {
                    hasNewNodes = true;
                    break;
                }
            }

            if (hasNewNodes) {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    observer.disconnect();
                    translateDOM();
                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
                }, 100);
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            });
        }
    }
})();