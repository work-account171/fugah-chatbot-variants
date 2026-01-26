// ========================================
// FUGAH CHATBOT WIDGET - MAIN JAVASCRIPT
// ========================================
// This file contains all the functionality for the Fugah chatbot widget
// including theme switching, message handling, and user interactions

(function() {
  // ========================================
  // STORE ID CONFIGURATION FUNCTIONALITY
  // ========================================
  // Read store ID from script tag data attribute
  const scriptTag = document.currentScript;
  const storeId = scriptTag.getAttribute("data-store-id") || "demo-store";

  console.log("Widget loaded for store:", storeId);


  // ========================================
  // END STORE ID CONFIGURATION FUNCTIONALITY
  // ========================================


  // ========================================
  // SHADOW DOM SETUP FUNCTIONALITY
  // ========================================
  // Create wrapper element and attach shadow DOM for style isolation
  const wrapper = document.createElement("div");
  wrapper.id = "chatbot-widget-root";
  document.body.appendChild(wrapper);

  // API call to n8n webhook (for future integration)
  fetch("https://n8n.srv1196634.hstgr.cloud/webhook/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ message: "hello" })
  })
  .then(async res => {
    const text = await res.text();
    console.log("Status:", res.status);
  //  console.log("Body:", text);
  })
  .catch(console.error);
  
  const shadow = wrapper.attachShadow({ mode: "open" }); // Create shadow DOM


  // ========================================
  // END SHADOW DOM SETUP FUNCTIONALITY
  // ========================================


  // ========================================
  // CSS LOADING FUNCTIONALITY
  // ========================================
  // Load CSS stylesheet into shadow DOM
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "widget.css"; // CSS file path
  shadow.appendChild(style);


  // ========================================
  // END CSS LOADING FUNCTIONALITY
  // ========================================


  // ========================================
  // HTML LOADING AND DOM ELEMENT SELECTION FUNCTIONALITY
  // ========================================
  // Load HTML template and initialize all DOM elements
  fetch("ui.html") // Load HTML template
        .then(res => res.text())
        .then(html => {
      shadow.innerHTML += html; // Inject HTML into shadow DOM

      // Select all required DOM elements from shadow DOM
          const bubble = shadow.querySelector("#chat-bubble");
          const chatIcon = shadow.querySelector("#chat-icon");
          const chatWindow = shadow.querySelector("#chat-window");
          const sendMessageBtn = shadow.querySelector(".fugah-send-button");
          const phoneInput = shadow.querySelector("#phone-input");
      const customPlaceholder = shadow.querySelector("#custom-placeholder");
      const countryCodeBtn = shadow.querySelector("#country-code-btn");
      const countryCodeDropdown = shadow.querySelector("#country-code-dropdown");
      const countryList = shadow.querySelector("#country-list");
      const countryFlag = shadow.querySelector("#country-flag");
      const countryCodeText = shadow.querySelector("#country-code-text");
      const numberFormat = shadow.querySelector("#number-format");
      const phoneValidationError = shadow.querySelector("#phone-validation-error");
          const mainHomeContainer = shadow.querySelector(".main-home-container");
          const mainMessageContainer = shadow.querySelector(".main-message-container");
          const mainMessageDetailContainer = shadow.querySelector(".main-message-detail-container");
      const mainRatingContainer = shadow.querySelector(".main-rating-container");
      const ratingBackBtn = shadow.querySelector("#rating-back-btn");
          const messageCloseBtn = shadow.querySelector("#message-close-btn");
          const messageDetailBackBtn = shadow.querySelector("#message-detail-back-btn");
          const fugahMessageDetailDropdownIcon = shadow.querySelector("#fugah-message-detail-dropdown-icon");
          const fugahMessageDetailDropdown = shadow.querySelector("#fugah-message-detail-dropdown");
          const closeChatDetailMenuItem = shadow.querySelector("#close-chat-detail-menu-item");
          const createTicketDetailMenuItem = shadow.querySelector("#create-ticket-detail-menu-item");
          // Custom confirmation dialog elements
          const customConfirmationDialog = shadow.querySelector("#custom-confirmation-dialog");
          const confirmationDialogMessage = shadow.querySelector("#confirmation-dialog-message");
          const confirmationBtnCancel = shadow.querySelector("#confirmation-btn-cancel");
          const confirmationBtnConfirm = shadow.querySelector("#confirmation-btn-confirm");
      const fugahRatingDropdownIcon = shadow.querySelector("#fugah-rating-dropdown-icon");
      const fugahRatingDropdown = shadow.querySelector("#fugah-rating-dropdown");
      const closeRatingMenuItem = shadow.querySelector("#close-rating-menu-item");
          const messageDetailInput = shadow.querySelector("#message-detail-input");
          const messageDetailSendBtn = shadow.querySelector("#message-detail-send-btn");
          const messageDetailMessages = shadow.querySelector("#message-detail-messages");
          const messageItems = shadow.querySelectorAll(".message-item");
          const footerTabItems = shadow.querySelectorAll(".fugah-footer-tab-item");
          const fugahFooter = shadow.querySelector("#fugah-footer");
          

      // ========================================
      // END HTML LOADING AND DOM ELEMENT SELECTION FUNCTIONALITY
      // ========================================


      // ========================================
      // ASSET PATH HELPER FUNCTIONALITY
      // ========================================
      // Helper function to get correct asset paths in shadow DOM
          const getAssetPath = (filename) => {
            // Since we're at /test/index.html, assets are at ../assets/
            return `../assets/${filename}`;
          };
          

      // ========================================
      // END ASSET PATH HELPER FUNCTIONALITY
      // ========================================


      // ========================================
      // INITIAL ICON SETUP FUNCTIONALITY
      // ========================================
      // Set initial icon paths for chat bubble and arrows
          if (chatIcon) {
            chatIcon.src = getAssetPath("message.png");
          }

      // Fix initial arrow paths and chat/rating header exit icons
      const backArrow = shadow.querySelector("#message-detail-back-btn");
      const ratingBackArrow = shadow.querySelector("#rating-back-btn");
      const messageListArrows = shadow.querySelectorAll(".message-item img");
      if (backArrow) {
        backArrow.src = getAssetPath("white-exit-button.png");
      }
      if (ratingBackArrow) {
        ratingBackArrow.src = getAssetPath("white-exit-button.png");
      }
      // messageListArrows will be set correctly by changeTheme() 


      // ========================================
      // END INITIAL ICON SETUP FUNCTIONALITY
      // ========================================


      // ========================================
      // CHAT WINDOW TOGGLE FUNCTIONALITY
      // ========================================
      // Handle opening and closing of chat window with icon switching
      let isOpen = false;
      
      // Store scroll prevention handlers for cleanup
      let scrollPreventionHandlers = {
        homeContainer: null,
        chatContainer: null,
        chatWindow: null
      };

      const toggleChat = () => {
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? "flex" : "none";
        
        // Get the body element with fugah-body class (from main document, not shadow DOM)
        const fugahBody = document.querySelector('.fugah-body');
        
        // Helper function to check if device is mobile
        const checkIsMobile = () => {
          // Check both window width and matchMedia for better mobile detection
          const width = window.innerWidth;
          const isMobileWidth = width <= 767;
          const isMobileMedia = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
          const isMobile = isMobileWidth || isMobileMedia;
          console.log('Mobile check - width:', width, 'isMobileWidth:', isMobileWidth, 'isMobileMedia:', isMobileMedia, 'isMobile:', isMobile);
          return isMobile;
        };

        // Function to get dynamic viewport height that accounts for browser bars
        const getDynamicViewportHeight = () => {
          // Use window.innerHeight which accounts for browser UI bars
          // This is more reliable than 100vh on mobile browsers
          const height = window.innerHeight;
          
          // For iOS Safari, also check visualViewport if available
          if (window.visualViewport && window.visualViewport.height) {
            // Use the larger value to ensure full coverage
            return Math.max(height, window.visualViewport.height);
          }
          
          return height;
        };

        // Function to update chat window position and height dynamically (mobile only)
        // Positions chat window just above keyboard when it appears
        let mobileHeightUpdateHandler = null;
        const setupMobileHeightUpdates = () => {
          // Remove existing handler if any
          if (mobileHeightUpdateHandler) {
            window.removeEventListener('resize', mobileHeightUpdateHandler);
            window.removeEventListener('orientationchange', mobileHeightUpdateHandler);
            if (window.visualViewport) {
              window.visualViewport.removeEventListener('resize', mobileHeightUpdateHandler);
              window.visualViewport.removeEventListener('scroll', mobileHeightUpdateHandler);
            }
          }

          mobileHeightUpdateHandler = () => {
            if (isOpen && checkIsMobile()) {
              // Use visualViewport API to detect keyboard and position accordingly
              if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const viewportOffsetTop = window.visualViewport.offsetTop || 0;
                
                // When keyboard is open, visualViewport.offsetTop will be > 0
                // Position chat window at the top of visible viewport (just above keyboard)
                if (viewportOffsetTop > 0) {
                  // Keyboard is open - position just above it
                  chatWindow.style.setProperty("top", `${viewportOffsetTop}px`, "important");
                  chatWindow.style.setProperty("height", `${viewportHeight}px`, "important");
                  chatWindow.style.setProperty("bottom", "auto", "important");
                  console.log('Keyboard open - positioned at top:', viewportOffsetTop, 'height:', viewportHeight);
                } else {
                  // Keyboard is closed - use full viewport
                  const dynamicHeight = getDynamicViewportHeight();
                  chatWindow.style.setProperty("top", "0", "important");
                  chatWindow.style.setProperty("height", `${dynamicHeight}px`, "important");
                  chatWindow.style.setProperty("bottom", "0", "important");
                  console.log('Keyboard closed - full viewport height:', dynamicHeight);
                }
              } else {
                // Fallback for browsers without visualViewport support
                const dynamicHeight = getDynamicViewportHeight();
                chatWindow.style.setProperty("height", `${dynamicHeight}px`, "important");
                chatWindow.style.setProperty("top", "0", "important");
                chatWindow.style.setProperty("bottom", "0", "important");
                console.log('Updated mobile height to:', dynamicHeight);
              }
            }
          };

          // Add event listeners for viewport changes
          window.addEventListener('resize', mobileHeightUpdateHandler, { passive: true });
          window.addEventListener('orientationchange', mobileHeightUpdateHandler, { passive: true });
          
          // Use visualViewport API for better mobile browser support
          if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', mobileHeightUpdateHandler, { passive: true });
            window.visualViewport.addEventListener('scroll', mobileHeightUpdateHandler, { passive: true });
          }
        };

        // Function to remove mobile height update listeners
        const removeMobileHeightUpdates = () => {
          if (mobileHeightUpdateHandler) {
            window.removeEventListener('resize', mobileHeightUpdateHandler);
            window.removeEventListener('orientationchange', mobileHeightUpdateHandler);
            if (window.visualViewport) {
              window.visualViewport.removeEventListener('resize', mobileHeightUpdateHandler);
              window.visualViewport.removeEventListener('scroll', mobileHeightUpdateHandler);
            }
            mobileHeightUpdateHandler = null;
          }
        };
        
        // Clear phone input when closing chat (returning to home screen)
        if (!isOpen && phoneInput) {
          phoneInput.value = "";
          if (customPlaceholder) {
            customPlaceholder.classList.remove("invalid");
            customPlaceholder.style.display = "block";
            customPlaceholder.style.opacity = "1";
          }
          if (phoneValidationError) {
            phoneValidationError.style.display = "none";
          }
          phoneInput.classList.remove("valid", "invalid");
        }
        
        // Reset to home screen when opening chat
        if (isOpen) {
          // Show home screen when opening chat
          if (mainHomeContainer) mainHomeContainer.style.display = "flex";
          if (mainMessageContainer) mainMessageContainer.style.display = "none";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
          if (mainRatingContainer) mainRatingContainer.style.display = "none";
          if (fugahFooter) fugahFooter.classList.remove("detail-active");
          
          // Reset footer tabs to home
          switchTab("home");
        }
        
        // Toggle icon between message and cross based on current theme
        if (isOpen) {
          // Check if device is mobile (max-width: 767px)
          const isMobile = checkIsMobile();
          
          // Get chat-container and chat-content elements
          const chatContainer = shadow.querySelector("#chat-container");
          const chatContent = shadow.querySelector("#chat-content");
          
          // Add class to indicate chat window is open
          chatWindow.classList.add("chat-window-open");
          
          // Only apply fullscreen changes on mobile devices
          if (isMobile) {
            console.log('Applying mobile fullscreen styles');
            
            // Get current theme
            const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
            const themeName = currentTheme ? currentTheme[1] : 'black';
            console.log('Current theme:', themeName);
            
            // Remove background-image from body when chat opens (mobile only)
            // This removes main-yellow-bg.png or any other theme background
            if (fugahBody) {
              console.log('Removing background from fugah-body');
              fugahBody.style.setProperty("background-image", "none", "important");
            } else {
              console.error('fugahBody not found!');
            }
            
            // Change background image to mobile version for all themes (mobile only)
            // Replace regular bg with mobile bg for all themes
            const mobileBackgroundMap = {
              'green': 'chatbot-green-mobile-bg.png',
              'red': 'chatbot-red-mobile-bg.png',
              'blue': 'chatbot-cyan-mobile-bg.png', // theme-blue uses cyan-bg
              'yellow': 'chatbot-yellow-mobile-bg.png',
              'cyan': 'chatbot-blue-mobile-bg.png', // theme-cyan uses blue-bg
              'black': 'chatbot-black-mobile-bg.png',
              'white': 'chatbot-black-mobile-bg.png'
            };
            
            if (mobileBackgroundMap[themeName]) {
              console.log(`Setting mobile background for ${themeName} theme`);
              chatWindow.style.setProperty("background-image", `url(/assets/${mobileBackgroundMap[themeName]})`, "important");
              chatWindow.style.setProperty("background-size", "cover", "important");
              chatWindow.style.setProperty("background-position", "center top", "important");
              chatWindow.style.setProperty("background-repeat", "no-repeat", "important");
            }
            
            // Make chat-window fullscreen with no border-radius and full height (mobile only)
            console.log('Setting fullscreen styles');
            
            // Position chat window based on visualViewport (accounts for keyboard)
            const positionChatWindow = () => {
              if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const viewportOffsetTop = window.visualViewport.offsetTop || 0;
                
                // When keyboard is open, visualViewport.offsetTop will be > 0
                if (viewportOffsetTop > 0) {
                  // Keyboard is open - position just above it
                  chatWindow.style.setProperty("top", `${viewportOffsetTop}px`, "important");
                  chatWindow.style.setProperty("height", `${viewportHeight}px`, "important");
                  chatWindow.style.setProperty("bottom", "auto", "important");
                } else {
                  // Keyboard is closed - use full viewport
                  const dynamicHeight = getDynamicViewportHeight();
                  chatWindow.style.setProperty("top", "0", "important");
                  chatWindow.style.setProperty("height", `${dynamicHeight}px`, "important");
                  chatWindow.style.setProperty("bottom", "0", "important");
                }
              } else {
                // Fallback for browsers without visualViewport support
                const dynamicHeight = getDynamicViewportHeight();
                chatWindow.style.setProperty("top", "0", "important");
                chatWindow.style.setProperty("height", `${dynamicHeight}px`, "important");
                chatWindow.style.setProperty("bottom", "0", "important");
              }
            };
            
            chatWindow.style.setProperty("position", "fixed", "important");
            chatWindow.style.setProperty("left", "0", "important");
            chatWindow.style.setProperty("right", "0", "important");
            chatWindow.style.setProperty("width", "100vw", "important");
            chatWindow.style.setProperty("max-width", "none", "important");
            chatWindow.style.setProperty("max-height", "none", "important");
            chatWindow.style.setProperty("border-radius", "0", "important");
            chatWindow.style.setProperty("padding", "0", "important");
            chatWindow.style.setProperty("margin", "0", "important");
            
            // Initial positioning
            positionChatWindow();
            
            // Setup dynamic height updates for browser bar changes and keyboard
            setupMobileHeightUpdates();
            
            // Update position again after a short delay to ensure accuracy
            // This handles cases where browser bars or keyboard haven't fully adjusted yet
            setTimeout(() => {
              if (isOpen && checkIsMobile()) {
                positionChatWindow();
              }
            }, 100);
            
            // Make chat-container full height (mobile only)
            if (chatContainer) {
              chatContainer.style.setProperty("height", "100%", "important");
              chatContainer.style.setProperty("min-height", "100%", "important");
              chatContainer.style.setProperty("border-radius", "0", "important");
              chatContainer.style.setProperty("padding", "0", "important");
              chatContainer.style.setProperty("margin", "0", "important");
              chatContainer.style.setProperty("display", "flex", "important");
              chatContainer.style.setProperty("flex-direction", "column", "important");
            }
            
            // Make fugah-main-container full height and ensure footer at bottom (mobile only)
            const fugahMainContainer = shadow.querySelector("#fugah-main-container");
            if (fugahMainContainer) {
              fugahMainContainer.style.setProperty("height", "100%", "important");
              fugahMainContainer.style.setProperty("min-height", "100%", "important");
              fugahMainContainer.style.setProperty("max-height", "none", "important");
              fugahMainContainer.style.setProperty("display", "flex", "important");
              fugahMainContainer.style.setProperty("flex-direction", "column", "important");
              fugahMainContainer.style.setProperty("justify-content", "space-between", "important");
            }
            
            // Ensure footer is at bottom (mobile only)
            const fugahFooter = shadow.querySelector("#fugah-footer");
            if (fugahFooter) {
              fugahFooter.style.setProperty("margin-top", "auto", "important");
              fugahFooter.style.setProperty("flex-shrink", "0", "important");
            }
            
            // Remove border-radius, padding, and margin from chat-content (mobile only)
            if (chatContent) {
              chatContent.style.setProperty("border-radius", "0", "important");
              chatContent.style.setProperty("padding", "0", "important");
              chatContent.style.setProperty("margin", "0", "important");
              chatContent.style.setProperty("margin-top", "0", "important");
            }

            // Prevent scrolling on home screen for mobile (iOS Safari fix)
            const preventHomeScreenScroll = (e) => {
              // Only prevent if we're on the home screen
              if (mainHomeContainer && mainHomeContainer.style.display !== "none") {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            };

            // Store handler reference for cleanup
            scrollPreventionHandlers.homeContainer = preventHomeScreenScroll;
            scrollPreventionHandlers.chatContainer = preventHomeScreenScroll;
            scrollPreventionHandlers.chatWindow = preventHomeScreenScroll;

            // Add touch event listeners to prevent scrolling on home screen
            if (mainHomeContainer) {
              mainHomeContainer.addEventListener('touchmove', preventHomeScreenScroll, { passive: false });
              mainHomeContainer.addEventListener('touchstart', preventHomeScreenScroll, { passive: false });
              mainHomeContainer.addEventListener('touchend', preventHomeScreenScroll, { passive: false });
            }
            if (chatContainer) {
              chatContainer.addEventListener('touchmove', preventHomeScreenScroll, { passive: false });
            }
            if (chatWindow) {
              chatWindow.addEventListener('touchmove', preventHomeScreenScroll, { passive: false });
            }
          } else {
            // Tablet/Desktop: Keep normal chat window behavior (no fullscreen changes)
            // Don't remove background image, don't change chat window size
          }
          
          // Get current theme to set correct X icon
          const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
          const themeName = currentTheme ? currentTheme[1] : 'black';
          
          // COMMENTED OUT: X icon logic when chat opens - bubble will be hidden instead
          // Uncomment below if you need to show X icon when chat is open in the future
          /*
          let xIconPath;
          switch(themeName) {
            case 'green':
              xIconPath = getAssetPath("X-green.png");
              break;
            case 'red':
              xIconPath = getAssetPath("X-red.png");
              break;
            case 'blue':
              xIconPath = getAssetPath("X-cyan.png");
              break;
            case 'yellow':
              xIconPath = getAssetPath("X-yellow.png");
              break;
            case 'cyan':
              xIconPath = getAssetPath("x-blue.png");
              break;
            case 'white':
              xIconPath = getAssetPath("X.png");
              break;
            case 'black':
            default:
              xIconPath = getAssetPath("X.png"); // Default X for black theme
              break;
          }
          
          chatIcon.src = xIconPath;
          */
          // Hide chat bubble - screens will appear in its place
          bubble.classList.add("chat-open");
        } else {
          // Check if device is mobile (max-width: 767px)
          const isMobile = checkIsMobile();
          
          // Get current theme to restore correct background and message icon
          const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
          const themeName = currentTheme ? currentTheme[1] : 'black';
          
          // Get chat-container and chat-content elements
          const chatContainer = shadow.querySelector("#chat-container");
          const chatContent = shadow.querySelector("#chat-content");
          
          // Remove class to indicate chat window is closed
          chatWindow.classList.remove("chat-window-open");
          
          // Only restore styles if they were applied (mobile only)
          if (isMobile) {
            // Remove mobile height update listeners when chat closes
            removeMobileHeightUpdates();
            
            // Remove scroll prevention listeners when chat closes
            if (scrollPreventionHandlers.homeContainer && mainHomeContainer) {
              mainHomeContainer.removeEventListener('touchmove', scrollPreventionHandlers.homeContainer);
              mainHomeContainer.removeEventListener('touchstart', scrollPreventionHandlers.homeContainer);
              mainHomeContainer.removeEventListener('touchend', scrollPreventionHandlers.homeContainer);
            }
            if (scrollPreventionHandlers.chatContainer && chatContainer) {
              chatContainer.removeEventListener('touchmove', scrollPreventionHandlers.chatContainer);
            }
            if (scrollPreventionHandlers.chatWindow && chatWindow) {
              chatWindow.removeEventListener('touchmove', scrollPreventionHandlers.chatWindow);
            }
            
            // Clear handler references
            scrollPreventionHandlers.homeContainer = null;
            scrollPreventionHandlers.chatContainer = null;
            scrollPreventionHandlers.chatWindow = null;
            
            // Restore background-image when chat closes based on current theme (mobile only)
            if (fugahBody) {
              let backgroundImagePath;
              switch(themeName) {
                case 'green':
                  backgroundImagePath = "url('assets/main-bg.png')";
                  break;
                case 'red':
                  backgroundImagePath = "url('assets/main-red-bg.png')";
                  break;
                case 'blue':
                  backgroundImagePath = "url('assets/main-blue-bg.png')";
                  break;
                case 'yellow':
                  backgroundImagePath = "url('assets/main-yellow-bg.png')";
                  break;
                case 'cyan':
                  backgroundImagePath = "url('assets/main-cyan-bg.png')";
                  break;
                case 'black':
                  backgroundImagePath = "url('assets/main-black-bg.png')";
                  break;
                case 'white':
                  backgroundImagePath = "url('assets/main-white-bg.png')";
                  break;
                default:
                  backgroundImagePath = "url('assets/main-bg.png')";
                  break;
              }
              fugahBody.style.removeProperty("background-image");
              fugahBody.style.backgroundImage = backgroundImagePath;
            }
            
            // Restore chat-window background image for all themes (mobile only)
            // Remove inline styles to let CSS take over for all themes
            chatWindow.style.removeProperty("background-image");
            chatWindow.style.removeProperty("background-size");
            chatWindow.style.removeProperty("background-position");
            chatWindow.style.removeProperty("background-repeat");
            
            // Restore chat-window to normal size (mobile only)
            chatWindow.style.removeProperty("position");
            chatWindow.style.removeProperty("top");
            chatWindow.style.removeProperty("left");
            chatWindow.style.removeProperty("right");
            chatWindow.style.removeProperty("bottom");
            chatWindow.style.removeProperty("width");
            chatWindow.style.removeProperty("height");
            chatWindow.style.removeProperty("max-width");
            chatWindow.style.removeProperty("max-height");
            chatWindow.style.removeProperty("border-radius");
            chatWindow.style.removeProperty("padding");
            chatWindow.style.removeProperty("margin");
            
            // Restore chat-container styles (mobile only)
            if (chatContainer) {
              chatContainer.style.removeProperty("height");
              chatContainer.style.removeProperty("min-height");
              chatContainer.style.removeProperty("border-radius");
              chatContainer.style.removeProperty("padding");
              chatContainer.style.removeProperty("margin");
              chatContainer.style.removeProperty("display");
              chatContainer.style.removeProperty("flex-direction");
            }
            
            // Restore fugah-main-container styles (mobile only)
            const fugahMainContainer = shadow.querySelector("#fugah-main-container");
            if (fugahMainContainer) {
              fugahMainContainer.style.removeProperty("height");
              fugahMainContainer.style.removeProperty("min-height");
              fugahMainContainer.style.removeProperty("max-height");
              fugahMainContainer.style.removeProperty("display");
              fugahMainContainer.style.removeProperty("flex-direction");
              fugahMainContainer.style.removeProperty("justify-content");
            }
            
            // Restore footer styles (mobile only)
            const fugahFooter = shadow.querySelector("#fugah-footer");
            if (fugahFooter) {
              fugahFooter.style.removeProperty("margin-top");
              fugahFooter.style.removeProperty("flex-shrink");
            }
            
            // Restore chat-content styles (mobile only)
            if (chatContent) {
              chatContent.style.removeProperty("border-radius");
              chatContent.style.removeProperty("padding");
              chatContent.style.removeProperty("margin");
              chatContent.style.removeProperty("margin-top");
            }
          }
          // Tablet/Desktop: No changes needed, chat window stays in normal state
          
          let iconPath;
          switch(themeName) {
            case 'green':
              iconPath = getAssetPath("message-green.png");
              break;
            case 'red':
              iconPath = getAssetPath("message-red.png");
              break;
            case 'blue':
              iconPath = getAssetPath("message-blue.png");
              break;
            case 'yellow':
              iconPath = getAssetPath("message-yellow.png");
              break;
            case 'cyan':
              iconPath = getAssetPath("message-cyan.png");
              break;
            case 'white':
              iconPath = getAssetPath("message.png");
              break;
            case 'black':
            default:
              iconPath = getAssetPath("message-white.png");
              break;
          }
          chatIcon.src = iconPath;
          bubble.classList.remove("chat-open");
          
          // Stop timestamp updates when chat is closed
          stopTimestampUpdates();
        }
      };


      // ========================================
      // END CHAT WINDOW TOGGLE FUNCTIONALITY
      // ========================================


      // ========================================
      // CHAT WINDOW EVENT LISTENERS FUNCTIONALITY
      // ========================================
      // Add event listeners for opening and closing chat window
      
      // Open chat from bubble click
      bubble.addEventListener("click", (e) => {
        console.log('Chat bubble clicked, window width:', window.innerWidth);
        toggleChat();
      });

      // Close chat from header close button (and message-list close – same class .close-button)
      const closeButtons = shadow.querySelectorAll(".close-button");
      closeButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleChat();
        });
        btn.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          toggleChat();
        });
      });
      if (closeButtons.length === 0) {
        console.error("Close button not found in shadow DOM");
      }

      // Close chat from message container X button
      if (messageCloseBtn) {
        messageCloseBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleChat();
        });
      }

      // Close chat from FAB (when open)
      chatIcon.addEventListener("click", (e) => {
        if (isOpen) {
          e.stopPropagation();
          toggleChat();
        }
      });


      // ========================================
      // END CHAT WINDOW EVENT LISTENERS FUNCTIONALITY
      // ========================================


      // ========================================
      // COUNTRY CODE DROPDOWN AND PHONE VALIDATION FUNCTIONALITY
      // ========================================
      // Country codes data with flags, phone formats, and validation patterns
      const countryCodes = [
        { code: "966", flag: "🇸🇦", name: "Saudi Arabia", iso: "SA", format: "5xxxxxxxx", pattern: /^5\d{8}$/, minLength: 9, maxLength: 9 },
        { code: "1", flag: "🇺🇸", name: "United States", iso: "US", format: "(xxx) xxx-xxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "44", flag: "🇬🇧", name: "United Kingdom", iso: "GB", format: "xxxx xxxxxx", pattern: /^\d{10,11}$/, minLength: 10, maxLength: 11 },
        { code: "971", flag: "🇦🇪", name: "United Arab Emirates", iso: "AE", format: "5x xxx xxxx", pattern: /^5\d{8}$/, minLength: 9, maxLength: 9 },
        { code: "965", flag: "🇰🇼", name: "Kuwait", iso: "KW", format: "xxxx xxxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "974", flag: "🇶🇦", name: "Qatar", iso: "QA", format: "xxxx xxxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "973", flag: "🇧🇭", name: "Bahrain", iso: "BH", format: "xxxx xxxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "968", flag: "🇴🇲", name: "Oman", iso: "OM", format: "xxxx xxxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "961", flag: "🇱🇧", name: "Lebanon", iso: "LB", format: "xx xxx xxx", pattern: /^\d{7,8}$/, minLength: 7, maxLength: 8 },
        { code: "962", flag: "🇯🇴", name: "Jordan", iso: "JO", format: "x xxxx xxxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "20", flag: "🇪🇬", name: "Egypt", iso: "EG", format: "xxx xxx xxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "212", flag: "🇲🇦", name: "Morocco", iso: "MA", format: "xxxx-xxxxxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "213", flag: "🇩🇿", name: "Algeria", iso: "DZ", format: "xxx xx xx xx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "216", flag: "🇹🇳", name: "Tunisia", iso: "TN", format: "xx xxx xxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "33", flag: "🇫🇷", name: "France", iso: "FR", format: "x xx xx xx xx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "49", flag: "🇩🇪", name: "Germany", iso: "DE", format: "xxxx xxxxxxx", pattern: /^\d{10,11}$/, minLength: 10, maxLength: 11 },
        { code: "39", flag: "🇮🇹", name: "Italy", iso: "IT", format: "xxx xxx xxxx", pattern: /^\d{9,10}$/, minLength: 9, maxLength: 10 },
        { code: "34", flag: "🇪🇸", name: "Spain", iso: "ES", format: "xxx xxx xxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "31", flag: "🇳🇱", name: "Netherlands", iso: "NL", format: "x xxxx xxxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "32", flag: "🇧🇪", name: "Belgium", iso: "BE", format: "xxxx xx xx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "41", flag: "🇨🇭", name: "Switzerland", iso: "CH", format: "xx xxx xx xx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "43", flag: "🇦🇹", name: "Austria", iso: "AT", format: "xxxx xxxxxx", pattern: /^\d{10,13}$/, minLength: 10, maxLength: 13 },
        { code: "46", flag: "🇸🇪", name: "Sweden", iso: "SE", format: "xx-xxx xx xx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "47", flag: "🇳🇴", name: "Norway", iso: "NO", format: "xxx xx xxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "45", flag: "🇩🇰", name: "Denmark", iso: "DK", format: "xx xx xx xx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "358", flag: "🇫🇮", name: "Finland", iso: "FI", format: "xx xxx xxxx", pattern: /^\d{9,10}$/, minLength: 9, maxLength: 10 },
        { code: "7", flag: "🇷🇺", name: "Russia", iso: "RU", format: "xxx xxx-xx-xx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "86", flag: "🇨🇳", name: "China", iso: "CN", format: "xxx xxxx xxxx", pattern: /^\d{11}$/, minLength: 11, maxLength: 11 },
        { code: "81", flag: "🇯🇵", name: "Japan", iso: "JP", format: "xx-xxxx-xxxx", pattern: /^\d{10,11}$/, minLength: 10, maxLength: 11 },
        { code: "82", flag: "🇰🇷", name: "South Korea", iso: "KR", format: "xxx-xxxx-xxxx", pattern: /^\d{10,11}$/, minLength: 10, maxLength: 11 },
        { code: "91", flag: "🇮🇳", name: "India", iso: "IN", format: "xxxxx xxxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "61", flag: "🇦🇺", name: "Australia", iso: "AU", format: "xxxx xxxx", pattern: /^\d{9,10}$/, minLength: 9, maxLength: 10 },
        { code: "64", flag: "🇳🇿", name: "New Zealand", iso: "NZ", format: "xxxx xxxx", pattern: /^\d{8,9}$/, minLength: 8, maxLength: 9 },
        { code: "27", flag: "🇿🇦", name: "South Africa", iso: "ZA", format: "xx xxx xxxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "52", flag: "🇲🇽", name: "Mexico", iso: "MX", format: "xx xxxx xxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "55", flag: "🇧🇷", name: "Brazil", iso: "BR", format: "(xx) xxxxx-xxxx", pattern: /^\d{10,11}$/, minLength: 10, maxLength: 11 },
        { code: "54", flag: "🇦🇷", name: "Argentina", iso: "AR", format: "xx xxxx-xxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "90", flag: "🇹🇷", name: "Turkey", iso: "TR", format: "xxx xxx xx xx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "60", flag: "🇲🇾", name: "Malaysia", iso: "MY", format: "xx-xxx xxxx", pattern: /^\d{9,10}$/, minLength: 9, maxLength: 10 },
        { code: "65", flag: "🇸🇬", name: "Singapore", iso: "SG", format: "xxxx xxxx", pattern: /^\d{8}$/, minLength: 8, maxLength: 8 },
        { code: "66", flag: "🇹🇭", name: "Thailand", iso: "TH", format: "xx-xxx-xxxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 },
        { code: "62", flag: "🇮🇩", name: "Indonesia", iso: "ID", format: "xxx-xxxx-xxxx", pattern: /^\d{9,11}$/, minLength: 9, maxLength: 11 },
        { code: "63", flag: "🇵🇭", name: "Philippines", iso: "PH", format: "xxx xxx xxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "84", flag: "🇻🇳", name: "Vietnam", iso: "VN", format: "xxx xxxx xxx", pattern: /^\d{9,10}$/, minLength: 9, maxLength: 10 },
        { code: "92", flag: "🇵🇰", name: "Pakistan", iso: "PK", format: "xxx xxxxxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "880", flag: "🇧🇩", name: "Bangladesh", iso: "BD", format: "xxxx-xxxxxx", pattern: /^\d{10}$/, minLength: 10, maxLength: 10 },
        { code: "94", flag: "🇱🇰", name: "Sri Lanka", iso: "LK", format: "xx xxx xxxx", pattern: /^\d{9}$/, minLength: 9, maxLength: 9 }
      ];

      // Current selected country (default: Saudi Arabia)
      let selectedCountry = countryCodes.find(c => c.code === "966") || countryCodes[0];

      // Validate phone number - auto-detects country code from input (accessible globally)
      function validatePhoneNumber() {
        if (!phoneInput || !phoneValidationError) return;
        
        const phoneNumber = phoneInput.value.trim().replace(/\D/g, "");
        
        if (!phoneNumber) {
          phoneInput.classList.remove("valid", "invalid");
          if (customPlaceholder) customPlaceholder.classList.remove("invalid");
          phoneValidationError.style.display = "none";
          return;
        }
        
        // Auto-detect country code from input
        let detectedCountry = null;
        
        // Try to match country code from the beginning of the phone number
        // Sort by code length (longest first) to match longer codes first (e.g., 966 before 96)
        const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
        
        for (const country of sortedCodes) {
          if (phoneNumber.startsWith(country.code)) {
            detectedCountry = country;
            break;
          }
        }
        
        // If no country code detected, default to Saudi Arabia (966)
        if (!detectedCountry) {
          detectedCountry = countryCodes.find(c => c.code === "966") || countryCodes[0];
        }
        
        // Extract phone number without country code for validation
        let phoneWithoutCode = phoneNumber;
        if (phoneNumber.startsWith(detectedCountry.code)) {
          phoneWithoutCode = phoneNumber.substring(detectedCountry.code.length);
        }
        
        // Check length
        if (phoneWithoutCode.length < detectedCountry.minLength || phoneWithoutCode.length > detectedCountry.maxLength) {
          phoneInput.classList.remove("valid");
          phoneInput.classList.add("invalid");
          if (customPlaceholder) customPlaceholder.classList.add("invalid");
          phoneValidationError.textContent = "الرجاء إدخال رقم صحيح";
          phoneValidationError.style.display = "block";
          return;
        }
        
        // Check pattern
        if (detectedCountry.pattern && !detectedCountry.pattern.test(phoneWithoutCode)) {
          phoneInput.classList.remove("valid");
          phoneInput.classList.add("invalid");
          if (customPlaceholder) customPlaceholder.classList.add("invalid");
          phoneValidationError.textContent = "الرجاء إدخال رقم صحيح";
          phoneValidationError.style.display = "block";
          return;
        }
        
        // Valid
        phoneInput.classList.remove("invalid");
        phoneInput.classList.add("valid");
        if (customPlaceholder) customPlaceholder.classList.remove("invalid");
        phoneValidationError.style.display = "none";
      }

      // Initialize country code dropdown and phone validation
      // COUNTRY CODE DROPDOWN LOGIC COMMENTED OUT - keeping for safety
      // Validation still works with all countries - detects country code from input
      if (phoneInput) {
        // Dropdown initialization commented out
        /*
        if (phoneInput && countryCodeBtn && countryCodeDropdown && countryList) {
          // Populate country list
          function populateCountryList(filter = "") {
            if (!countryList) return;
            
            countryList.innerHTML = "";
            const filtered = countryCodes.filter(country => 
              country.name.toLowerCase().includes(filter.toLowerCase()) ||
              country.code.includes(filter) ||
              `+${country.code}`.includes(filter)
            );
            
            filtered.forEach(country => {
              const option = document.createElement("div");
              option.className = `country-option ${country.code === selectedCountry.code ? "selected" : ""}`;
              option.innerHTML = `
                <span class="country-option-code">+${country.code}</span>
              `;
              option.addEventListener("click", () => {
                selectCountry(country);
              });
              countryList.appendChild(option);
            });
          }

          // Select country
          function selectCountry(country) {
            selectedCountry = country;
            
            // Update dropdown button
            if (countryCodeText) countryCodeText.textContent = `+${country.code}`;
            
            // Update placeholder format
            if (numberFormat) numberFormat.textContent = country.format;
            
            // Clear input value when country changes
              phoneInput.value = "";
              
            // Close dropdown
            if (countryCodeDropdown) countryCodeDropdown.style.display = "none";
            if (countryCodeBtn) countryCodeBtn.classList.remove("open");
            
            // Re-populate list to update selected state
            populateCountryList("");
            
            // Clear validation
            phoneInput.classList.remove("valid", "invalid");
            if (customPlaceholder) customPlaceholder.classList.remove("invalid");
            if (phoneValidationError) phoneValidationError.style.display = "none";
            
            // Update placeholder visibility
            updatePlaceholderVisibility();
          }

          // Initialize with default country (Saudi Arabia)
          selectCountry(selectedCountry);
          populateCountryList();

          // Country code dropdown toggle
          if (countryCodeBtn) {
            countryCodeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              const isOpen = countryCodeDropdown.style.display === "block";
              countryCodeDropdown.style.display = isOpen ? "none" : "block";
              countryCodeBtn.classList.toggle("open", !isOpen);
            });
          }

          // Close dropdown when clicking outside
          document.addEventListener("click", (e) => {
            if (countryCodeDropdown && countryCodeBtn && 
                !countryCodeDropdown.contains(e.target) && 
                !countryCodeBtn.contains(e.target)) {
              countryCodeDropdown.style.display = "none";
              if (countryCodeBtn) countryCodeBtn.classList.remove("open");
            }
          });
        }
        */

        // Update placeholder visibility
        function updatePlaceholderVisibility() {
          if (customPlaceholder && phoneInput) {
            const value = phoneInput.value.trim();
            if (value.length > 0) {
              customPlaceholder.style.display = "none";
            } else {
              customPlaceholder.style.display = "flex";
              // Remove invalid class when placeholder is shown (empty input)
              customPlaceholder.classList.remove("invalid");
            }
          }
        }

        // Phone input validation (works with all countries - auto-detects country code)
        phoneInput.value = "";
        phoneInput.addEventListener("input", (e) => {
          // Only allow digits
          const value = e.target.value.replace(/\D/g, "");
          phoneInput.value = value;
          
          // Hide placeholder when user types
          updatePlaceholderVisibility();
          validatePhoneNumber();
        });

        phoneInput.addEventListener("blur", () => {
          validatePhoneNumber();
          // Show placeholder if input is empty
          updatePlaceholderVisibility();
        });

        phoneInput.addEventListener("focus", () => {
          // Hide placeholder when focused
          if (customPlaceholder) {
            customPlaceholder.style.display = "none";
          }
        });

        // Handle Enter key
        phoneInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && sendMessageBtn) {
            e.preventDefault();
            if (!phoneInput.classList.contains("invalid") && phoneInput.value.trim()) {
              sendMessageBtn.click();
            }
          }
        });

        // Add touch event listeners for mobile devices
        // Touch start - hide placeholder when user touches input field
        phoneInput.addEventListener("touchstart", (e) => {
          // Hide placeholder when touched (mobile)
          if (customPlaceholder) {
            customPlaceholder.style.display = "none";
          }
          // Focus the input to show keyboard
          phoneInput.focus();
        });

        // Touch end - validate when user finishes touching (mobile)
        phoneInput.addEventListener("touchend", (e) => {
          // Validate phone number after touch interaction
          validatePhoneNumber();
          // Show placeholder if input is empty
          updatePlaceholderVisibility();
        });
      }


      // ========================================
      // END COUNTRY CODE DROPDOWN AND PHONE VALIDATION FUNCTIONALITY
      // ========================================


      // ========================================
      // MAIN SEND BUTTON FUNCTIONALITY
      // ========================================
      // Handle main send button click - switches to message tab only if phone number is valid
      if (sendMessageBtn) {
        sendMessageBtn.addEventListener("click", () => {
          // Validate phone number before switching
          if (phoneInput) {
            const phoneNumber = phoneInput.value.trim().replace(/\D/g, "");
            
            // Check if phone number exists and is valid
            if (!phoneNumber) {
              // No phone number entered, show specific error message
              phoneInput.classList.remove("valid");
              phoneInput.classList.add("invalid");
              if (customPlaceholder) customPlaceholder.classList.add("invalid");
              if (phoneValidationError) {
                phoneValidationError.textContent = "الرجاء إدخال رقم الهاتف";
                phoneValidationError.style.display = "block";
              }
              return;
            }
            
            // Validate phone number using the same auto-detection logic
            // Auto-detect country code from input
            let detectedCountry = null;
            const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
            
            for (const country of sortedCodes) {
              if (phoneNumber.startsWith(country.code)) {
                detectedCountry = country;
                break;
              }
            }
            
            // If no country code detected, default to Saudi Arabia (966)
            if (!detectedCountry) {
              detectedCountry = countryCodes.find(c => c.code === "966") || countryCodes[0];
            }
            
            // Extract phone number without country code for validation
            let phoneWithoutCode = phoneNumber;
            if (phoneNumber.startsWith(detectedCountry.code)) {
              phoneWithoutCode = phoneNumber.substring(detectedCountry.code.length);
            }
            
            // Check if phone number is valid according to detected country
            const isValidLength = phoneWithoutCode.length >= detectedCountry.minLength && 
                                 phoneWithoutCode.length <= detectedCountry.maxLength;
            const isValidPattern = !detectedCountry.pattern || detectedCountry.pattern.test(phoneWithoutCode);
            const isNotInvalid = !phoneInput.classList.contains("invalid");
            
            if (isValidLength && isValidPattern && isNotInvalid) {
              // Phone number is valid, open chat detail directly (individual chat screen)
              // Clear phone input when leaving home screen
              if (phoneInput) {
                phoneInput.value = "";
                if (customPlaceholder) {
                  customPlaceholder.classList.remove("invalid");
                  customPlaceholder.style.display = "flex";
                }
                if (phoneValidationError) {
                  phoneValidationError.style.display = "none";
                }
                phoneInput.classList.remove("valid", "invalid");
              }
              
              // Hide home container
              if (mainHomeContainer) mainHomeContainer.style.display = "none";
              // Hide message list container
              if (mainMessageContainer) mainMessageContainer.style.display = "none";
              // Show message detail container (chat screen)
              if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "flex";
              // Hide rating container
              if (mainRatingContainer) mainRatingContainer.style.display = "none";
              // Add detail-active class on footer (tabs should be hidden in detail view)
              if (fugahFooter) fugahFooter.classList.add("detail-active");
              
              // Update footer tab images without switching to message list
              footerTabItems.forEach(item => {
                const tabType = item.getAttribute("data-tab");
                const img = item.querySelector("img");
                const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
                const themeName = currentTheme ? currentTheme[1] : 'default';
                
                if (tabType === "message") {
                  item.classList.add("active");
                  if (themeName === 'black') {
                    img.src = getAssetPath("active-message-footer-black.png");
                  } else {
                    img.src = getAssetPath("active-message-footer.png");
                  }
                  img.alt = "message active";
                } else if (tabType === "home") {
                  item.classList.remove("active");
                  if (themeName === 'black') {
                    img.src = getAssetPath("new-img.png");
                  } else {
                    img.src = getAssetPath("inactive-home-footer.png.png");
                  }
                  img.alt = "home inactive";
                }
              });
              
              // Scroll to bottom of messages
              if (messageDetailMessages) {
                setTimeout(() => {
                  messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
                }, 100);
              }
            } else {
              // Phone number is invalid format, trigger validation to show error
              if (typeof validatePhoneNumber === 'function') {
                validatePhoneNumber();
              } else {
                // If validatePhoneNumber is not accessible, manually validate
                phoneInput.classList.remove("valid");
                phoneInput.classList.add("invalid");
                if (customPlaceholder) customPlaceholder.classList.add("invalid");
                if (phoneValidationError) {
                  phoneValidationError.textContent = "الرجاء إدخال رقم صحيح";
                  phoneValidationError.style.display = "block";
                }
              }
            }
          } else {
            // No phone input, open chat detail directly (fallback)
            // Hide home container
            if (mainHomeContainer) mainHomeContainer.style.display = "none";
            // Hide message list container
            if (mainMessageContainer) mainMessageContainer.style.display = "none";
            // Show message detail container (chat screen)
            if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "flex";
            // Hide rating container
            if (mainRatingContainer) mainRatingContainer.style.display = "none";
            // Add detail-active class on footer (tabs should be hidden in detail view)
            if (fugahFooter) fugahFooter.classList.add("detail-active");
            
            // Update footer tab images without switching to message list
            footerTabItems.forEach(item => {
              const tabType = item.getAttribute("data-tab");
              const img = item.querySelector("img");
              const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
              const themeName = currentTheme ? currentTheme[1] : 'default';
              
              if (tabType === "message") {
                item.classList.add("active");
                if (themeName === 'black') {
                  img.src = getAssetPath("active-message-footer-black.png");
                } else {
                  img.src = getAssetPath("active-message-footer.png");
                }
                img.alt = "message active";
              } else if (tabType === "home") {
                item.classList.remove("active");
                if (themeName === 'black') {
                  img.src = getAssetPath("new-img.png");
                } else {
                  img.src = getAssetPath("inactive-home-footer.png.png");
                }
                img.alt = "home inactive";
              }
            });
            
            // Scroll to bottom of messages
            if (messageDetailMessages) {
              setTimeout(() => {
                messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
              }, 100);
            }
          }
        });
        
        // Add touch event listener for mobile devices
        sendMessageBtn.addEventListener("touchstart", (e) => {
          e.preventDefault(); // Prevent double-firing with click event
          // Validate phone number before switching
          if (phoneInput) {
            const phoneNumber = phoneInput.value.trim().replace(/\D/g, "");
            
            // Check if phone number exists and is valid
            if (!phoneNumber) {
              // No phone number entered, show specific error message
              phoneInput.classList.remove("valid");
              phoneInput.classList.add("invalid");
              if (customPlaceholder) customPlaceholder.classList.add("invalid");
              if (phoneValidationError) {
                phoneValidationError.textContent = "الرجاء إدخال رقم الهاتف";
                phoneValidationError.style.display = "block";
              }
              return;
            }
            
            // Validate phone number using the same auto-detection logic
            // Auto-detect country code from input
            let detectedCountry = null;
            const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
            
            for (const country of sortedCodes) {
              if (phoneNumber.startsWith(country.code)) {
                detectedCountry = country;
                break;
              }
            }
            
            // If no country code detected, default to Saudi Arabia (966)
            if (!detectedCountry) {
              detectedCountry = countryCodes.find(c => c.code === "966") || countryCodes[0];
            }
            
            // Extract phone number without country code for validation
            let phoneWithoutCode = phoneNumber;
            if (phoneNumber.startsWith(detectedCountry.code)) {
              phoneWithoutCode = phoneNumber.substring(detectedCountry.code.length);
            }
            
            // Check if phone number is valid according to detected country
            const isValidLength = phoneWithoutCode.length >= detectedCountry.minLength && 
                                 phoneWithoutCode.length <= detectedCountry.maxLength;
            const isValidPattern = !detectedCountry.pattern || detectedCountry.pattern.test(phoneWithoutCode);
            const isNotInvalid = !phoneInput.classList.contains("invalid");
            
            if (isValidLength && isValidPattern && isNotInvalid) {
              // Phone number is valid, open chat detail directly (individual chat screen)
              // Clear phone input when leaving home screen
              if (phoneInput) {
                phoneInput.value = "";
                if (customPlaceholder) {
                  customPlaceholder.classList.remove("invalid");
                  customPlaceholder.style.display = "flex";
                }
                if (phoneValidationError) {
                  phoneValidationError.style.display = "none";
                }
                phoneInput.classList.remove("valid", "invalid");
              }
              
              // Hide home container
              if (mainHomeContainer) mainHomeContainer.style.display = "none";
              // Hide message list container
              if (mainMessageContainer) mainMessageContainer.style.display = "none";
              // Show message detail container (chat screen)
              if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "flex";
              // Hide rating container
              if (mainRatingContainer) mainRatingContainer.style.display = "none";
              // Add detail-active class on footer (tabs should be hidden in detail view)
              if (fugahFooter) fugahFooter.classList.add("detail-active");
              
              // Update footer tab images without switching to message list
              footerTabItems.forEach(item => {
                const tabType = item.getAttribute("data-tab");
                const img = item.querySelector("img");
                const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
                const themeName = currentTheme ? currentTheme[1] : 'default';
                
                if (tabType === "message") {
                  item.classList.add("active");
                  if (themeName === 'black') {
                    img.src = getAssetPath("active-message-footer-black.png");
                  } else {
                    img.src = getAssetPath("active-message-footer.png");
                  }
                  img.alt = "message active";
                } else if (tabType === "home") {
                  item.classList.remove("active");
                  if (themeName === 'black') {
                    img.src = getAssetPath("new-img.png");
                  } else {
                    img.src = getAssetPath("inactive-home-footer.png.png");
                  }
                  img.alt = "home inactive";
                }
              });
              
              // Scroll to bottom of messages
              if (messageDetailMessages) {
                setTimeout(() => {
                  messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
                }, 100);
              }
            } else {
              // Phone number is invalid format, trigger validation to show error
              if (typeof validatePhoneNumber === 'function') {
                validatePhoneNumber();
              } else {
                // If validatePhoneNumber is not accessible, manually validate
                phoneInput.classList.remove("valid");
                phoneInput.classList.add("invalid");
                if (customPlaceholder) customPlaceholder.classList.add("invalid");
                if (phoneValidationError) {
                  phoneValidationError.textContent = "الرجاء إدخال رقم صحيح";
                  phoneValidationError.style.display = "block";
                }
              }
            }
          } else {
            // No phone input, open chat detail directly (fallback)
            // Hide home container
            if (mainHomeContainer) mainHomeContainer.style.display = "none";
            // Hide message list container
            if (mainMessageContainer) mainMessageContainer.style.display = "none";
            // Show message detail container (chat screen)
            if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "flex";
            // Hide rating container
            if (mainRatingContainer) mainRatingContainer.style.display = "none";
            // Add detail-active class on footer (tabs should be hidden in detail view)
            if (fugahFooter) fugahFooter.classList.add("detail-active");
            
            // Update footer tab images without switching to message list
            footerTabItems.forEach(item => {
              const tabType = item.getAttribute("data-tab");
              const img = item.querySelector("img");
              const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
              const themeName = currentTheme ? currentTheme[1] : 'default';
              
              if (tabType === "message") {
                item.classList.add("active");
                if (themeName === 'black') {
                  img.src = getAssetPath("active-message-footer-black.png");
                } else {
                  img.src = getAssetPath("active-message-footer.png");
                }
                img.alt = "message active";
              } else if (tabType === "home") {
                item.classList.remove("active");
                if (themeName === 'black') {
                  img.src = getAssetPath("new-img.png");
                } else {
                  img.src = getAssetPath("inactive-home-footer.png.png");
                }
                img.alt = "home inactive";
              }
            });
            
            // Scroll to bottom of messages
            if (messageDetailMessages) {
              setTimeout(() => {
                messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
              }, 100);
            }
          }
        });
      }

      // Handle phone input enter key - already handled in country code section above


      // ========================================
      // END MAIN SEND BUTTON FUNCTIONALITY
      // ========================================


      // ========================================
      // TAB SWITCHING FUNCTIONALITY
      // ========================================
      // Handle switching between home and message tabs with proper image updates
      function switchTab(tabName) {
        // Clear phone input when leaving home screen
        if (tabName !== "home" && phoneInput) {
          phoneInput.value = "";
          if (customPlaceholder) {
            customPlaceholder.classList.remove("invalid");
            customPlaceholder.style.display = "block";
            customPlaceholder.style.opacity = "1";
          }
          if (phoneValidationError) {
            phoneValidationError.style.display = "none";
          }
          phoneInput.classList.remove("valid", "invalid");
        }
        
        // Remove active class from all tabs
        footerTabItems.forEach(item => {
          item.classList.remove("active");
        });

        // Get current theme to use correct images
        const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
        const themeName = currentTheme ? currentTheme[1] : 'default';

        // Find and activate the clicked tab
        footerTabItems.forEach(item => {
          const tabType = item.getAttribute("data-tab");
          const img = item.querySelector("img");
          
          if (tabType === tabName) {
            // Activate this tab
            item.classList.add("active");
            
            // Update image to active variant based on theme
            if (tabName === "message") {
              if (themeName === 'black') {
                img.src = getAssetPath("active-message-footer-black.png");
              } else {
              img.src = getAssetPath("active-message-footer.png");
              }
              img.alt = "message active";
            } else if (tabName === "home") {
              if (themeName === 'black') {
                img.src = getAssetPath("active-home-footer-black.png");
              } else {
              img.src = getAssetPath("active-home-footer.png");
              }
              img.alt = "home active";
            }
          } else {
            // Deactivate other tabs based on theme
            if (tabType === "message") {
              if (themeName === 'black') {
                img.src = getAssetPath("inactive-message-footer-black.png.png");
              } else {
              img.src = getAssetPath("inactive-message-footer.png");
              }
              img.alt = "message inactive";
              console.log(`Setting inactive message image for theme ${themeName}:`, img.src);
            } else if (tabType === "home") {
              if (themeName === 'black') {
                img.src = getAssetPath("new-img.png");
              } else {
                img.src = getAssetPath("inactive-home-footer.png.png");
              }
              img.alt = "home inactive";
              console.log(`Setting inactive home image for theme ${themeName}:`, img.src);
            }
          }
        });

        // Show/hide containers based on active tab
        if (tabName === "home") {
          // Clear phone input when returning to home screen
          if (phoneInput) {
            phoneInput.value = "";
            if (customPlaceholder) {
              customPlaceholder.classList.remove("invalid");
              customPlaceholder.style.display = "flex";
            }
            if (phoneValidationError) {
              phoneValidationError.style.display = "none";
            }
            phoneInput.classList.remove("valid", "invalid");
          }
          
          if (mainHomeContainer) mainHomeContainer.style.display = "flex";
          if (mainMessageContainer) mainMessageContainer.style.display = "none";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
          if (mainRatingContainer) mainRatingContainer.style.display = "none";
          // Remove detail-active class from footer
          if (fugahFooter) fugahFooter.classList.remove("detail-active");
        } else if (tabName === "message") {
          if (mainHomeContainer) mainHomeContainer.style.display = "none";
          if (mainMessageContainer) mainMessageContainer.style.display = "block";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
          if (mainRatingContainer) mainRatingContainer.style.display = "none";
          // Remove detail-active class from footer (tabs should be visible in message list)
          if (fugahFooter) fugahFooter.classList.remove("detail-active");
          // Reset to message list when switching tabs
          goBackToMessageList();
        }
      }


      // ========================================
      // END TAB SWITCHING FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE DETAIL NAVIGATION FUNCTIONALITY
      // ========================================
      // Handle opening and closing of message detail view
      function openMessageDetail(messageId) {
        // Clear phone input when opening message detail
        if (phoneInput) {
          phoneInput.value = "";
          if (customPlaceholder) {
            customPlaceholder.classList.remove("invalid");
            customPlaceholder.style.display = "block";
            customPlaceholder.style.opacity = "1";
          }
          if (phoneValidationError) {
            phoneValidationError.style.display = "none";
          }
          phoneInput.classList.remove("valid", "invalid");
        }
        
        // Hide message list container
        if (mainMessageContainer) mainMessageContainer.style.display = "none";
        // Show message detail container
        if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "flex";
        // Add detail-active class on footer (tabs should be hidden in detail view)
        if (fugahFooter) fugahFooter.classList.add("detail-active");
        
        // Start timestamp updates for the last message
        startTimestampUpdates();
        
        // Only show timestamp if there are existing messages and the last one is from bot
        const lastMessage = messageDetailMessages?.querySelector(".chat-message:last-child");
        if (lastMessage && lastMessage.classList.contains("chat-message-bot")) {
          updateLastMessageTimestamp();
        }
        
        // Scroll to bottom of messages
        if (messageDetailMessages) {
          setTimeout(() => {
            messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
          }, 100);
        }
      }


      // ========================================
      // END MESSAGE DETAIL NAVIGATION FUNCTIONALITY
      // ========================================


      // ========================================
      // LOADING INDICATOR FUNCTIONALITY
      // ========================================
      // Show and remove loading indicators for bot responses
      function showLoadingIndicator() {
        if (!messageDetailMessages) return null;
        
        // Remove any existing loading indicator
        const existingLoading = messageDetailMessages.querySelector(".chat-message-loading");
        if (existingLoading) {
          existingLoading.remove();
        }
        
        // Remove timestamp when bot starts typing
        const existingTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
        if (existingTimestamp) {
          existingTimestamp.remove();
        }
        
        // Disable input field while bot is responding
        if (messageDetailInput) {
          messageDetailInput.disabled = true;
          messageDetailInput.setAttribute('readonly', 'readonly');
        }
        
        // Disable send button while bot is responding
        if (messageDetailSendBtn) {
          messageDetailSendBtn.classList.add("inactive");
          messageDetailSendBtn.disabled = true;
        }
        
        const messageDiv = document.createElement("div");
        messageDiv.className = "chat-message chat-message-bot";
        
        const contentDiv = document.createElement("div");
        contentDiv.className = "chat-message-content";
        
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "chat-message-loading";
        loadingDiv.innerHTML = `
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        `;
        
        contentDiv.appendChild(loadingDiv);
        messageDiv.appendChild(contentDiv);
        messageDetailMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        setTimeout(() => {
          messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
        }, 50);
        
        return messageDiv;
      }

      function removeLoadingIndicator() {
        if (!messageDetailMessages) return;
        const loadingIndicator = messageDetailMessages.querySelector(".chat-message-loading");
        if (loadingIndicator) {
          loadingIndicator.closest(".chat-message").remove();
        }
      }


      // ========================================
      // END LOADING INDICATOR FUNCTIONALITY
      // ========================================


      // ========================================
      // DATE TIME FORMATTING FUNCTIONALITY
      // ========================================
      // Format current date and time in 12-hour format with AM/PM
      function formatDateTime() {
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        
        // Convert to 12-hour format (NO SECONDS - only hours and minutes)
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        // Get minutes only - explicitly NOT using getSeconds()
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        // Return format: "16 Jan 2026, 2:57 PM" (NO SECONDS included)
        return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
      }


      // ========================================
      // END DATE TIME FORMATTING FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE SOUND FUNCTIONALITY
      // ========================================
      // Play sound notification when messages are sent or received
      function playMessageSound() {
        try {
          const audio = new Audio(getAssetPath("message.mp3"));
          audio.volume = 0.7; // Set volume to 70%
          audio.play().catch(error => {
            console.log("Could not play message sound:", error);
          });
        } catch (error) {
          console.log("Error creating audio:", error);
        }
      }


      // ========================================
      // END MESSAGE SOUND FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE CREATION FUNCTIONALITY
      // ========================================
      // Add messages to detail chat without individual timestamps
      function addDetailMessage(text, isUser = true, updateTimestamp = false) {
        if (!messageDetailMessages) return;
        
        // Remove loading indicator if it exists
        removeLoadingIndicator();
        
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${isUser ? "chat-message-user" : "chat-message-bot"}`;
        
        const contentDiv = document.createElement("div");
        contentDiv.className = "chat-message-content";
        
        const textP = document.createElement("p");
        textP.textContent = text;
        contentDiv.appendChild(textP);
        
        messageDiv.appendChild(contentDiv);
        messageDetailMessages.appendChild(messageDiv);
        
        // Handle timestamp based on message type
        if (updateTimestamp) {
          // Bot message: Remove existing timestamp first, then add new one
          const existingTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
          if (existingTimestamp) {
            existingTimestamp.remove();
          }
          updateLastMessageTimestamp();
          
          // Re-enable input field when bot responds
          if (messageDetailInput) {
            messageDetailInput.disabled = false;
            messageDetailInput.removeAttribute('readonly');
          }
          
          // Re-enable send button when bot responds
          if (messageDetailSendBtn) {
            messageDetailSendBtn.disabled = false;
            toggleMessageDetailSendButtonState();
          }
        } else if (isUser) {
          // User message: Remove timestamp immediately (timestamp only shows for bot messages)
          const existingTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
          if (existingTimestamp) {
            existingTimestamp.remove();
          }
        }
        
        // Play message sound notification
        playMessageSound();
        
        // Scroll to bottom
        setTimeout(() => {
          messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
        }, 50);
      }


      // Function to update the last message timestamp
      function updateLastMessageTimestamp() {
        if (!messageDetailMessages) return;
        
        // Remove existing timestamp
        const existingTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
        if (existingTimestamp) {
          existingTimestamp.remove();
        }
        
        // Timestamp div creation disabled - keeping logic for safety
        // Add new timestamp for the last message
        // const timestampDiv = document.createElement("div");
        // timestampDiv.className = "last-message-timestamp chat-message-datetime";
        // timestampDiv.textContent = formatDateTime();
        // messageDetailMessages.appendChild(timestampDiv);
        
        // Store current minute and hour (no seconds) for 5-minute comparison
        const now = new Date();
        lastTimestampMinute = now.getMinutes();
        lastTimestampHour = now.getHours();
      }

      // Variable to store the timestamp update interval
      let timestampUpdateInterval = null;
      // Store the minute value when timestamp was last updated (only minutes, no seconds)
      let lastTimestampMinute = null;
      let lastTimestampHour = null;

      // Function to start the 5-minute timestamp update
      function startTimestampUpdates() {
        // Clear any existing interval
        if (timestampUpdateInterval) {
          clearInterval(timestampUpdateInterval);
        }
        
        // Helper function to check and update timestamp
        function checkAndUpdateTimestamp() {
          if (!messageDetailMessages) return;
          
          // Get all actual chat messages (excluding timestamp and loading indicator)
          const allMessages = Array.from(messageDetailMessages.children).filter(child => {
            return child.classList.contains("chat-message") && 
                   !child.classList.contains("last-message-timestamp") &&
                   !child.classList.contains("chat-message-loading");
          });
          
          const lastMessage = allMessages.length > 0 ? allMessages[allMessages.length - 1] : null;
          const isLastMessageFromBot = lastMessage && lastMessage.classList.contains("chat-message-bot");
          
          if (isLastMessageFromBot) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Check if 5 minutes have passed (comparing only minutes and hours, ignoring seconds)
            let shouldUpdate = false;
            
            if (lastTimestampMinute === null || lastTimestampHour === null) {
              // First time, create timestamp
              shouldUpdate = true;
            } else {
              // Calculate minutes difference (handling hour rollover)
              let minutesDiff = 0;
              if (currentHour === lastTimestampHour) {
                // Same hour, simple subtraction
                minutesDiff = currentMinute - lastTimestampMinute;
              } else if (currentHour === lastTimestampHour + 1 || (currentHour === 0 && lastTimestampHour === 23)) {
                // Next hour (or hour rollover from 23 to 0)
                minutesDiff = (60 - lastTimestampMinute) + currentMinute;
              } else {
                // More than 1 hour difference, definitely update
                shouldUpdate = true;
              }
              
              // Update if 5 or more minutes have passed
              if (minutesDiff >= 5) {
                shouldUpdate = true;
              }
            }
            
            if (shouldUpdate) {
              // Update or create timestamp
              const lastTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
              if (lastTimestamp) {
                lastTimestamp.textContent = formatDateTime();
              } else {
                // Create timestamp if it doesn't exist
                updateLastMessageTimestamp();
              }
              // Store current minute and hour (no seconds)
              lastTimestampMinute = currentMinute;
              lastTimestampHour = currentHour;
            }
          } else {
            // Remove timestamp if last message is not from bot
            const lastTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
            if (lastTimestamp) {
              lastTimestamp.remove();
            }
            lastTimestampMinute = null;
            lastTimestampHour = null;
          }
        }
        
        // Check every second for exact 5-minute updates (only compares minutes, ignores seconds)
        // This ensures the timestamp updates exactly when the minute changes to be 5 minutes later
        timestampUpdateInterval = setInterval(checkAndUpdateTimestamp, 1000); // 1 second
        
        // Also check immediately to ensure timestamp is shown if needed
        checkAndUpdateTimestamp();
      }

      // Function to stop timestamp updates
      function stopTimestampUpdates() {
        if (timestampUpdateInterval) {
          clearInterval(timestampUpdateInterval);
          timestampUpdateInterval = null;
        }
      }


      // ========================================
      // END MESSAGE CREATION FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE SENDING FUNCTIONALITY
      // ========================================
      // Handle sending messages in detail chat with validation and bot responses
      function sendDetailMessage() {
        if (!messageDetailInput || !messageDetailSendBtn) return;
        
        // Don't send if button is inactive
        if (messageDetailSendBtn.classList.contains("inactive")) return;
        
        const message = messageDetailInput.value.trim();
        if (!message) return;
        
        // Add user message (without timestamp update)
        addDetailMessage(message, true, false);
        
        // Clear input
        messageDetailInput.value = "";
        
        // Reset textarea height
        autoResizeTextarea();
        
        // Update send button state
        toggleMessageDetailSendButtonState();
        
        // Show loading indicator
        showLoadingIndicator();
        
        // Simulate bot response (after delay)
        setTimeout(() => {
          // Add bot message with timestamp update
          addDetailMessage("شكراً لك! سأقوم بالرد عليك قريباً.", false, true);
        }, 1500);
      }


      // ========================================
      // END MESSAGE SENDING FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE DETAIL EVENT LISTENERS FUNCTIONALITY
      // ========================================
      // Add event listeners for message detail input and send button
      if (messageDetailSendBtn) {
        messageDetailSendBtn.addEventListener("click", sendDetailMessage);
      }

      if (messageDetailInput) {
        messageDetailInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            if (e.shiftKey) {
              // Shift+Enter: Allow new line (default behavior)
              return;
            } else {
              // Enter: Send message
              e.preventDefault();
            sendDetailMessage();
            }
          }
          
          // Allow all arrow keys and navigation keys for proper textarea navigation
          if (e.key === "ArrowUp" || e.key === "ArrowDown" || 
              e.key === "ArrowLeft" || e.key === "ArrowRight" ||
              e.key === "Home" || e.key === "End" || 
              e.key === "PageUp" || e.key === "PageDown") {
            // Allow default behavior for navigation keys
            return;
          }
        });

        // Auto-resize textarea function
        function autoResizeTextarea() {
          if (!messageDetailInput) return;
          
          // Store current cursor position
          const cursorPos = messageDetailInput.selectionStart;
          const cursorEnd = messageDetailInput.selectionEnd;
          
          // Reset height to auto to get the correct scrollHeight
          messageDetailInput.style.height = 'auto';
          
          // Set height based on content, with min and max limits
          const newHeight = Math.min(Math.max(messageDetailInput.scrollHeight, 20), 100);
          messageDetailInput.style.height = newHeight + 'px';
          
          // Restore cursor position after resize
          messageDetailInput.setSelectionRange(cursorPos, cursorEnd);
        }

        // Toggle send button state based on input content and auto-resize
        messageDetailInput.addEventListener("input", () => {
          toggleMessageDetailSendButtonState();
          autoResizeTextarea();
        });


        // Initialize textarea size
        if (messageDetailInput) {
          autoResizeTextarea();
        }
      }


      // ========================================
      // END MESSAGE DETAIL EVENT LISTENERS FUNCTIONALITY
      // ========================================


      // ========================================
      // SEND BUTTON STATE MANAGEMENT FUNCTIONALITY
      // ========================================
      // Toggle message detail send button active/inactive state based on input content
      function toggleMessageDetailSendButtonState() {
        if (!messageDetailInput || !messageDetailSendBtn) return;
        
        const hasText = messageDetailInput.value.trim().length > 0;
        
        if (hasText) {
          messageDetailSendBtn.classList.remove("inactive");
        } else {
          messageDetailSendBtn.classList.add("inactive");
        }
      }

      // Initialize message detail send button as inactive
      if (messageDetailSendBtn) {
        messageDetailSendBtn.classList.add("inactive");
      }


      // ========================================
      // END SEND BUTTON STATE MANAGEMENT FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE LIST NAVIGATION FUNCTIONALITY
      // ========================================
      // Handle navigation back to message list from detail view
      function goBackToMessageList() {
        if (mainMessageContainer) mainMessageContainer.style.display = "block";
        if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
        if (mainRatingContainer) mainRatingContainer.style.display = "none";
        // Remove detail-active class from footer (tabs should be visible in message list)
        if (fugahFooter) fugahFooter.classList.remove("detail-active");
        
        // Reset emoji selection when leaving rating screen
        resetRatingEmojis();
        
        // Stop timestamp updates when leaving message detail view
        stopTimestampUpdates();
        
        // Clear input when going back
        if (messageDetailInput) {
          messageDetailInput.value = "";
          toggleMessageDetailSendButtonState();
        }
      }

      // Helper function to show rating screen (used by message detail close button and submit ticket)
      function showRatingScreen() {
        // Copy messages from message detail to rating screen
        const ratingMessages = shadow.querySelector("#rating-messages");
        if (messageDetailMessages && ratingMessages) {
          // Clone all messages from message detail
          ratingMessages.innerHTML = messageDetailMessages.innerHTML;
          
          // Always append mobile rating container after copying messages
          // (since innerHTML overwrites everything, we need to add it back)
          const mobileRatingContainer = document.createElement("div");
          mobileRatingContainer.className = "chat-message chat-message-rating";
          
          // Get asset paths
          const emoji1Path = getAssetPath('emoji-1.png');
          const emoji2Path = getAssetPath('emoji-2.png');
          const emoji3Path = getAssetPath('emoji-3.png');
          const emoji4Path = getAssetPath('emoji-4.png');
          const emoji5Path = getAssetPath('emoji-5.png');
          
          mobileRatingContainer.innerHTML = `
            <div class="chat-message-content rating-message-content">
              <div class="rating-title">
                <p>قيم محادثتك</p>
              </div>
              <div class="rating-emoji-container">
                <img src="${emoji1Path}" alt="Rating 1" class="rating-emoji" data-rating="1" />
                <img src="${emoji2Path}" alt="Rating 2" class="rating-emoji" data-rating="2" />
                <img src="${emoji3Path}" alt="Rating 3" class="rating-emoji" data-rating="3" />
                <img src="${emoji4Path}" alt="Rating 4" class="rating-emoji" data-rating="4" />
                <img src="${emoji5Path}" alt="Rating 5" class="rating-emoji" data-rating="5" />
              </div>
            </div>
          `;
          ratingMessages.appendChild(mobileRatingContainer);
          
          // Scroll to bottom of rating messages
          setTimeout(() => {
            ratingMessages.scrollTop = ratingMessages.scrollHeight;
          }, 100);
        }
        
        // Hide message detail container
        if (mainMessageDetailContainer) {
          mainMessageDetailContainer.style.display = "none";
        }
        
        // Show rating container
        if (mainRatingContainer) {
          mainRatingContainer.style.display = "flex";
        }
        
        // Add detail-active class on footer (tabs should be hidden in rating view)
        if (fugahFooter) {
          fugahFooter.classList.add("detail-active");
        }
        
        // Setup emoji hover and click functionality
        setupRatingEmojis();
      }

      // Add click handler to message detail back button (X button)
      // Flow: Chat page → Confirm → Rating screen
      if (messageDetailBackBtn) {
        messageDetailBackBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          
          // Show custom confirmation message
          showCustomConfirmation("هل أنت متأكد من إغلاق الدردشة؟", () => {
            // Show rating screen after confirmation
            showRatingScreen();
          });
        });
        
        // Add touch event listener for mobile devices (preventDefault stops synthetic click closing modal on Android)
        messageDetailBackBtn.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          e.preventDefault();
          showCustomConfirmation("هل أنت متأكد من إغلاق الدردشة؟", () => {
            showRatingScreen();
          });
        }, { passive: false });
      }

      // Add click handler to rating screen back button (X button)
      // Flow: X again → Close page (no confirmation)
      if (ratingBackBtn) {
        ratingBackBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          
          // Reset to home screen before closing
          if (mainHomeContainer) mainHomeContainer.style.display = "flex";
          if (mainMessageContainer) mainMessageContainer.style.display = "none";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
          if (mainRatingContainer) mainRatingContainer.style.display = "none";
          if (fugahFooter) fugahFooter.classList.remove("detail-active");
          
          // Reset footer tabs to home
          switchTab("home");
          
          // Close chat
          toggleChat();
        });
        
        // Add touch event listener for mobile devices (preventDefault avoids double-fire / phantom close on Android)
        ratingBackBtn.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          e.preventDefault();
          // Reset to home screen before closing
          if (mainHomeContainer) mainHomeContainer.style.display = "flex";
          if (mainMessageContainer) mainMessageContainer.style.display = "none";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
          if (mainRatingContainer) mainRatingContainer.style.display = "none";
          if (fugahFooter) fugahFooter.classList.remove("detail-active");
          
          // Reset footer tabs to home
          switchTab("home");
          
          // Close chat
          toggleChat();
        }, { passive: false });
      }

      // Function to reset emoji selection
      function resetRatingEmojis() {
        const ratingEmojis = shadow.querySelectorAll(".rating-emoji");
        ratingEmojis.forEach((emoji) => {
          emoji.classList.remove("selected");
          if (emoji.dataset.originalSrc) {
            emoji.src = emoji.dataset.originalSrc;
          }
        });
      }

      // Function to setup emoji hover and click functionality
      function setupRatingEmojis() {
        // Reset any previous selection first
        resetRatingEmojis();
        
        const ratingEmojis = shadow.querySelectorAll(".rating-emoji");
        let selectedRating = null;
        
        // Helper function to check if any emoji is currently selected
        function hasSelectedEmoji() {
          return Array.from(ratingEmojis).some(e => e.classList.contains("selected"));
        }
        
        // Helper function to get the currently selected emoji
        function getSelectedEmoji() {
          return Array.from(ratingEmojis).find(e => e.classList.contains("selected"));
        }
        
        ratingEmojis.forEach((emoji) => {
          const rating = emoji.getAttribute("data-rating");
          
          // Get current src and create active src path
          const currentSrc = emoji.src;
          // Extract the path and replace emoji-X with active-emoji-X
          const originalSrc = currentSrc.includes("emoji-") ? currentSrc : getAssetPath(`emoji-${rating}.png`);
          const activeSrc = originalSrc.replace(/emoji-(\d+)\.png/, "active-emoji-$1.png");
          
          // Store original and active sources
          emoji.dataset.originalSrc = originalSrc;
          emoji.dataset.activeSrc = activeSrc;
          
          // Ensure initial src is set correctly
          if (!emoji.src.includes("emoji-")) {
            emoji.src = originalSrc;
          }
          
          // Hover event - always show active emoji on hover
          emoji.addEventListener("mouseenter", () => {
            // Always show active version on hover, regardless of selection
            emoji.src = activeSrc;
          });
          
          // Mouse leave event - revert to original if not selected, keep active if selected
          emoji.addEventListener("mouseleave", () => {
            // If this emoji is selected, keep it active
            if (emoji.classList.contains("selected")) {
              emoji.src = activeSrc;
            } else {
              // If not selected, revert to original
              emoji.src = originalSrc;
            }
          });
          
          // Click event - select emoji and keep it active (only one at a time)
          emoji.addEventListener("click", () => {
            // Remove selected class from all emojis and revert to original
            ratingEmojis.forEach((e) => {
              e.classList.remove("selected");
              e.src = e.dataset.originalSrc;
            });
            
            // Add selected class to clicked emoji and set to active
            emoji.classList.add("selected");
            emoji.src = activeSrc;
            selectedRating = rating;
          });
        });
      }


      // ========================================
      // END MESSAGE LIST NAVIGATION FUNCTIONALITY
      // ========================================


      // ========================================
      // DROPDOWN MENU FUNCTIONALITY
      // ========================================
      // Guard so "close when clicking outside" doesn't run in same tap on mobile
      let lastDropdownOpenAt = 0;
      const DROPDOWN_OPEN_GUARD_MS = 400;

      function toggleMessageDetailDropdown() {
        if (!fugahMessageDetailDropdown) return;
        const isVisible = fugahMessageDetailDropdown.style.display === "block";
        fugahMessageDetailDropdown.style.display = isVisible ? "none" : "block";
        if (!isVisible) lastDropdownOpenAt = Date.now();
      }
      function toggleRatingDropdown() {
        if (!fugahRatingDropdown) return;
        const isVisible = fugahRatingDropdown.style.display === "block";
        fugahRatingDropdown.style.display = isVisible ? "none" : "block";
        if (!isVisible) lastDropdownOpenAt = Date.now();
      }

      // Handle message detail dropdown menu toggle (click + touch for mobile)
      if (fugahMessageDetailDropdownIcon) {
        fugahMessageDetailDropdownIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleMessageDetailDropdown();
        });
        fugahMessageDetailDropdownIcon.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          e.preventDefault(); // prevent synthetic click that can trigger outside-close on same tap
          toggleMessageDetailDropdown();
        }, { passive: false });
      }

      // Handle rating dropdown menu toggle (click + touch for mobile)
      if (fugahRatingDropdownIcon) {
        fugahRatingDropdownIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleRatingDropdown();
        });
        fugahRatingDropdownIcon.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          e.preventDefault(); // prevent synthetic click that can trigger outside-close on same tap
          toggleRatingDropdown();
        }, { passive: false });
      }

      // Close dropdown when clicking outside (ignore within guard window to fix mobile “open then disappear”)
      shadow.addEventListener("click", (e) => {
        if (Date.now() - lastDropdownOpenAt < DROPDOWN_OPEN_GUARD_MS) return;

        if (fugahMessageDetailDropdown && fugahMessageDetailDropdownIcon) {
          if (!fugahMessageDetailDropdown.contains(e.target) && !fugahMessageDetailDropdownIcon.contains(e.target)) {
            fugahMessageDetailDropdown.style.display = "none";
          }
        }
        if (fugahRatingDropdown && fugahRatingDropdownIcon) {
          if (!fugahRatingDropdown.contains(e.target) && !fugahRatingDropdownIcon.contains(e.target)) {
            fugahRatingDropdown.style.display = "none";
          }
        }
      });


      // ========================================
      // END DROPDOWN MENU FUNCTIONALITY
      // ========================================


      // ========================================
      // DROPDOWN MENU ACTIONS FUNCTIONALITY
      // ========================================
      // Guard so overlay doesn’t close confirmation from same tap on Android
      let lastConfirmationOpenAt = 0;
      const CONFIRMATION_OPEN_GUARD_MS = 450;

      // Custom confirmation dialog function
      let currentConfirmCallback = null;
      function showCustomConfirmation(message, onConfirm) {
        if (customConfirmationDialog && confirmationDialogMessage && confirmationBtnCancel && confirmationBtnConfirm) {
          confirmationDialogMessage.textContent = message;
          customConfirmationDialog.style.display = "flex";
          currentConfirmCallback = onConfirm;
          lastConfirmationOpenAt = Date.now();
        } else {
          // Fallback to browser confirm
          if (confirm(message)) {
            if (onConfirm) onConfirm();
          }
        }
      }

      function closeConfirmationIfAllowed() {
        if (Date.now() - lastConfirmationOpenAt < CONFIRMATION_OPEN_GUARD_MS) return;
        if (customConfirmationDialog) {
          customConfirmationDialog.style.display = "none";
        }
        currentConfirmCallback = null;
      }
      
      // Handle confirmation dialog buttons
      if (confirmationBtnCancel) {
        confirmationBtnCancel.addEventListener("click", () => {
          if (customConfirmationDialog) {
            customConfirmationDialog.style.display = "none";
          }
          currentConfirmCallback = null;
        });
      }
      
      if (confirmationBtnConfirm) {
        confirmationBtnConfirm.addEventListener("click", () => {
          if (customConfirmationDialog) {
            customConfirmationDialog.style.display = "none";
          }
          if (currentConfirmCallback) {
            currentConfirmCallback();
            currentConfirmCallback = null;
          }
        });
      }
      
      // Close on overlay click/tap (guard so Android same-tap doesn’t close)
      if (customConfirmationDialog) {
        const overlay = customConfirmationDialog.querySelector(".confirmation-dialog-overlay");
        if (overlay) {
          overlay.addEventListener("click", () => { closeConfirmationIfAllowed(); });
          overlay.addEventListener("touchstart", (e) => {
            e.preventDefault();
            closeConfirmationIfAllowed();
          }, { passive: false });
        }
      }

      // Handle dropdown menu item actions (close chat, create ticket)
      // Flow: Three dots → Close chat → Confirm → Rating screen (same as X button)
      if (closeChatDetailMenuItem) {
        closeChatDetailMenuItem.addEventListener("click", (e) => {
          e.stopPropagation();
          fugahMessageDetailDropdown.style.display = "none";
          
          // Show custom confirmation message before closing
          showCustomConfirmation("هل أنت متأكد من إغلاق الدردشة؟", () => {
            // Show rating screen after confirmation (same as X button)
            showRatingScreen();
          });
        });
        
        // Add touch event listener for mobile devices
        closeChatDetailMenuItem.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          fugahMessageDetailDropdown.style.display = "none";
          
          // Show custom confirmation message before closing
          showCustomConfirmation("هل أنت متأكد من إغلاق الدردشة؟", () => {
            // Show rating screen after confirmation (same as X button)
            showRatingScreen();
          });
        });
      }

      if (createTicketDetailMenuItem) {
        createTicketDetailMenuItem.addEventListener("click", (e) => {
          e.stopPropagation();
          fugahMessageDetailDropdown.style.display = "none";
          
          // Show custom confirmation message before creating ticket
          showCustomConfirmation("هل أنت متأكد من رفع تذكرة؟", () => {
            // Show rating screen after confirmation
            showRatingScreen();
          });
        });
        
        // Add touch event listener for mobile devices
        createTicketDetailMenuItem.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          fugahMessageDetailDropdown.style.display = "none";
          
          // Show custom confirmation message before creating ticket
          showCustomConfirmation("هل أنت متأكد من رفع تذكرة؟", () => {
            // Show rating screen after confirmation
            showRatingScreen();
          });
        });
      }

      // Close chat from rating menu item
      if (closeRatingMenuItem) {
        closeRatingMenuItem.addEventListener("click", (e) => {
          e.stopPropagation();
          fugahRatingDropdown.style.display = "none";
          
          // Show custom confirmation message before closing
          showCustomConfirmation("هل أنت متأكد من إغلاق الدردشة؟", () => {
            // Reset to home screen before closing
            if (mainHomeContainer) mainHomeContainer.style.display = "flex";
            if (mainMessageContainer) mainMessageContainer.style.display = "none";
            if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
            if (mainRatingContainer) mainRatingContainer.style.display = "none";
            if (fugahFooter) fugahFooter.classList.remove("detail-active");
            
            // Reset footer tabs to home
            switchTab("home");
            
            // Close chat
            toggleChat();
          });
        });
      }


      // ========================================
      // END DROPDOWN MENU ACTIONS FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE ITEM CLICK HANDLERS FUNCTIONALITY
      // ========================================
      // Add click handlers to message items for opening detail view
      messageItems.forEach(item => {
        item.addEventListener("click", () => {
          const messageId = item.getAttribute("data-message-id");
          if (messageId) {
            openMessageDetail(messageId);
          }
        });
        // Make message items look clickable
        item.style.cursor = "pointer";
      });


      // ========================================
      // END MESSAGE ITEM CLICK HANDLERS FUNCTIONALITY
      // ========================================


      // ========================================
      // FOOTER TAB CLICK HANDLERS FUNCTIONALITY
      // ========================================
      // Add click handlers to footer tabs for tab switching
      footerTabItems.forEach(item => {
        item.addEventListener("click", () => {
          const tabType = item.getAttribute("data-tab");
          switchTab(tabType);
        });
      });


      // ========================================
      // END FOOTER TAB CLICK HANDLERS FUNCTIONALITY
      // ========================================


      // ========================================
      // INITIAL DISPLAY STATE FUNCTIONALITY
      // ========================================
      // Initialize display states and set home tab as active by default
      if (mainHomeContainer) {
        mainHomeContainer.style.display = "flex";
      }
      if (mainMessageContainer) {
        mainMessageContainer.style.display = "none";
      }
      if (mainMessageDetailContainer) {
        mainMessageDetailContainer.style.display = "none";
      }
      
      // Initialize tab state (Home active by default)
      switchTab("home");


      // ========================================
      // END INITIAL DISPLAY STATE FUNCTIONALITY
      // ========================================


      // ========================================
      // THEME SWITCHING FUNCTIONALITY
      // ========================================
      // Main theme switching function that updates all UI elements based on selected theme
      function changeTheme(themeName) {
        const chatWindow = shadow.querySelector("#chat-window");
        const chatIcon = shadow.querySelector("#chat-icon");
        const sendButton = shadow.querySelector("#message-detail-send-btn img");
        const mainSendButton = shadow.querySelector(".fugah-send-button img");
        const footerTabItems = shadow.querySelectorAll(".fugah-footer-tab-item");
        const backArrow = shadow.querySelector("#message-detail-back-btn");
        const messageListArrows = shadow.querySelectorAll(".message-item img");
        const messageCloseBtn = shadow.querySelector("#message-close-btn");
        const footerLogo = shadow.querySelector("#footer-logo");
        const fileUploadIcon = shadow.querySelector("#file-upload-icon");
        const dropdownIcon = shadow.querySelector("#fugah-message-detail-dropdown-icon");
        
        // Change main page background image based on theme
        const fugahBody = document.querySelector('.fugah-body');
        if (fugahBody) {
          let backgroundImagePath;
          switch(themeName) {
            case 'green':
              // Use main-bg.png for green theme as specified
              backgroundImagePath = "url('assets/main-bg.png')";
              break;
            case 'red':
              backgroundImagePath = "url('assets/main-red-bg.png')";
              break;
            case 'blue':
              backgroundImagePath = "url('assets/main-blue-bg.png')";
              break;
            case 'yellow':
              backgroundImagePath = "url('assets/main-yellow-bg.png')";
              break;
            case 'cyan':
              backgroundImagePath = "url('assets/main-cyan-bg.png')";
              break;
            case 'black':
              backgroundImagePath = "url('assets/main-black-bg.png')";
              break;
            case 'white':
              backgroundImagePath = "url('assets/main-white-bg.png')";
              break;
            default:
              backgroundImagePath = "url('assets/main-bg.png')";
              break;
          }
          // Only set background image if chat is not open OR if not mobile (on tablet/desktop, keep background even when chat is open)
          const isMobile = window.innerWidth <= 767;
          if (!isOpen || !isMobile) {
            fugahBody.style.backgroundImage = backgroundImagePath;
          }
        }
        
        if (chatWindow) {
          // Remove all existing theme classes
          chatWindow.classList.remove('theme-green', 'theme-red', 'theme-blue', 'theme-yellow', 'theme-cyan', 'theme-black', 'theme-white');
          
          // Add the new theme class
          chatWindow.classList.add(`theme-${themeName}`);
          
          // Change chat bubble icon based on theme and current state (open/closed)
          if (chatIcon) {
            let iconPath;
            
            // COMMENTED OUT: X icon logic when chat is open - bubble will be hidden instead
            // Uncomment below if you need to show X icon when chat is open in the future
            if (isOpen) {
              // Use theme-specific X icon - COMMENTED OUT
              /*
              switch(themeName) {
                case 'green':
                  iconPath = getAssetPath("X-green.png");
                  break;
                case 'red':
                  iconPath = getAssetPath("X-red.png");
                  break;
                case 'blue':
                  iconPath = getAssetPath("x-blue.png");
                  break;
                case 'yellow':
                  iconPath = getAssetPath("X-yellow.png");
                  break;
                case 'cyan':
                  iconPath = getAssetPath("X-cyan.png");
                  break;
                case 'white':
                  iconPath = getAssetPath("X.png");
                  break;
                case 'black':
                default:
                  iconPath = getAssetPath("X.png");
                  break;
              }
              chatIcon.src = iconPath;
              */
              // Don't change icon when chat is open - bubble will be hidden
              // Skip icon change, continue with rest of theme changes
            } else {
              // Use theme-specific message icon
              switch(themeName) {
                case 'green':
                  iconPath = getAssetPath("message-green.png");
                  break;
                case 'red':
                  iconPath = getAssetPath("message-red.png");
                  break;
                case 'blue':
                  iconPath = getAssetPath("message-blue.png");
                  break;
                case 'yellow':
                  iconPath = getAssetPath("message-yellow.png");
                  break;
                case 'cyan':
                  iconPath = getAssetPath("message-cyan.png");
                  break;
                case 'white':
                  iconPath = getAssetPath("message-white.png");
                  break;
                case 'black':
                default:
                  iconPath = getAssetPath("message.png"); // Keep default for black theme
                  break;
              }
            }
            // Only set icon if chat is closed (when chat is open, bubble is hidden)
            if (!isOpen && iconPath) {
              chatIcon.src = iconPath;
            }
          }
          
          // Change message detail send button icon based on theme
          if (sendButton) {
            let sendButtonPath;
            switch(themeName) {
              case 'green':
                sendButtonPath = getAssetPath("fugah-send-button-green.png");
                break;
              case 'red':
                sendButtonPath = getAssetPath("fugah-send-button-red.png");
                break;
              case 'blue':
                sendButtonPath = getAssetPath("fugah-send-button-cyan.png");
                break;
              case 'yellow':
                sendButtonPath = getAssetPath("fugah-send-button-yellow.png");
                break;
              case 'cyan':
                sendButtonPath = getAssetPath("fugah-send-button-blue.png");
                break;
              case 'white':
                sendButtonPath = getAssetPath("fugah-send-button-white.png");
                break;
              case 'black':
              default:
                sendButtonPath = getAssetPath("black-arrow.png"); // Black arrow for black theme
                break;
            }
            sendButton.src = sendButtonPath;
          }
          
          // Change main send button icon based on theme
          if (mainSendButton) {
            let mainSendIconPath;
            switch(themeName) {
              case 'green':
                mainSendIconPath = getAssetPath("send-icon.png");
                break;
              case 'red':
                mainSendIconPath = getAssetPath("send-icon.png");
                break;
              case 'blue':
                mainSendIconPath = getAssetPath("send-icon.png");
                break;
              case 'yellow':
                mainSendIconPath = getAssetPath("send-icon.png");
                break;
              case 'cyan':
                mainSendIconPath = getAssetPath("send-icon.png");
                break;
              case 'white':
                mainSendIconPath = getAssetPath("send-icon.png");
                break;
              case 'black':
              default:
                mainSendIconPath = getAssetPath("send-icon.png"); // Default for black theme
                break;
            }
            mainSendButton.src = mainSendIconPath;
          }
          
          // Change footer tab images based on theme and active state
          if (footerTabItems && footerTabItems.length > 0) {
            footerTabItems.forEach(item => {
              const tabType = item.getAttribute("data-tab");
              const img = item.querySelector("img");
              const isActive = item.classList.contains("active");
              
              if (img && tabType) {
                let imagePath;
                
                if (themeName === 'black') {
                  // Use black theme specific images
                  if (tabType === "message") {
                    imagePath = isActive ? 
                      getAssetPath("active-message-footer-black.png") : 
                      getAssetPath("inactive-message-footer-black.png.png");
                  } else if (tabType === "home") {
                    imagePath = isActive ? 
                      getAssetPath("active-home-footer-black.png") : 
                      getAssetPath("inactive-home-footer.png.png");
                  }
                } else {
                  // Use default images for all other themes
                  if (tabType === "message") {
                    imagePath = isActive ? 
                      getAssetPath("active-message-footer.png") : 
                      getAssetPath("inactive-message-footer.png");
                  } else if (tabType === "home") {
                    imagePath = isActive ? 
                      getAssetPath("active-home-footer.png") : 
                      getAssetPath("inactive-home-footer-black.png.png");
                  }
                }
                
                if (imagePath) {
                  img.src = imagePath;
                }
              }
            });
          }
          
          // Set message detail back button based on theme
          if (backArrow) {
            if (themeName === 'black') {
              backArrow.src = getAssetPath("exit-button-for-black.png");
              console.log("Set message detail back button to exit-button-for-black.png for black theme");
            } else {
              backArrow.src = getAssetPath("white-exit-button.png");
              console.log("Set message detail back button to white-exit-button.png for theme:", themeName);
            }
          }
          
          // Set rating screen back button based on theme (same as chat screen – white-exit / exit-for-black)
          const ratingBackButton = shadow.querySelector("#rating-back-btn");
          if (ratingBackButton) {
            if (themeName === 'black') {
              ratingBackButton.src = getAssetPath("exit-button-for-black.png");
              console.log("Set rating back button to exit-button-for-black.png for black theme");
            } else {
              ratingBackButton.src = getAssetPath("white-exit-button.png");
              console.log("Set rating back button to white-exit-button.png for theme:", themeName);
            }
          }
          
          // Set message list arrows for ALL users based on theme
          const messageListArrows = shadow.querySelectorAll(".message-item img");
          console.log(`Found ${messageListArrows.length} message list arrows for theme: ${themeName}`);
          messageListArrows.forEach((arrow, index) => {
            if (themeName === 'black') {
              arrow.src = getAssetPath("arrow-for-black1.png");
              console.log(`Set message list arrow ${index + 1} to arrow-for-black1.png for black theme`);
            } else {
              arrow.src = getAssetPath("right-arrow.png");
              console.log(`Set message list arrow ${index + 1} to right-arrow.png for theme: ${themeName}`);
            }
          });
          
          // Set message close button icon based on theme
          if (messageCloseBtn) {
            if (themeName === 'black') {
              messageCloseBtn.src = getAssetPath("exit-button-for-black.png");
              console.log("Set message close button to exit-button-for-black.png for black theme");
            } else {
              messageCloseBtn.src = getAssetPath("X.png");
              console.log("Set message close button to X.png for theme:", themeName);
            }
          }
          
          // Set footer logo based on theme
          if (footerLogo) {
            if (themeName === 'black') {
              footerLogo.src = getAssetPath("black-logo.png");
              console.log("Set footer logo to black-logo.png for black theme");
            } else {
              footerLogo.src = getAssetPath("fugah-footer-end.png");
              console.log("Set footer logo to fugah-footer-end.png for theme:", themeName);
            }
          }
          
          // Set file upload icon based on theme
          if (fileUploadIcon) {
            if (themeName === 'black') {
              fileUploadIcon.src = getAssetPath("black-new.png");
              console.log("Set file upload icon to black-new.png for black theme");
            } else {
              fileUploadIcon.src = getAssetPath("fugah-file-icon.png");
              console.log("Set file upload icon to fugah-file-icon.png for theme:", themeName);
            }
          }
          
          // Set dropdown icon based on theme
          if (dropdownIcon) {
            if (themeName === 'black') {
              dropdownIcon.src = getAssetPath("white-dropdown.png");
              console.log("Set dropdown icon to white-dropdown.png for black theme");
            } else {
              dropdownIcon.src = getAssetPath("fugah-menue-dropdown.png");
              console.log("Set dropdown icon to fugah-menue-dropdown.png for theme:", themeName);
            }
          }
          
          // Set rating dropdown icon based on theme
          const ratingDropdownIcon = shadow.querySelector("#fugah-rating-dropdown-icon");
          if (ratingDropdownIcon) {
            if (themeName === 'black') {
              ratingDropdownIcon.src = getAssetPath("white-dropdown.png");
              console.log("Set rating dropdown icon to white-dropdown.png for black theme");
            } else {
              ratingDropdownIcon.src = getAssetPath("fugah-menue-dropdown.png");
              console.log("Set rating dropdown icon to fugah-menue-dropdown.png for theme:", themeName);
            }
          }
          
          // Initialize footer tab images based on current active state
          if (footerTabItems && footerTabItems.length > 0) {
            footerTabItems.forEach(item => {
              const tabType = item.getAttribute("data-tab");
              const img = item.querySelector("img");
              const isActive = item.classList.contains("active");

              if (img && tabType) {
                let imagePath;
                if (themeName === 'black') {
                  if (tabType === "message") {
                    imagePath = isActive ? getAssetPath("active-message-footer-black.png") : getAssetPath("inactive-message-footer-black.png.png");
                  } else if (tabType === "home") {
                    imagePath = isActive ? getAssetPath("active-home-footer-black.png") : getAssetPath("new-img.png");
                  }
                } else {
                  if (tabType === "message") {
                    imagePath = isActive ? getAssetPath("active-message-footer.png") : getAssetPath("inactive-message-footer.png");
                  } else if (tabType === "home") {
                    imagePath = isActive ? getAssetPath("active-home-footer.png") : getAssetPath("inactive-home-footer.png.png");
                  }
                }
                if (imagePath) {
                  img.src = imagePath;
                  console.log(`Initialized ${tabType} tab image (${isActive ? 'active' : 'inactive'}) for theme ${themeName}:`, imagePath);
                }
              }
            });
          }
          
          console.log("Theme changed to:", themeName);
          console.log("Chat window classes:", chatWindow.className);
          console.log("Chat icon changed to:", chatIcon ? chatIcon.src : "not found");
          console.log("Send button changed to:", sendButton ? sendButton.src : "not found");
          console.log("Main send button changed to:", mainSendButton ? mainSendButton.src : "not found");
          console.log("Footer tab images updated for theme:", themeName);
        } else {
          console.error("Chat window not found in shadow DOM");
        }
      }


      // ========================================
      // END THEME SWITCHING FUNCTIONALITY
      // ========================================


      // ========================================
      // GLOBAL THEME FUNCTION EXPOSURE FUNCTIONALITY
      // ========================================
      // Expose theme changing function globally for external access
      window.changeChatbotTheme = changeTheme;


      // ========================================
      // END GLOBAL THEME FUNCTION EXPOSURE FUNCTIONALITY
      // ========================================


      // ========================================
      // INITIAL THEME SETUP FUNCTIONALITY
      // ========================================
      // Set initial theme if specified in script tag data attribute
      const scriptTag = document.querySelector('script[data-theme]');
      if (scriptTag) {
        const initialTheme = scriptTag.getAttribute('data-theme');
        if (initialTheme) {
          setTimeout(() => {
            changeTheme(initialTheme);
          }, 100);
        }
      }


      // ========================================
      // END INITIAL THEME SETUP FUNCTIONALITY
      // ========================================


      // ========================================
      // MESSAGE ADDING UTILITY FUNCTIONALITY
      // ========================================
      // Utility function to add messages to main message container (for future use)
      function addMessage(text, type) {
        if (!mainMessageContainer) return;
        
        const messageDiv = document.createElement("div");
        messageDiv.className = `message`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
          padding: 12px 16px;
          margin-bottom: 10px;
          border-radius: 18px;
          max-width: 80%;
          word-wrap: break-word;
        `;
        mainMessageContainer.appendChild(messageDiv);
        mainMessageContainer.scrollTop = mainMessageContainer.scrollHeight;
      }


      // ========================================
      // END MESSAGE ADDING UTILITY FUNCTIONALITY
      // ========================================

    })
    .catch(err => console.error("Failed to load ui.html:", err));

})();
