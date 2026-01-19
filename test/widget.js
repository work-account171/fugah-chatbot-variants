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
      const mainRatingContainer = shadow.querySelector(".main-rating-container");
      const ratingBackBtn = shadow.querySelector("#rating-back-btn");
          const messageCloseBtn = shadow.querySelector("#message-close-btn");
          const messageDetailBackBtn = shadow.querySelector("#message-detail-back-btn");
          const fugahMessageDetailDropdownIcon = shadow.querySelector("#fugah-message-detail-dropdown-icon");
          const fugahMessageDetailDropdown = shadow.querySelector("#fugah-message-detail-dropdown");
          const closeChatDetailMenuItem = shadow.querySelector("#close-chat-detail-menu-item");
          const createTicketDetailMenuItem = shadow.querySelector("#create-ticket-detail-menu-item");
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
      // FIXED COUNTRY CODE DISPLAY FUNCTIONALITY
      // ========================================
      // Handle fixed country code that always stays visible
      if (phoneInput) {
        // Function to show/hide placeholder based on input content
        const updatePlaceholderVisibility = () => {
          if (customPlaceholder) {
            const value = phoneInput.value;
            // Show placeholder if only country code exists (e.g., "+966 "), hide if there are digits after it
            const phoneNumber = value.match(/^\+\d{1,4}\s(.+)/);
            if (phoneNumber && phoneNumber[1].trim().length > 0) {
              customPlaceholder.style.display = "none";
            } else {
              customPlaceholder.style.display = "block";
            }
          }
        };
        
        // Always start with +966 and position cursor after it
        phoneInput.value = "+966 ";
        
        // Show placeholder initially since no digits are entered yet
        updatePlaceholderVisibility();
        
        phoneInput.addEventListener("input", (e) => {
          let value = e.target.value;
          
          // Ensure it always starts with + and has proper format
          if (!value.startsWith("+")) {
            phoneInput.value = "+966 ";
            setTimeout(() => {
              phoneInput.setSelectionRange(5, 5);
            }, 0);
            updatePlaceholderVisibility();
            return;
          }
          
          // Parse the country code and phone number
          const match = value.match(/^\+(\d{0,4})\s*(.*)/);
          if (match) {
            let countryCode = match[1];
            let phoneNumber = match[2];
            
            // Ensure country code is not empty, default to 966
            if (countryCode === "") {
              countryCode = "966";
            }
            
            // Clean phone number (only digits)
            phoneNumber = phoneNumber.replace(/[^\d]/g, '');
            
            // Reconstruct the value
            const newValue = `+${countryCode} ${phoneNumber}`;
            
            if (value !== newValue) {
              const cursorPos = phoneInput.selectionStart;
              phoneInput.value = newValue;
              
              // Maintain cursor position appropriately
              if (cursorPos <= 4) {
                setTimeout(() => {
                  phoneInput.setSelectionRange(cursorPos, cursorPos);
                }, 0);
              } else {
                setTimeout(() => {
                  phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
                }, 0);
              }
            }
            
            // Update placeholder visibility after value changes
            updatePlaceholderVisibility();
          } else {
            // Fallback to default format
            phoneInput.value = "+966 ";
            setTimeout(() => {
              phoneInput.setSelectionRange(5, 5);
            }, 0);
            updatePlaceholderVisibility();
          }
        });

        phoneInput.addEventListener("keydown", (e) => {
          const cursorPos = phoneInput.selectionStart;
          const value = phoneInput.value;
          
          // Allow editing country code (positions 1-3) but protect + and space
          if (cursorPos === 0) {
            // Prevent editing the + sign
            if (e.key === "Backspace" || e.key === "Delete" || (e.key.length === 1 && e.key !== "+")) {
              e.preventDefault();
              phoneInput.setSelectionRange(1, 1);
              return;
            }
          } else if (cursorPos >= 1 && cursorPos <= 3) {
            // Allow editing country code digits
            if (e.key.length === 1 && /\d/.test(e.key)) {
              // Allow digit input in country code area
              return;
            } else if (e.key === "Backspace") {
              // Allow backspace in country code area
              return;
            } else if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
              e.preventDefault();
              return;
            }
          } else if (cursorPos === 4) {
            // Protect the space after country code
            if (e.key === "Backspace" || e.key === "Delete" || (e.key.length === 1 && e.key !== " ")) {
              e.preventDefault();
              return;
            }
          }
          
          // Handle Enter key
          if (e.key === "Enter" && sendMessageBtn) {
            sendMessageBtn.click();
          }
        });

        phoneInput.addEventListener("focus", () => {
          // Ensure proper format exists
          if (!phoneInput.value.match(/^\+\d{1,4}\s/)) {
            phoneInput.value = "+966 ";
            setTimeout(() => {
              phoneInput.setSelectionRange(5, 5);
            }, 0);
          }
          updatePlaceholderVisibility();
        });

        phoneInput.addEventListener("blur", () => {
          // Ensure proper format on blur
          if (!phoneInput.value.match(/^\+\d{1,4}\s/)) {
            phoneInput.value = "+966 ";
          }
          updatePlaceholderVisibility();
        });

        phoneInput.addEventListener("click", (e) => {
          // Allow clicking anywhere, but ensure proper format
          if (!phoneInput.value.match(/^\+\d{1,4}\s/)) {
            phoneInput.value = "+966 ";
            setTimeout(() => {
              phoneInput.setSelectionRange(5, 5);
            }, 0);
          }
          updatePlaceholderVisibility();
        });

        // Handle paste events
        phoneInput.addEventListener("paste", (e) => {
          e.preventDefault();
          const pastedText = (e.clipboardData || window.clipboardData).getData('text');
          const numbers = pastedText.replace(/[^\d]/g, '');
          
          // Always append numbers after "+966 "
          const currentNumbers = phoneInput.value.substring(5);
          phoneInput.value = "+966 " + currentNumbers + numbers;
          
          // Position cursor at the end
          setTimeout(() => {
            phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
          }, 0);
          updatePlaceholderVisibility();
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
        
        // Disable input while bot is responding
        if (messageDetailInput) {
          messageDetailInput.disabled = true;
          messageDetailInput.setAttribute('readonly', 'readonly');
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
        
        // Re-enable input when bot finishes responding (when bot message is added)
        if (!isUser && messageDetailInput) {
          messageDetailInput.disabled = false;
          messageDetailInput.removeAttribute('readonly');
        }
        
        // Handle timestamp based on message type
        if (updateTimestamp) {
          // Bot message: Remove existing timestamp first, then add new one
          const existingTimestamp = messageDetailMessages.querySelector(".last-message-timestamp");
          if (existingTimestamp) {
            existingTimestamp.remove();
          }
          updateLastMessageTimestamp();
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
        
        // Add new timestamp for the last message
        const timestampDiv = document.createElement("div");
        timestampDiv.className = "last-message-timestamp chat-message-datetime";
        timestampDiv.textContent = formatDateTime();
        messageDetailMessages.appendChild(timestampDiv);
        
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

      // Add click handler to message detail back button
      if (messageDetailBackBtn) {
        messageDetailBackBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          goBackToMessageList();
        });
      }

      // Add click handler to rating screen back button
      if (ratingBackBtn) {
        ratingBackBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          
          // Reset emoji selection when leaving rating screen
          resetRatingEmojis();
          
          // Hide rating container
          if (mainRatingContainer) {
            mainRatingContainer.style.display = "none";
          }
          
          // Show message detail container
          if (mainMessageDetailContainer) {
            mainMessageDetailContainer.style.display = "flex";
          }
          
          // Keep detail-active class on footer (tabs should be hidden)
          if (fugahFooter) {
            fugahFooter.classList.add("detail-active");
          }
        });
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
      // Handle message detail dropdown menu toggle and outside click closing
      if (fugahMessageDetailDropdownIcon) {
        fugahMessageDetailDropdownIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          const isVisible = fugahMessageDetailDropdown.style.display === "block";
          fugahMessageDetailDropdown.style.display = isVisible ? "none" : "block";
        });
      }

      // Handle rating dropdown menu toggle
      if (fugahRatingDropdownIcon) {
        fugahRatingDropdownIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          const isVisible = fugahRatingDropdown.style.display === "block";
          fugahRatingDropdown.style.display = isVisible ? "none" : "block";
        });
      }

      // Close dropdown when clicking outside
      shadow.addEventListener("click", (e) => {
        // Close message detail dropdown
        if (fugahMessageDetailDropdown && fugahMessageDetailDropdownIcon) {
          if (!fugahMessageDetailDropdown.contains(e.target) && !fugahMessageDetailDropdownIcon.contains(e.target)) {
            fugahMessageDetailDropdown.style.display = "none";
          }
        }
        
        // Close rating dropdown
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
          
          // Copy messages from message detail to rating screen
          const ratingMessages = shadow.querySelector("#rating-messages");
          if (messageDetailMessages && ratingMessages) {
            // Clone all messages from message detail
            ratingMessages.innerHTML = messageDetailMessages.innerHTML;
            
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
        });
      }

      // Close chat from rating menu item
      if (closeRatingMenuItem) {
        closeRatingMenuItem.addEventListener("click", (e) => {
          e.stopPropagation();
          fugahRatingDropdown.style.display = "none";
          toggleChat();
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
          
          // Set rating screen back button based on theme
          const ratingBackButton = shadow.querySelector("#rating-back-btn");
          if (ratingBackButton) {
            if (themeName === 'black') {
              ratingBackButton.src = getAssetPath("back-tick-black.png");
              console.log("Set rating back button to back-tick-black.png for black theme");
            } else {
              ratingBackButton.src = getAssetPath("right-arrow.png");
              console.log("Set rating back button to right-arrow.png for theme:", themeName);
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
