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
  fetch("https://n8n.srv1196634.hstgr.cloud/webhook/body")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Error fetching response from n8n server:", error);
  });
  
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
      const closeBtn = shadow.querySelector("#close-btn");
      const sendMessageBtn = shadow.querySelector(".fugah-send-button");
      const phoneInput = shadow.querySelector("#phone-input");
      const customPlaceholder = shadow.querySelector("#custom-placeholder");
      const mainHomeContainer = shadow.querySelector(".main-home-container");
      const mainMessageContainer = shadow.querySelector(".main-message-container");
      const mainMessageDetailContainer = shadow.querySelector(".main-message-detail-container");
      const messageCloseBtn = shadow.querySelector("#message-close-btn");
      const messageDetailBackBtn = shadow.querySelector("#message-detail-back-btn");
      const fugahMessageDetailDropdownIcon = shadow.querySelector("#fugah-message-detail-dropdown-icon");
      const fugahMessageDetailDropdown = shadow.querySelector("#fugah-message-detail-dropdown");
      const closeChatDetailMenuItem = shadow.querySelector("#close-chat-detail-menu-item");
      const createTicketDetailMenuItem = shadow.querySelector("#create-ticket-detail-menu-item");
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
      
      // Fix initial arrow paths
      const backArrow = shadow.querySelector("#message-detail-back-btn");
      const messageListArrows = shadow.querySelectorAll(".message-item img");
      if (backArrow) {
        backArrow.src = getAssetPath("right-arrow.png");
      }
      // messageListArrows will be set correctly by changeTheme() function


      // ========================================
      // END INITIAL ICON SETUP FUNCTIONALITY
      // ========================================


      // ========================================
      // CHAT WINDOW TOGGLE FUNCTIONALITY
      // ========================================
      // Handle opening and closing of chat window with icon switching
      let isOpen = false;

      const toggleChat = () => {
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? "flex" : "none";
        
        // Toggle icon between message and cross based on current theme
        if (isOpen) {
          // Get current theme to set correct X icon
          const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
          const themeName = currentTheme ? currentTheme[1] : 'black';
          
          let xIconPath;
          switch(themeName) {
            case 'green':
              xIconPath = getAssetPath("X-green.png");
              break;
            case 'red':
              xIconPath = getAssetPath("X-red.png");
              break;
            case 'blue':
              xIconPath = getAssetPath("X-blue.png");
              break;
            case 'yellow':
              xIconPath = getAssetPath("X-yellow.png");
              break;
            case 'cyan':
              xIconPath = getAssetPath("X-cyan.png");
              break;
            case 'white':
              xIconPath = getAssetPath("X-white.png");
              break;
            case 'black':
            default:
              xIconPath = getAssetPath("X.png"); // Default X for black theme
              break;
          }
          
          chatIcon.src = xIconPath;
          bubble.classList.add("chat-open");
        } else {
          // Get current theme to set correct message icon
          const currentTheme = chatWindow.classList.toString().match(/theme-(\w+)/);
          const themeName = currentTheme ? currentTheme[1] : 'black';
          
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
      bubble.addEventListener("click", toggleChat);

      // Close chat from header close button
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          console.log("Close button clicked");
          e.stopPropagation();
          toggleChat();
        });
        console.log("Close button event listener added");
      } else {
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
      // CUSTOM PLACEHOLDER FUNCTIONALITY
      // ========================================
      // Handle custom placeholder behavior for phone input with mixed styling
      if (phoneInput && customPlaceholder) {
        phoneInput.addEventListener("input", () => {
          if (phoneInput.value.length > 0) {
            customPlaceholder.style.display = "none";
          } else {
            customPlaceholder.style.display = "flex";
          }
        });

        phoneInput.addEventListener("focus", () => {
          if (phoneInput.value.length === 0) {
            customPlaceholder.style.display = "none";
          }
        });

        phoneInput.addEventListener("blur", () => {
          if (phoneInput.value.length === 0) {
            customPlaceholder.style.display = "flex";
          }
        });
      }


      // ========================================
      // END CUSTOM PLACEHOLDER FUNCTIONALITY
      // ========================================


      // ========================================
      // MAIN SEND BUTTON FUNCTIONALITY
      // ========================================
      // Handle main send button click - switches to message tab
      if (sendMessageBtn) {
        sendMessageBtn.addEventListener("click", () => {
          // Switch to message tab (same as footer message icon)
          switchTab("message");
        });
      }

      // Handle phone input enter key
      if (phoneInput) {
        phoneInput.addEventListener("keydown", e => {
          if (e.key === "Enter" && sendMessageBtn) {
            sendMessageBtn.click();
          }
        });
      }


      // ========================================
      // END MAIN SEND BUTTON FUNCTIONALITY
      // ========================================


      // ========================================
      // TAB SWITCHING FUNCTIONALITY
      // ========================================
      // Handle switching between home and message tabs with proper image updates
      function switchTab(tabName) {
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
          if (mainHomeContainer) mainHomeContainer.style.display = "flex";
          if (mainMessageContainer) mainMessageContainer.style.display = "none";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
          // Remove detail-active class from footer
          if (fugahFooter) fugahFooter.classList.remove("detail-active");
        } else if (tabName === "message") {
          if (mainHomeContainer) mainHomeContainer.style.display = "none";
          if (mainMessageContainer) mainMessageContainer.style.display = "block";
          if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "none";
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
        // Hide message list container
        if (mainMessageContainer) mainMessageContainer.style.display = "none";
        // Show message detail container
        if (mainMessageDetailContainer) mainMessageDetailContainer.style.display = "flex";
        // Add detail-active class on footer (tabs should be hidden in detail view)
        if (fugahFooter) fugahFooter.classList.add("detail-active");
        
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
        
        // Convert to 12-hour format
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
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
      // Add messages to detail chat with date/time stamps and sound notifications
      function addDetailMessage(text, isUser = true) {
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
        
        // Add date/time for both user and bot messages - outside the message container
        const dateTimeDiv = document.createElement("div");
        dateTimeDiv.className = `chat-message-datetime ${isUser ? "user-datetime" : "bot-datetime"}`;
        dateTimeDiv.textContent = formatDateTime();
        messageDetailMessages.appendChild(dateTimeDiv);
        
        // Play message sound notification
        playMessageSound();
        
        // Scroll to bottom
        setTimeout(() => {
          messageDetailMessages.scrollTop = messageDetailMessages.scrollHeight;
        }, 50);
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
        
        // Add user message
        addDetailMessage(message, true);
        
        // Clear input
        messageDetailInput.value = "";
        
        // Update send button state
        toggleMessageDetailSendButtonState();
        
        // Show loading indicator
        showLoadingIndicator();
        
        // Simulate bot response (after delay)
        setTimeout(() => {
          addDetailMessage("شكراً لك! سأقوم بالرد عليك قريباً.", false);
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
            sendDetailMessage();
          }
        });

        // Toggle send button state based on input content
        messageDetailInput.addEventListener("input", () => {
          toggleMessageDetailSendButtonState();
        });
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
        // Remove detail-active class from footer (tabs should be visible in message list)
        if (fugahFooter) fugahFooter.classList.remove("detail-active");
        // Clear input when going back
        if (messageDetailInput) {
          messageDetailInput.value = "";
          toggleMessageDetailSendButtonState();
        }
      }

      // Add click handler to message detail back button
      if (messageDetailBackBtn) {
        messageDetailBackBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          goBackToMessageList();
        });
      }


      // ========================================
      // END MESSAGE LIST NAVIGATION FUNCTIONALITY
      // ========================================


      // ========================================
      // DROPDOWN MENU FUNCTIONALITY
      // ========================================
      // Handle message detail dropdown menu toggle and outside click closing
      if (fugahMessageDetailDropdownIcon) {
        fugahMessageDetailDropdownIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          const isVisible = fugahMessageDetailDropdown.style.display === "block";
          fugahMessageDetailDropdown.style.display = isVisible ? "none" : "block";
        });
      }

      // Close dropdown when clicking outside
      shadow.addEventListener("click", (e) => {
        if (fugahMessageDetailDropdown && fugahMessageDetailDropdownIcon) {
          if (!fugahMessageDetailDropdown.contains(e.target) && !fugahMessageDetailDropdownIcon.contains(e.target)) {
            fugahMessageDetailDropdown.style.display = "none";
          }
        }
      });


      // ========================================
      // END DROPDOWN MENU FUNCTIONALITY
      // ========================================


      // ========================================
      // DROPDOWN MENU ACTIONS FUNCTIONALITY
      // ========================================
      // Handle dropdown menu item actions (close chat, create ticket)
      if (closeChatDetailMenuItem) {
        closeChatDetailMenuItem.addEventListener("click", (e) => {
          e.stopPropagation();
          fugahMessageDetailDropdown.style.display = "none";
          toggleChat();
        });
      }

      if (createTicketDetailMenuItem) {
        createTicketDetailMenuItem.addEventListener("click", (e) => {
          e.stopPropagation();
          fugahMessageDetailDropdown.style.display = "none";
          // Add your ticket creation logic here
          console.log("Create ticket clicked from detail menu");
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
        
        if (chatWindow) {
          // Remove all existing theme classes
          chatWindow.classList.remove('theme-green', 'theme-red', 'theme-blue', 'theme-yellow', 'theme-cyan', 'theme-black', 'theme-white');
          
          // Add the new theme class
          chatWindow.classList.add(`theme-${themeName}`);
          
          // Change chat bubble icon based on theme and current state (open/closed)
          if (chatIcon) {
            let iconPath;
            
            // Check if chat is currently open (showing X icon)
            if (isOpen) {
              // Use theme-specific X icon
              switch(themeName) {
                case 'green':
                  iconPath = getAssetPath("X-green.png");
                  break;
                case 'red':
                  iconPath = getAssetPath("X-red.png");
                  break;
                case 'blue':
                  iconPath = getAssetPath("X-cyan.png");
                  break;
                case 'yellow':
                  iconPath = getAssetPath("X-yellow.png");
                  break;
                case 'cyan':
                  iconPath = getAssetPath("x-blue.png");
                  break;
                case 'white':
                  iconPath = getAssetPath("X.png");
                  break;
                case 'black':
                default:
                  iconPath = getAssetPath("X.png");
                  break;
              }
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
            chatIcon.src = iconPath;
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
              backArrow.src = getAssetPath("back-tick-black.png");
              console.log("Set message detail back button to back-tick-black.png for black theme");
            } else {
              backArrow.src = getAssetPath("right-arrow.png");
              console.log("Set message detail back button to right-arrow.png for theme:", themeName);
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